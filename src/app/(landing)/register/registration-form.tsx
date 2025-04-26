"use client"; // Required directive for Next.js App Router components using client-side features

import React, { useCallback, useEffect, useState, useTransition } from "react"; // Import useState and useTransition
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Import Server Action
import { addUser } from "@/actions/users"; // Adjust the import path as needed
// Assume these components are correctly set up in your project
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import {
  cn,
  SUPABASE_ANON_KEY,
  SUPABASE_BUCKET,
  SUPABASE_URL,
} from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, UploadCloud, XCircle } from "lucide-react"; // Import Lucide Icons

// Define the validation schema using Zod (remains the same)
const FormSchema = z
  .object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    phone: z.string().min(10, {
      message: "Phone number must be at least 10 digits.",
    }),
    nationalId: z.string().min(7, {
      message: "National ID must be at least 7 characters.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Please confirm your password.",
    }),
    profilePicUrl: z
      .string()
      .url({ message: "Please enter a valid URL." })
      .optional()
      .or(z.literal("")),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

// Define the structure for our form fields array
type FormFieldConfig = {
  name: keyof z.infer<typeof FormSchema>; // Use keys from the schema
  label: string;
  type: string;
  placeholder: string;
  description?: string; // Optional description
};

const formFields: FormFieldConfig[] = [
  { name: "firstName", label: "First Name", type: "text", placeholder: "John" },
  { name: "lastName", label: "Last Name", type: "text", placeholder: "Doe" },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "john.doe@example.com",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "e.g., 0712345678",
  },
  {
    name: "nationalId",
    label: "National ID",
    type: "text",
    placeholder: "Your National ID",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "********",
    description: "Password must be at least 8 characters long.",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "********",
  },
];

// Helper function to generate a unique filename
const generateUUID = () => crypto.randomUUID();

// Helper function to upload file to Supabase
const uploadFileToSupabase = async (
  file: File,
  bucket: string = SUPABASE_BUCKET,
  uploadPathPrefix: string = "",
): Promise<{ publicUrl: string; error: string | null }> => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("Supabase URL or Anon Key is not configured.");
    return {
      publicUrl: "",
      error: "Supabase URL or Anon Key is not configured.",
    };
  }

  const uniqueFileName = `${generateUUID()}-${file.name.replace(
    /[^a-zA-Z0-9._-]/g,
    "_",
  )}`; // Sanitize filename
  const filePath = `${uploadPathPrefix}${uniqueFileName}`; // Path within the bucket
  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${filePath}`;
  const publicUrlBase = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/`;

  const formData = new FormData();
  formData.append("file", file, uniqueFileName); // Use uniqueFileName here

  try {
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Supabase upload error:", errorData);
      return {
        publicUrl: "",
        error:
          errorData.message || `Upload failed with status: ${response.status}`,
      };
    }

    const publicUrl = `${publicUrlBase}${filePath}`;
    return { publicUrl, error: null };
  } catch (error: any) {
    console.error("Upload error:", error);
    return {
      publicUrl: "",
      error: error.message || "An unknown error occurred",
    };
  }
};

const ProfilePicUploader = ({
  onUpload,
  initialUrl,
}: {
  onUpload: (url: string) => void;
  initialUrl?: string;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null); // State for upload errors

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024, // 2MB limit
    onDrop: (acceptedFiles, fileRejections) => {
      setUploadError(null); // Clear previous errors
      if (acceptedFiles?.length) {
        setFile(acceptedFiles[0]);
        setPreviewUrl(URL.createObjectURL(acceptedFiles[0]));
      }
      if (fileRejections?.length) {
        setFile(null);
        const error = fileRejections[0].errors[0];
        if (error.code === "FILE_INVALID_TYPE") {
          setUploadError("Invalid file type. Please upload a PNG or JPG.");
        } else if (error.code === "FILE_TOO_LARGE") {
          setUploadError("File size too large. Maximum size is 2MB.");
        } else {
          setUploadError("An error occurred during file selection.");
        }
      }
    },
  });

  // Upload logic
  const handleUpload = useCallback(async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setUploadError(null); // Clear any previous upload error
    const { publicUrl, error } = await uploadFileToSupabase(file);
    setIsUploading(false);

    if (error) {
      setUploadError(error); // Set the error state
      toast.error(`Upload failed: ${error}`);
      return;
    }

    onUpload(publicUrl); // Callback to update the form's profilePicUrl
    toast.success("Profile picture uploaded successfully!");
    setPreviewUrl(publicUrl);
  }, [file, onUpload]);

  // Reset file and preview
  const handleReset = () => {
    setFile(null);
    setPreviewUrl(undefined);
    setUploadError(null);
  };

  // useEffect to clear previewUrl when component unmounts or initialUrl changes.
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="space-y-4">
      <div
        {...getRootProps({
          className: cn(
            "flex items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer",
            isDragActive
              ? "bg-gray-50 border-gray-400"
              : "border-gray-300 bg-gray-50 text-gray-500",
            "transition-colors duration-300",
          ),
        })}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          {previewUrl ? (
            <Avatar className="h-20 w-20 mx-auto">
              <AvatarImage src={previewUrl} alt="Preview" />
              <AvatarFallback>
                {file ? file.name.substring(0, 2).toUpperCase() : "P"}
              </AvatarFallback>
            </Avatar>
          ) : (
            <>
              <UploadCloud className="w-10 h-10 mx-auto mb-3 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG or JPG (MAX. 2MB)
              </p>
            </>
          )}
        </div>
      </div>
      {fileRejections.length > 0 && uploadError && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <XCircle className="w-4 h-4" />
          {uploadError}
        </p>
      )}
      <div className="flex gap-2">
        <Button
          onClick={handleUpload}
          disabled={isUploading || !file}
          className="w-full hidden items-center gap-2"
        >
          {isUploading ? <>Uploading...</> : "Upload"}
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          disabled={isUploading || !file}
          className="w-full"
        >
          Reset
        </Button>
      </div>
      {previewUrl && (
        <div className="flex items-center gap-2 text-green-500">
          <CheckCircle className="w-5 h-5" />
          File uploaded successfully!
        </div>
      )}
    </div>
  );
};

// Define the RegistrationForm component
const RegistrationForm = () => {
  const [error, setError] = useState<string | null>(null); // State for server action errors
  const [isPending, startTransition] = useTransition(); // Hook for managing pending state of Server Actions
  const router = useRouter();

  const { setUser } = useUserStore();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      nationalId: "",
      password: "",
      confirmPassword: "",
      profilePicUrl: "",
      termsAccepted: false,
    },
  });

  const handleProfilePicUpload = (url: string) => {
    form.setValue("profilePicUrl", url);
  };

  // Handle form submission using Server Action
  function onSubmit(data: z.infer<typeof FormSchema>) {
    setError(null); // Clear previous errors

    // Log the form submission
    console.log("Form submitted with data:", data);

    startTransition(async () => {
      try {
        // Prepare data for the action (exclude confirmPassword and termsAccepted)
        const { confirmPassword, termsAccepted, ...actionInput } = data;

        // Log actionInput before calling the server action
        console.log("Prepared action input:", actionInput);

        // Call the server action
        const insertedUser = await addUser(actionInput);
        if (insertedUser) {
          console.log("User Registered:", insertedUser);
          router.push("/petitioner");
          // --- Store the returned user data in Zustand ---
          setUser(insertedUser);
          // ------------------------------------------------

          toast.success("Registration Successful!");
          // Optionally: Redirect user or clear form here
        } else {
          // Handle the case where addUser returned null (insertion failed)
          console.error("Registration failed: addUser returned null");
          setError("Registration failed. Please try again.");
          toast.error("Registration Error", {
            description: "Could not save user data.",
          });
        }
      } catch (err) {
        // Handle unexpected errors during the action call itself
        console.error("Unexpected error calling registerUserAction:", err);
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(errorMessage);
        toast.error("Registration Error", {
          description: "An unexpected error occurred. Please try again.",
        });
      }
    });
  }

  return (
    <Form {...form}>
      {/* Disable the entire form while the action is pending */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-4 md:p-6 lg:p-8 max-w-lg mx-auto"
      >
        {/* Loop through the defined form fields */}
        {formFields.map((fieldConfig) => (
          <FormField
            key={fieldConfig.name}
            control={form.control}
            name={fieldConfig.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{fieldConfig.label}</FormLabel>
                <FormControl>
                  <Input
                    type={fieldConfig.type}
                    placeholder={fieldConfig.placeholder}
                    {...field}
                    value={field.value ?? ""}
                    disabled={isPending} // Disable input when pending
                  />
                </FormControl>
                {fieldConfig.description && (
                  <FormDescription>{fieldConfig.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {/* Profile Picture Uploader Component */}
        <FormField
          control={form.control}
          name="profilePicUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <ProfilePicUploader
                  onUpload={handleProfilePicUpload}
                  initialUrl={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Terms and Conditions Checkbox */}
        <FormField
          control={form.control}
          name="termsAccepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending} // Disable checkbox when pending
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Accept terms and conditions</FormLabel>
                <FormDescription>
                  You agree to our Terms of Service and Privacy Policy.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Display Server Action Error Message */}
        {error && (
          <div className="text-red-600 text-sm p-2 bg-red-100 border border-red-300 rounded-md">
            {error}
          </div>
        )}

        {/* Submit Button - Shows pending state */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Registering..." : "Register"}
        </Button>
      </form>
    </Form>
  );
};

export default RegistrationForm;
