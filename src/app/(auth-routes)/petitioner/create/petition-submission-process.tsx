"use client";

import React, { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Accept } from "react-dropzone"; // Import react-dropzone
import { PlusCircle, Trash2 } from "lucide-react"; // Icons
// --- Shadcn UI Component Imports ---
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
// Input removed as URL inputs are replaced
// Select removed as Type is removed
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileUploadZone } from "@/app/(auth-routes)/petitioner/create/file-upload-zone";
import { useSubmissionStore } from "@/store/submission-store";
import { useUserStore } from "@/store/userStore";
import { submitPetition } from "@/actions/petitions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

// Schema for a single source entry (only URL needed now)
const sourceEntrySchema = z.object({
  id: z.string().uuid(), // Unique ID for list keys and deletion
  url: z.string().url({ message: "Uploaded file URL is required." }), // Stores the URL returned after upload
  // type: z.string().min(3).optional(), // Type removed
  fileName: z.string().optional(), // Store original filename for display
});

// Main submission schema
const submissionSchema = z.object({
  petitionUrl: z
    .string()
    .url({ message: "A valid URL for the uploaded petition PDF is required." }),
  subjectMatter: z.string().min(5, "The subject is required"), // Store original filename
  petitionFileName: z.string().optional(), // Store original filename
  sources: z.array(sourceEntrySchema).min(0), // Sources are optional
});

// --- Type Definitions ---
type Source = z.infer<typeof sourceEntrySchema>;
type SubmissionFormData = z.infer<typeof submissionSchema>;

// --- Helper Function ---
const generateUUID = () => crypto.randomUUID();

// --- Upload Function ---
interface UploadResponse {
  publicUrl: string;
  error?: string;
}

// --- Child Component: AddSourceDialogContent ---
// Content inside the dialog for adding a source, now using FileUploadZone
interface AddSourceDialogContentProps {
  onSourceUploaded: (url: string, file: File) => void; // Pass URL and file info
  onClose: () => void;
}

const AddSourceDialogContent: React.FC<AddSourceDialogContentProps> = ({
  onSourceUploaded,
  onClose,
}) => {
  const handleFileUploaded = (url: string, file: File) => {
    onSourceUploaded(url, file); // Pass data up
    onClose(); // Close dialog on successful upload
  };

  // Define accepted file types for sources
  const sourceAcceptTypes: Accept = {
    "application/pdf": [".pdf"],
    "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    "video/*": [".mp4", ".mov", ".avi", ".mkv"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    // Add other types as needed
  };

  return (
    <div className="grid gap-4 py-4">
      <FileUploadZone
        onFileUpload={handleFileUploaded}
        accept={sourceAcceptTypes}
        label="Upload Supporting File"
        description="PDF, Image, Video, DOCX etc."
        uploadPathPrefix="sources/" // Upload sources to a 'sources' folder
      />
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="rounded-md"
        >
          Cancel
        </Button>
        {/* Submission happens via dropzone callback now */}
      </DialogFooter>
    </div>
  );
};

// --- Main Component: PetitionSubmissionProcess ---
const PetitionSubmissionProcess = () => {
  // State for dialog visibility
  const [isSourceDialogOpen, setIsSourceDialogOpen] = useState(false);

  // Initialize react-hook-form for the main submission form
  const form = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      petitionUrl: "",
      petitionFileName: "",
      sources: [], // Initialize with empty array
    },
    mode: "onChange",
  });

  // Watch the sources array from the form state for display
  const currentSources = useWatch({ control: form.control, name: "sources" });
  const currentPetitionUrl = useWatch({
    control: form.control,
    name: "petitionUrl",
  });
  const currentPetitionFileName = useWatch({
    control: form.control,
    name: "petitionFileName",
  });

  // --- Source Handlers ---
  const handleAddSource = useCallback(
    (url: string, file: File) => {
      // Now receives URL and File
      const newSource: Source = {
        url,
        id: generateUUID(),
        fileName: file.name,
      }; // Include filename
      const updatedSources = [...(form.getValues("sources") || []), newSource];
      form.setValue("sources", updatedSources, {
        shouldValidate: true,
        shouldDirty: true,
      });
      toast.success("Source Added", {
        description: `Source "${file.name}" added.`,
      });
    },
    [form],
  );

  const handleDeleteSource = useCallback(
    (idToDelete: string) => {
      const currentSources = form.getValues("sources") || [];
      const updatedSources = currentSources.filter((s) => s.id !== idToDelete);
      form.setValue("sources", updatedSources, {
        shouldValidate: true,
        shouldDirty: true,
      });
      toast.info("Source Removed");
    },
    [form],
  );

  // --- Petition File Handlers ---
  const handlePetitionUploaded = useCallback(
    (url: string, file: File) => {
      form.setValue("petitionUrl", url, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("petitionFileName", file.name); // Store filename
    },
    [form],
  );

  const handleRemovePetition = useCallback(() => {
    form.setValue("petitionUrl", "", {
      shouldValidate: true,
      shouldDirty: true,
    });
    form.setValue("petitionFileName", "");
    form.setValue("subjectMatter", "");
    toast.info("Petition file removed.");
  }, [form]);

  const { setPetitionUrl, addSource, setSubjectMatter } = useSubmissionStore();
  // --- Main Form Submission Handler ---
  const { user } = useUserStore();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const onSubmit = async (data: SubmissionFormData) => {
    console.log("📦 Submission Data:", data);

    setPetitionUrl(data.petitionUrl);
    setSubjectMatter(data.subjectMatter);
    addSource(data.sources);
    setLoading(true);

    try {
      if (!user?.id) {
        throw new Error("User is not logged in");
      }

      const result = await submitPetition(
        {
          petitionUrl: data.petitionUrl,
          subjectMatter: data.subjectMatter,
          sources: data.sources.map((source) => ({
            id: source.id,
            url: source.url,
          })),
        },
        user.id,
      );

      console.log("✅ Petition successfully inserted:", result);
      router.push("/petitioner/petitions");
      toast.success("Your petition has been submitted successfully!");
    } catch (e: any) {
      console.error("❌ Submission error:", e);
      toast.error("Error submitting your petition. Kindly try again later.");
    } finally {
      setLoading(false);
    }
  };

  // --- Component JSX ---
  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="petition_upload" className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-6 rounded-md border">
              <TabsTrigger
                value="petition_upload"
                className="rounded-l-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                1. Petition Form
              </TabsTrigger>
              <TabsTrigger
                value="sources"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                2. Evidences
              </TabsTrigger>
              <TabsTrigger
                value="submit"
                className="rounded-r-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                3. Submit
              </TabsTrigger>
            </TabsList>

            {/* --- Tab 1: Petition File Upload --- */}
            <TabsContent value="petition_upload">
              <Card className="rounded-lg border shadow-sm">
                <CardHeader>
                  <CardTitle>Upload Signed Petition Form</CardTitle>
                  <CardDescription>
                    Upload the signed petition form (PDF format required).
                  </CardDescription>
                </CardHeader>
                <CardContent className={"flex flex-col gap-3"}>
                  <FormField
                    control={form.control}
                    name="subjectMatter"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Label htmlFor={field.name} className="text-right">
                          Your subject matter
                        </Label>
                        <FormControl>
                          <Input
                            id={field.name} // Use field.name for label association
                            placeholder="e.g., Lorem ipsum dolor sit"
                            className="rounded-md"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="petitionUrl" // Field stores the URL, but UI is the uploader
                    render={(
                      { field }, // We don't directly use field props here
                    ) => (
                      <FormItem>
                        <FileUploadZone
                          onFileUpload={handlePetitionUploaded}
                          accept={{ "application/pdf": [".pdf"] }}
                          label="Petition Document (PDF)"
                          description="Drag & drop or click to upload PDF"
                          currentFileUrl={currentPetitionUrl} // Pass current URL
                          currentFileName={currentPetitionFileName} // Pass current filename
                          onRemoveCurrent={handleRemovePetition} // Pass remove handler
                          uploadPathPrefix="pdfs/" // Upload petitions to a 'pdfs' folder
                        />
                        <FormMessage />{" "}
                        {/* Show validation errors for petitionUrl */}
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* --- Tab 2: Sources --- */}
            <TabsContent value="sources">
              <Card className="rounded-lg border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div>
                    <CardTitle>Supporting Sources</CardTitle>
                    <CardDescription>
                      Upload any supporting documents, images, or videos
                      (optional).
                    </CardDescription>
                    {form.formState.errors.sources && (
                      <p className="text-sm font-medium text-destructive pt-2">
                        {/* Display errors related to the sources array itself if any */}
                        {typeof form.formState.errors.sources === "object" &&
                          form.formState.errors.sources.message}
                      </p>
                    )}
                  </div>
                  {/* --- Add Source Dialog --- */}
                  <Dialog
                    open={isSourceDialogOpen}
                    onOpenChange={setIsSourceDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto rounded-md"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Source File
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[480px] rounded-lg">
                      <DialogHeader>
                        <DialogTitle>Upload Supporting Source</DialogTitle>
                        <DialogDescription>
                          Select a file (PDF, Image, Video, etc.) to upload as
                          supporting evidence.
                        </DialogDescription>
                      </DialogHeader>
                      {/* Pass handler and close function */}
                      <AddSourceDialogContent
                        onSourceUploaded={handleAddSource}
                        onClose={() => setIsSourceDialogOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {/* --- Sources Table --- */}
                  <Table>
                    <TableCaption>
                      {currentSources?.length === 0
                        ? "No supporting sources uploaded yet."
                        : "List of uploaded supporting sources."}
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        {/* Removed Type column */}
                        <TableHead>File Name</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!currentSources || currentSources.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="h-24 text-center">
                            No sources uploaded.
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentSources.map((source) => (
                          <TableRow key={source.id}>
                            {/* Display filename */}
                            <TableCell
                              className="font-medium truncate max-w-[200px]"
                              title={source.fileName}
                            >
                              {source.fileName || "N/A"}
                            </TableCell>
                            <TableCell>
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline truncate block max-w-xs"
                                title={source.url}
                              >
                                View Uploaded File
                              </a>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteSource(source.id)}
                                type="button"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete Source</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* --- Tab 3: Submit --- */}
            <TabsContent value="submit">
              <Card className="rounded-lg border shadow-sm">
                <CardHeader>
                  <CardTitle>Submit Petition Information</CardTitle>
                  <CardDescription>
                    Review the uploaded petition file and sources before
                    submitting.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-6">
                    Clicking submit will log the information about the uploaded
                    files. Ensure the main petition file is uploaded.
                  </p>
                  {!form.formState.isValid && form.formState.isSubmitted && (
                    <p className="text-sm font-medium text-destructive mb-4">
                      Please check the previous tabs for errors (e.g., missing
                      petition file).
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto rounded-md text-lg px-6 py-3"
                    // disabled={!form.formState.isValid} // Enable this if strict validation needed before logging
                  >
                    {loading ? "Loading" : "Submit Information"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
};

export default PetitionSubmissionProcess;
