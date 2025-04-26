import { FieldErrors } from "react-hook-form";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { AddPetitionerForm } from "@/app/(auth-routes)/petitioner/create/tabs/add-petitioner-form";
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
  Petitioner,
  PetitionFormData,
} from "@/app/(auth-routes)/petitioner/create/form";

interface PetitionersSectionProps {
  petitioners: Petitioner[];
  errors: FieldErrors<PetitionFormData>; // Pass errors specific to the petitioners array
  onAddPetitioner: (data: Petitioner) => void;
  onDeletePetitioner: (id: string) => void;
}

export const PetitionersSection: React.FC<PetitionersSectionProps> = ({
  petitioners,
  errors,
  onAddPetitioner,
  onDeletePetitioner,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogSubmitSuccess = (data: Petitioner) => {
    onAddPetitioner(data); // Call the handler passed from the parent
    setIsDialogOpen(false); // Close the dialog
  };

  return (
    <Card className="rounded-lg border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Petitioners List</CardTitle>
          <CardDescription>
            Add all individuals who are part of this petition. At least one is
            required.
          </CardDescription>
          {/* Display validation message for the petitioners array */}
          {errors.petitioners && (
            <p className="text-sm font-medium text-destructive pt-2">
              {errors.petitioners.message}
            </p>
          )}
        </div>
        {/* --- Add Petitioner Dialog --- */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto rounded-md">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Petitioner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px] rounded-lg">
            <DialogHeader>
              <DialogTitle>Add New Petitioner</DialogTitle>
              <DialogDescription>
                Enter the details for the petitioner below. Click save when
                done.
              </DialogDescription>
            </DialogHeader>
            {/* Render the separate dialog form component */}
            <AddPetitionerForm onSubmitSuccess={handleDialogSubmitSuccess} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {/* --- Petitioners Table --- */}
        <Table>
          <TableCaption>
            {petitioners.length === 0
              ? "No petitioners added yet. Click 'Add Petitioner' to start."
              : "List of registered petitioners for this submission."}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>ID/Passport No.</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {petitioners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No petitioners added.
                </TableCell>
              </TableRow>
            ) : (
              petitioners.map((petitioner) => (
                <TableRow key={petitioner.id}>
                  <TableCell className="font-medium">
                    {petitioner.name}
                  </TableCell>
                  <TableCell>{petitioner.address}</TableCell>
                  <TableCell>{petitioner.phone}</TableCell>
                  <TableCell>{petitioner.nationalId}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDeletePetitioner(petitioner.id!)}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete {petitioner.name}</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
