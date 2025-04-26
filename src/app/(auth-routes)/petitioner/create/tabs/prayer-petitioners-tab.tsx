import { Control, FieldErrors } from "react-hook-form";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { PetitionersSection } from "@/app/(auth-routes)/petitioner/create/tabs/petitioners-section";
import {
  Petitioner,
  PetitionFormData,
} from "@/app/(auth-routes)/petitioner/create/form";

interface PrayerPetitionersTabProps {
  control: Control<PetitionFormData>;
  errors: FieldErrors<PetitionFormData>;
  petitioners: Petitioner[];
  onAddPetitioner: (data: Petitioner) => void;
  onDeletePetitioner: (id: string) => void;
}

export const PrayerPetitionersTab: React.FC<PrayerPetitionersTabProps> = ({
  control,
  errors,
  petitioners,
  onAddPetitioner,
  onDeletePetitioner,
}) => {
  return (
    <div className="space-y-8">
      {/* Prayer Section */}
      <Card className="rounded-lg border shadow-sm">
        <CardHeader>
          <CardTitle>Prayer</CardTitle>
          <CardDescription>
            State what action you seek from Parliament.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="prayer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prayer Details</FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder="Set out the prayer by stating in summary..."
                    className="min-h-[100px] rounded-md border focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Clearly state the specific action(s) you wish Parliament to
                  take.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Petitioners Section Component */}
      <PetitionersSection
        petitioners={petitioners}
        errors={errors}
        onAddPetitioner={onAddPetitioner}
        onDeletePetitioner={onDeletePetitioner}
      />
    </div>
  );
};
