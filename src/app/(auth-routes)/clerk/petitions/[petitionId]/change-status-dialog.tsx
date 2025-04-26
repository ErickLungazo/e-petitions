"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StatusForm from "@/app/(auth-routes)/clerk/petitions/[petitionId]/status-form";

const ChangeStatusDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Change Status</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Petition Status</DialogTitle>
            <DialogDescription>
              Update the status of the petition.
            </DialogDescription>
          </DialogHeader>
          <StatusForm setLoading={setLoading} closeDialog={setOpen} />
          <DialogFooter>
            <Button form={"status-form"} disabled={loading}>
              {loading ? "Loading..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChangeStatusDialog;
