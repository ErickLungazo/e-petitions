"use client"; // Required directive for Next.js App Router components using client-side features

import React from 'react';
import Link from "next/link"; // Import Link for navigation

// Assume these components are correctly set up in your project
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// Import the login form component (adjust path if needed)
import LoginForm from "@/app/(landing)/login/login-form"; // Assuming LoginForm is in this path

const LoginPage = () => {
    return (
        // Section to center the card on the page vertically and horizontally
        <section className={"w-full flex items-center justify-center min-h-screen p-4"}> {/* Added padding */}
            {/* Card component to wrap the login form */}
            <Card className="w-full max-w-md"> {/* Adjusted max-width for typical login form */}
                <CardHeader>
                    {/* Updated Card Title for Login */}
                    <CardTitle>Login to Your Account</CardTitle>
                    {/* Updated Card Description for Login */}
                    <CardDescription>Enter your email and password below to log in.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Container for the login form */}
                    <div className=""> {/* Padding is usually handled by CardContent */}
                        <LoginForm /> {/* Render the LoginForm */}
                    </div>
                </CardContent>
                {/* Updated Card Footer for Login */}
                <CardFooter className="flex justify-center"> {/* Centered footer text */}
                    <p className="text-sm text-gray-600"> {/* Added styling */}
                        Don't have an account?{' '}
                        <Link href="/register" className="font-medium text-blue-600 hover:underline">
                            Register
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </section>
    );
};

export default LoginPage;
