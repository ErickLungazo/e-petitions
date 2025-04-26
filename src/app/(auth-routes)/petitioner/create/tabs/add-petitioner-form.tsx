import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// Assuming Petitioner type and schema are correctly imported from the main form file
import {
  Petitioner,
  petitionerEntrySchema,
} from "@/app/(auth-routes)/petitioner/create/form"; // Adjust import path if needed

interface AddPetitionerFormProps {
  onSubmitSuccess: (data: Petitioner) => void; // Callback when dialog form is valid
}

// Define a unique ID for the form within this component instance
const ADD_PETITIONER_FORM_ID = "add-petitioner-dialog-form";

export const AddPetitionerForm: React.FC<AddPetitionerFormProps> = ({
  onSubmitSuccess,
}) => {
  // Initialize the form for the dialog
  const petitionerForm = useForm<Petitioner>({
    resolver: zodResolver(petitionerEntrySchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      nationalId: "",
    },
  });

  // Handler for successful form submission within the dialog
  const handleLocalSubmit = (data: Petitioner) => {
    onSubmitSuccess(data); // Pass validated data up to the parent component
    petitionerForm.reset(); // Reset the dialog form fields
  };

  return (
    // Provide form context
    <Form {...petitionerForm}>
      {/* Add the unique ID to the form element */}
      <form
        id={ADD_PETITIONER_FORM_ID} // Assign the ID here
        onSubmit={petitionerForm.handleSubmit(handleLocalSubmit)}
        className="grid gap-4 py-4"
      >
        {/* Name Field */}
        <FormField
          control={petitionerForm.control}
          name="name"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.name} className="text-right">
                Name
              </Label>
              <FormControl>
                <Input
                  id={field.name} // Use field.name for label association
                  placeholder="e.g., Jane Chepkoech"
                  className="col-span-3 rounded-md"
                  {...field}
                />
              </FormControl>
              <FormMessage className="col-span-4 text-right" />
            </FormItem>
          )}
        />
        {/* Address Field */}
        <FormField
          control={petitionerForm.control}
          name="address"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.name} className="text-right">
                Address
              </Label>
              <FormControl>
                <Input
                  id={field.name}
                  placeholder="e.g., P.O. Box 54321, Eldoret"
                  className="col-span-3 rounded-md"
                  {...field}
                />
              </FormControl>
              <FormMessage className="col-span-4 text-right" />
            </FormItem>
          )}
        />
        {/* Phone Field */}
        <FormField
          control={petitionerForm.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.name} className="text-right">
                Phone
              </Label>
              <FormControl>
                <Input
                  id={field.name}
                  placeholder="e.g., 07XXXXXXXX"
                  className="col-span-3 rounded-md"
                  {...field}
                />
              </FormControl>
              <FormMessage className="col-span-4 text-right" />
            </FormItem>
          )}
        />
        {/* National ID/Passport Field */}
        <FormField
          control={petitionerForm.control}
          name="nationalId"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.name} className="text-right">
                ID/Passport
              </Label>
              <FormControl>
                <Input
                  id={field.name}
                  placeholder="National ID or Passport No."
                  className="col-span-3 rounded-md"
                  {...field}
                />
              </FormControl>
              <FormMessage className="col-span-4 text-right" />
            </FormItem>
          )}
        />
        {/* Dialog Footer containing buttons */}
        <DialogFooter>
          {/* Cancel Button */}
          <DialogClose asChild>
            <Button type="button" variant="outline" className="rounded-md">
              Cancel
            </Button>
          </DialogClose>
          {/* Submit Button linked to the form via 'form' attribute */}
          <Button
            type="submit"
            form={ADD_PETITIONER_FORM_ID} // Link button to form using its ID
            className="rounded-md"
          >
            Save Petitioner
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
