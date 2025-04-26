"use client"; // Required directive for Next.js App Router components using client-side features

import React from 'react';

// Assume these components are correctly set up in your project
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Button is imported but not used, consider removing if not needed

// Import the registration form component
import RegistrationForm from "@/app/(landing)/register/registration-form";
import Link from "next/link"; // Adjust path if needed

const RegisterPage = () => {
    return (
        // Section to center the card on the page vertically and horizontally
        <section className={"w-full flex items-center justify-center min-h-screen p-4"}> {/* Added padding */}
            {/* Card component to wrap the registration form */}
            <Card className="w-full max-w-lg"> {/* Added max-width for better control */}
                <CardHeader>
                    {/* Updated Card Title */}
                    <CardTitle>Create an Account</CardTitle>
                    {/* Updated Card Description */}
                    <CardDescription>Enter your details below to register.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Container for the registration form, remove padding if CardContent provides enough */}
                    <div className=""> {/* Removed padding p-3 as CardContent usually has padding */}
                        <RegistrationForm />
                    </div>
                </CardContent>
                {/* Optional Card Footer - currently simple text */}
                <CardFooter>
                    {/* You might want to add links like "Already have an account? Login" here */}
                     <p>Already have an account? <Link  href="/login" className="text-blue-600 hover:underline">Login</Link></p>
                </CardFooter>
            </Card>
        </section>
    );
};

export default RegisterPage;
