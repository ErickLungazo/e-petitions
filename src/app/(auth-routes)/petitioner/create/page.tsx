import React from "react";
import PetitionForm from "@/app/(auth-routes)/petitioner/create/form";
import PetitionSubmissionProcess from "@/app/(auth-routes)/petitioner/create/petition-submission-process";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const CreatePetitionPage = () => {
  return (
    <div>
      <div className="w-full flex items-center space-y-8 p-4 md:p-6 lg:p-8 rounded-lg">
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              Fill Petition Form <PlusCircle />{" "}
            </Button>
          </SheetTrigger>
          <SheetContent
            side={"bottom"}
            className={"max-h-[80vh] overflow-y-auto"}
          >
            <SheetHeader>
              <SheetTitle>Are you absolutely sure?</SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </SheetDescription>
            </SheetHeader>
            <PetitionForm />
          </SheetContent>
        </Sheet>
      </div>

      <PetitionSubmissionProcess />
    </div>
  );
};

export default CreatePetitionPage;
