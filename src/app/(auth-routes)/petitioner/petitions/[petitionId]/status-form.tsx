"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import { toast } from "sonner"; // Import Sonner
import { createVerificationStep } from "@/actions/steps"; // Import the server action // Import the useParams hook
import { useParams } from "next/navigation";

// Define the form schema using Zod
const StatusFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "Description is required." }), // Changed message
});

// Define the component
const StatusForm = ({ closeDialog, setLoading }) => {
  // Initialize the form using react-hook-form
  const form = useForm<z.infer<typeof StatusFormSchema>>({
    resolver: zodResolver(StatusFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { petitionId } = useParams(); // Get the petitionId

  // Function to handle form submission
  async function onSubmit(data: z.infer<typeof StatusFormSchema>) {
    setLoading(true);
    try {
      const result = await createVerificationStep({
        petitionId: petitionId as string, // Cast petitionId to string
        title: data.title,
        description: data.description,
      });

      if (result) {
        toast.success("Status updated successfully!");
        closeDialog(true);
        form.reset();
      } else {
        toast.error("Status update failed.");
      }
    } catch (error: any) {
      toast.error(
        `Failed to update status: ${error.message || "An error occurred"}`,
      );
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  }

  // Render the form
  return (
    <>
      <Form {...form}>
        <form
          id={"status-form"}
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the title for this status update (e.g., Pending,
                  Approved).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter description" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a detailed description of the status.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className={"hidden"}>
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};

export default StatusForm;
