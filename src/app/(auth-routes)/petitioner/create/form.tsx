"use client";

import React, { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"; // Added useFormContext, Control, FieldErrors, UseFormReturn
import { z } from "zod";
import { toast } from "sonner";

// --- Shadcn UI Component Imports ---
// (Assuming these paths are correct for your project setup)
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PetitionDetailsTab } from "@/app/(auth-routes)/petitioner/create/tabs/petition-details-tab";
import { ConfirmationsTab } from "@/app/(auth-routes)/petitioner/create/tabs/confirmations-tab";
import { PrayerPetitionersTab } from "@/app/(auth-routes)/petitioner/create/tabs/prayer-petitioners-tab";
import { DownloadTab } from "@/app/(auth-routes)/petitioner/create/tabs/download-tab";
import { usePetitionStore } from "@/store/petitionStore";
import { exportPetitionToPDF } from "@/lib/exportPetitionToPDF";

// --- Zod Schema Definitions ---

// Schema for a single petitioner entry
export const petitionerEntrySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  address: z.string().min(10, "Address must be at least 10 characters."),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-()]{7,}$/, "Please enter a valid phone number."),
  nationalId: z.string().min(5, "ID/Passport must be at least 5 characters."),
});

// Main petition schema
const petitionSchema = z.object({
  petitionerIdentification: z.string().min(10, {
    message:
      "Please describe who the petitioners are (at least 10 characters).",
  }),
  grievances: z.string().min(20, {
    message: "Please state the reasons/grievances (at least 20 characters).",
  }),
  priorEffortsConfirmation: z.boolean().refine((val) => val === true, {
    message: "You must confirm prior efforts were made.",
  }),
  legalStatusConfirmation: z.boolean().refine((val) => val === true, {
    message: "You must confirm the matter is not before a court.",
  }),
  prayer: z.string().min(10, {
    message: "Please state the desired action (at least 10 characters).",
  }),
  petitioners: z.array(petitionerEntrySchema).min(1, {
    message: "At least one petitioner must be added.",
  }),
});

// --- Type Definitions ---
export type Petitioner = z.infer<typeof petitionerEntrySchema>;
export type PetitionFormData = z.infer<typeof petitionSchema>;

// --- Helper Function ---
// Generates a unique ID (replace with a more robust library if needed)
const generateUUID = () => crypto.randomUUID();

// --- Child Component: AddPetitionerForm ---
// This is the form *inside* the dialog

// --- Child Component: PetitionersSection ---
// Manages the display of the table and the Add Petitioner dialog

// --- Child Component: PrayerPetitionersTab ---
// Combines Prayer section and Petitioners section

// --- Child Component: SubmitTab ---

// --- Main Component: PetitionForm ---
const PetitionForm = () => {
  // State for the list of petitioners (managed here)
  const [petitioners, setPetitioners] = useState<Petitioner[]>([]);
  const {
    petitionerIdentification,
    grievances,
    priorEffortsConfirmation,
    legalStatusConfirmation,
    prayer,
    petitioners: storePetitioners, // Rename to avoid conflict with form state name
    deletePetitioner,
  } = usePetitionStore();

  // Initialize react-hook-form for the main petition
  const form = useForm<PetitionFormData>({
    resolver: zodResolver(petitionSchema),
    defaultValues: {
      petitionerIdentification: petitionerIdentification
        ? petitionerIdentification
        : "",
      grievances: grievances ? grievances : "",
      priorEffortsConfirmation: priorEffortsConfirmation
        ? priorEffortsConfirmation
        : false,
      legalStatusConfirmation: legalStatusConfirmation
        ? legalStatusConfirmation
        : false,
      prayer: prayer ? prayer : "",
      petitioners: storePetitioners ? storePetitioners : [], // Initialize petitioners array
    },
    mode: "onChange", // Validate on change to update isValid status for submit button
  });

  // --- Petitioner Handlers (defined in the main component) ---
  const handleAddPetitioner = useCallback(
    (data: Petitioner) => {
      const newPetitioner = { ...data, id: generateUUID() };
      const updatedPetitioners = [...petitioners, newPetitioner];
      setPetitioners(updatedPetitioners);
      // Update the main form's state for validation and submission
      form.setValue("petitioners", updatedPetitioners, {
        shouldValidate: true,
        shouldDirty: true,
      });
      toast.success("Petitioner Added", {
        description: `${data.name} has been added to the list.`,
      });
    },
    [petitioners, form], // Dependencies for useCallback
  );

  const handleDeletePetitioner = useCallback(
    (idToDelete: string) => {
      const updatedPetitioners = petitioners.filter((p) => p.id !== idToDelete);
      setPetitioners(updatedPetitioners);
      // Update the main form's state
      form.setValue("petitioners", updatedPetitioners, {
        shouldValidate: true,
        shouldDirty: true,
      });
      toast.info("Petitioner Removed");
    },
    [petitioners, form], // Dependencies for useCallback
  );

  const { setPetitionData } = usePetitionStore();
  // --- Main Form Submission Handler ---
  const onSubmit = (data: PetitionFormData) => {
    // Data already includes the petitioners array from form.setValue
    console.log("Petition Data Submitted:", data);
    toast.success("Petition Submitted Successfully!", {
      description: `Petition with ${data.petitioners.length} petitioner(s) logged.`,
      action: { label: "Close", onClick: () => console.log("Toast closed") },
      duration: 5000,
    });
    setPetitionData(data); // Save validated data to Zustand store
    exportPetitionToPDF(data);
    //
    // TODO: Send 'data' to backend API
    // Optionally reset form:
    // form.reset();
    // setPetitioners([]);
  };

  // --- Component JSX ---
  return (
    // Provide the main form context to nested components if needed, though passing props is often clearer
    // <FormProvider {...form}>
    <Form {...form}>
      {/* Still need Form for FormField context */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 p-4 md:p-6 lg:p-8 rounded-lg"
      >
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-6 rounded-md border">
            <TabsTrigger
              value="details"
              className="rounded-l-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              1. Details
            </TabsTrigger>
            <TabsTrigger
              value="confirmations"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              2. Confirmations
            </TabsTrigger>
            <TabsTrigger
              value="prayer_petitioners"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              3. Prayer & Petitioners
            </TabsTrigger>
            <TabsTrigger
              value="submit"
              className="rounded-r-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              4. Download and Sign
            </TabsTrigger>
          </TabsList>

          {/* --- Render Tab Content Components --- */}
          <TabsContent value="details">
            <PetitionDetailsTab control={form.control} />
          </TabsContent>

          <TabsContent value="confirmations">
            <ConfirmationsTab control={form.control} />
          </TabsContent>

          <TabsContent value="prayer_petitioners">
            <PrayerPetitionersTab
              control={form.control}
              errors={form.formState.errors}
              petitioners={petitioners} // Pass state down
              onAddPetitioner={handleAddPetitioner} // Pass handler down
              onDeletePetitioner={handleDeletePetitioner} // Pass handler down
            />
          </TabsContent>

          <TabsContent value="submit">
            <DownloadTab
              errors={form.formState.errors}
              isValid={form.formState.isValid}
            />
          </TabsContent>
        </Tabs>
      </form>
    </Form>
    // </FormProvider>
  );
};

export default PetitionForm;

// === Important Notes ===
// 1.  Component Structure: The form is now broken into:
//     - PetitionForm (main state, handlers, tabs)
//     - PetitionDetailsTab
//     - ConfirmationsTab
//     - PrayerPetitionersTab (combines Prayer and PetitionersSection)
//     - PetitionersSection (manages table and dialog trigger/state)
//     - AddPetitionerForm (form content within the dialog)
//     - SubmitTab
// 2.  Prop Drilling: State (`petitioners`) and handlers (`onAddPetitioner`, `onDeletePetitioner`) are passed down from `PetitionForm`. `control` and `errors` from the main `useForm` hook are also passed where needed.
// 3.  Dialog Form State: `AddPetitionerForm` uses its own `useForm` instance. When its internal form is submitted successfully, it calls the `onSubmitSuccess` prop (which is `handleDialogSubmitSuccess` in `PetitionersSection`, which in turn calls `onAddPetitioner` passed from `PetitionForm`).
// 4.  Dependencies & Setup: Ensure all imports are correct and dependencies (`react-hook-form`, `zod`, `sonner`, `lucide-react`, shadcn components) are installed and configured. Remember the `<Toaster />`.
// 5.  `useCallback`: Handlers passed down as props (`handleAddPetitioner`, `handleDeletePetitioner`) are wrapped in `useCallback` to prevent unnecessary re-renders of child components if the parent re-renders for other reasons.
