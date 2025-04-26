"use client";

import React from "react";
import { Control } from "react-hook-form"; // Added useFormContext, Control, FieldErrors, UseFormReturn

// --- Shadcn UI Component Imports ---
// (Assuming these paths are correct for your project setup)
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PetitionFormData } from "@/app/(auth-routes)/petitioner/create/form";

// --- Child Component: PetitionDetailsTab ---
interface PetitionDetailsTabProps {
  control: Control<PetitionFormData>;
}

export const PetitionDetailsTab: React.FC<PetitionDetailsTabProps> = ({
  control,
}) => {
  return (
    <Card className="rounded-lg border shadow-sm">
      <CardHeader>
        <CardTitle>Petition Details</CardTitle>
        <CardDescription>
          Describe who is petitioning and the reasons for this petition.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="petitionerIdentification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Petitioner(s) Identification</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Describe who the petitioner(s) are (e.g., citizens of Kenya...)"
                  className="min-h-[100px] rounded-md border focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Identify in general terms who the petitioner or petitioners are.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="grievances"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grievances / Reasons for Petition</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Briefly state the reasons underlying the request..."
                  className="min-h-[150px] rounded-md border focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Summarize the facts which you wish the House to consider.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
