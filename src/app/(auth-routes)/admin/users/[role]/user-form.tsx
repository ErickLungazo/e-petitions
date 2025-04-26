"use client"; // Required directive for Next.js App Router components using client-side features

import React, { useState, useTransition } from 'react'; // Import useState and useTransition
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Import Server Action
import { addUser } from '@/actions/users'; // Adjust the import path as needed
// Import the input type definition from the action file if you have it
// import { RegisterUserInput } from '@/actions/users';

// Assume these components are correctly set up in your project
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {useUserStore} from "@/store/userStore";
import {useRouter} from "next/navigation"; // Using sonner for toasts

// Define the validation schema using Zod (remains the same)
const FormSchema = z.object({
    firstName: z.string().min(2, {
        message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phone: z.string().min(10, {
        message: "Phone number must be at least 10 digits.",
    }),
    nationalId: z.string().min(7, {
        message: "National ID must be at least 7 characters.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
        message: "Please confirm your password.",
    }),
    profilePicUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
    termsAccepted: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms and conditions.",
    }),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

// Define the structure for our form fields array
type FormFieldConfig = {
    name: keyof z.infer<typeof FormSchema>; // Use keys from the schema
    label: string;
    type: string;
    placeholder: string;
    description?: string; // Optional description
};

const formFields: FormFieldConfig[] = [
    { name: "firstName", label: "First Name", type: "text", placeholder: "John" },
    { name: "lastName", label: "Last Name", type: "text", placeholder: "Doe" },
    { name: "email", label: "Email", type: "email", placeholder: "john.doe@example.com" },
    { name: "phone", label: "Phone Number", type: "tel", placeholder: "e.g., 0712345678" },
    { name: "nationalId", label: "National ID", type: "text", placeholder: "Your National ID" },
    { name: "password", label: "Password", type: "password", placeholder: "********", description: "Password must be at least 8 characters long." },
    { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "********" },
    { name: "profilePicUrl", label: "Profile Picture URL (Optional)", type: "url", placeholder: "https://example.com/profile.jpg" },
];


// Define the RegistrationForm component
const UserForm = ({role,roleDescription}) => {
    const [error, setError] = useState<string | null>(null); // State for server action errors
    const [isPending, startTransition] = useTransition(); // Hook for managing pending state of Server Actions
    const router = useRouter();

    const{setUser}=useUserStore()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            nationalId: "",
            password: "",
            confirmPassword: "",
            profilePicUrl: "",
            termsAccepted: false,
        },
    });

    // Handle form submission using Server Action
    function onSubmit(data: z.infer<typeof FormSchema>) {
        setError(null); // Clear previous errors

        // Log the form submission
        console.log("Form submitted with data:", data);

        startTransition(async () => {
            try {
                // Prepare data for the action (exclude confirmPassword and termsAccepted)
                const { confirmPassword, termsAccepted, ...actionInput } = data;

                // Log actionInput before calling the server action
                console.log("Prepared action input:", actionInput);

                // Call the server action
                const insertedUser = await addUser(actionInput,role, roleDescription);
                if (insertedUser) {
                    console.log("User Registered:", insertedUser);
                    // router.push("/petitioner")
                    // // --- Store the returned user data in Zustand ---
                    // setUser(insertedUser);
                    // ------------------------------------------------

                    toast.success("Registration Successful!");
                    // Optionally: Redirect user or clear form here
                } else {
                    // Handle the case where addUser returned null (insertion failed)
                    console.error("Registration failed: addUser returned null");
                    setError("Registration failed. Please try again.");
                    toast.error("Registration Error", {
                        description: "Could not save user data.",
                    });
                }
            } catch (err) {
                // Handle unexpected errors during the action call itself
                console.error("Unexpected error calling registerUserAction:", err);
                const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
                setError(errorMessage);
                toast.error("Registration Error", {
                    description: "An unexpected error occurred. Please try again.",
                });
            }
        });
    }

    return (
        <Form {...form}>
        {/* Disable the entire form while the action is pending */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full grid grid-cols-2 gap-3">
        {/* Loop through the defined form fields */}
    {formFields.map((fieldConfig) => (
        <FormField
            key={fieldConfig.name}
        control={form.control}
        name={fieldConfig.name}
        render={({ field }) => (
        <FormItem>
            <FormLabel>{fieldConfig.label}</FormLabel>
        <FormControl>
        <Input
            type={fieldConfig.type}
        placeholder={fieldConfig.placeholder}
        {...field}
        value={field.value ?? ''}
        disabled={isPending} // Disable input when pending
        />
        </FormControl>
        {fieldConfig.description && (
            <FormDescription>
                {fieldConfig.description}
            </FormDescription>
        )}
        <FormMessage />
        </FormItem>
    )}
        />
    ))}

    {/* Terms and Conditions Checkbox */}
    <FormField
        control={form.control}
    name="termsAccepted"
    render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
        <FormControl>
            <Checkbox
                checked={field.value}
    onCheckedChange={field.onChange}
    disabled={isPending} // Disable checkbox when pending
    />
    </FormControl>
    <div className="space-y-1 leading-none">
        <FormLabel>
            Accept terms and conditions
    </FormLabel>
    <FormDescription>
    You agree to our Terms of Service and Privacy Policy.
    </FormDescription>
    <FormMessage />
    </div>
    </FormItem>
)}
    />

    {/* Display Server Action Error Message */}
    {error && (
        <div className="text-red-600 text-sm p-2 bg-red-100 border border-red-300 rounded-md">
            {error}
            </div>
    )}

    {/* Submit Button - Shows pending state */}
    <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Registering...' : 'Register'}
        </Button>
        </form>
        </Form>
);
};

export default UserForm;
