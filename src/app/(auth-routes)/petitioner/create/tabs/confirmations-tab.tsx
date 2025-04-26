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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PetitionFormData } from "@/app/(auth-routes)/petitioner/create/form";

// --- Child Component: ConfirmationsTab ---
interface ConfirmationsTabProps {
  control: Control<PetitionFormData>;
}

export const ConfirmationsTab: React.FC<ConfirmationsTabProps> = ({
  control,
}) => {
  return (
    <Card className="rounded-lg border shadow-sm">
      <CardHeader>
        <CardTitle>Required Confirmations</CardTitle>
        <CardDescription>
          Please confirm the following statements regarding your petition.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="priorEffortsConfirmation"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-background">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="rounded"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Confirmation of Prior Efforts</FormLabel>
                <FormDescription>
                  I/We confirm that efforts have been made to have the matter
                  addressed by the relevant body, and it failed to give a
                  satisfactory response.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="legalStatusConfirmation"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-background">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="rounded"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Confirmation of Legal Status</FormLabel>
                <FormDescription>
                  I/We confirm that the issues are not pending before any court
                  of law, or constitutional or legal body.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
