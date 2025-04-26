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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createVerificationStep } from "@/actions/steps";
import { useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the form schema using Zod
const StatusFormSchema = z.object({
  title: z.enum([
    "Application Accepted - Forwarded to Speaker",
    "Application Returned for Amendment",
    "Application Forwarded to Clerk of the Senate",
    "Under Review",
    "Approved",
    "Rejected",
    "Pending",
    "In Progress",
    "Completed",
    "Referred to Committee",
    "Awaiting Response",
    "On Hold",
    "Cancelled",
    "Withdrawn",
    "Submitted",
  ]),
  description: z.string().optional(),
});

// Define the component
const StatusForm = ({ closeDialog, setLoading }) => {
  // Initialize the form using react-hook-form
  const form = useForm<z.infer<typeof StatusFormSchema>>({
    resolver: zodResolver(StatusFormSchema),
    defaultValues: {
      title: "Under Review", // Set a default value
      description: "",
    },
  });

  const { petitionId } = useParams(); // Get the petitionId

  // Function to handle form submission
  async function onSubmit(data: z.infer<typeof StatusFormSchema>) {
    setLoading(true);
    try {
      const result = await createVerificationStep({
        petitionId: petitionId as string,
        title: data.title, // Use data.title
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

  return (
    <>
      <Form {...form}>
        <form
          id={"status-form"}
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          {/* Title Select Field */}
          <FormField
            control={form.control}
            name="title" // Keep the name as "title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Application Accepted - Forwarded to Speaker">
                      Application Accepted - Forwarded to Speaker
                    </SelectItem>
                    <SelectItem value="Application Returned for Amendment">
                      Application Returned for Amendment
                    </SelectItem>
                    <SelectItem value="Application Forwarded to Clerk of the Senate">
                      Application Forwarded to Clerk of the Senate
                    </SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Referred to Committee">
                      Referred to Committee
                    </SelectItem>
                    <SelectItem value="Awaiting Response">
                      Awaiting Response
                    </SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                    <SelectItem value="Submitted">Submitted</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the current status of the application.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field (Optional) */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter a more detailed description (optional)"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide any additional details about the status update.
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
