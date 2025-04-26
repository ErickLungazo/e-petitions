"use client"; // Required directive for Next.js App Router components using client-side features

import React, { useState, useTransition } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation"; // Import useRouter

// Import Server Action for login (adjust path as needed)
import { loginUser, LoggedInUser } from '@/actions/users'; // Assuming loginUser action and type exist
// Import Zustand store hook (adjust path as needed)
import { useUserStore } from "@/store/userStore";

// Import UI components
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
import { toast } from "sonner"; // Using sonner for toasts

// Define the validation schema for the login form using Zod
const LoginSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(1, { // Keep password validation simple for login, server handles complexity
        message: "Password is required.",
    }),
});

// Define the LoginForm component
const LoginForm = () => {
    const [error, setError] = useState<string | null>(null); // State for server action errors
    const [isPending, startTransition] = useTransition(); // Hook for managing pending state
    const router = useRouter(); // Initialize router
    const setUser = useUserStore((state) => state.setUser); // Get setUser action from Zustand

    // Initialize react-hook-form
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // Handle form submission using Server Action
    function onSubmit(data: z.infer<typeof LoginSchema>) {
        setError(null);
        console.log("Login attempt with data:", data);

        startTransition(async () => {
            try {
                const result = await loginUser(data.email, data.password);
                console.log("Login result:", result);

                if ('error' in result) {
                    const failureMsg = result.error || "Login failed. Please try again.";
                    setError(failureMsg);
                    toast.error("Login Failed", {
                        description: failureMsg,
                    });
                    form.resetField("password");
                    return;
                }

                console.log("result",result)
                // --- Store the returned user data in Zustand ---
                setUser(result);
                // ------------------------------------------------

                toast.success("Login Successful!");

                // You can redirect based on role, e.g.:
                router.push(`/${result.role}`);
                // or just redirect to a generic dashboard
                // router.push("/dashboard");

            } catch (err) {
                console.error("Unexpected error calling loginUser:", err);
                const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
                setError("An unexpected error occurred during login. Please try again later.");
                toast.error("Login Error", {
                    description: errorMessage,
                });
                form.resetField("password");
            }
        });
    }

    return (
        <Form {...form}>
            {/* Disable the entire form while the action is pending */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4 md:p-6 lg:p-8 max-w-md mx-auto">
                {/* Email Field */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="your.email@example.com"
                                    {...field}
                                    disabled={isPending} // Disable input when pending
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Password Field */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="********"
                                    {...field}
                                    disabled={isPending} // Disable input when pending
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Display Server Action Error Message */}
                {error && (
                    <div className="text-red-600 text-sm p-3 bg-red-100 border border-red-300 rounded-md text-center">
                        {error}
                    </div>
                )}

                {/* Submit Button - Shows pending state */}
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? 'Logging in...' : 'Login'}
                </Button>

                {/* Optional: Add Link to Registration Page */}
                {/* <div className="text-center text-sm">
                     Don't have an account?{' '}
                     <Link href="/register" className="underline">
                         Sign up
                     </Link>
                 </div> */}
            </form>
        </Form>
    );
};

export default LoginForm;

