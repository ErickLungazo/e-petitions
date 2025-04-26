import { FieldErrors } from "react-hook-form";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PetitionFormData } from "@/app/(auth-routes)/petitioner/create/form";

interface SubmitTabProps {
  errors: FieldErrors<PetitionFormData>;
  isValid: boolean; // Pass form validity state
}

export const DownloadTab: React.FC<SubmitTabProps> = ({ errors, isValid }) => {
  return (
    <Card className="rounded-lg border shadow-sm">
      <CardHeader>
        <CardTitle>Download Petition Form</CardTitle>
        <CardDescription>
          Please review all previous tabs to ensure your information is correct
          before downloading. Ensure at least one petitioner has been added.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">
          By clicking submit, you confirm that the information provided is
          accurate and complete.
        </p>
        {/* Display validation message for the petitioners array specifically on submit tab if needed */}
        {errors.petitioners && !isValid && (
          <p className="text-sm font-medium text-destructive mb-4">
            Error: {errors.petitioners.message} Please add at least one
            petitioner in Tab 3.
          </p>
        )}
        {/* General invalid state message */}
        {!isValid && !errors.petitioners && (
          <p className="text-sm font-medium text-destructive mb-4">
            Please ensure all required fields in previous tabs are filled
            correctly.
          </p>
        )}
        <Button
          type="submit"
          className="w-full md:w-auto rounded-md text-lg px-6 py-3"
          // disabled={!isValid} // Disable button if form is invalid
        >
          Download Petition Form
        </Button>
      </CardContent>
    </Card>
  );
};
