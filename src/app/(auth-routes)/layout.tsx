"use client";

import React, { useEffect } from "react";
import { useUserStore } from "@/store/userStore"; // Assuming this hook provides user state
import { useRouter } from "next/navigation"; // Use next/navigation for App Router

/**
 * AuthLayout Component
 *
 * This component wraps protected routes. It checks if a user is authenticated
 * using the `useUserStore`. If the user is not authenticated, it redirects
 * them to the login page and shows a notification. Otherwise, it renders
 * the child components.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The child components to render if authenticated.
 * @returns {React.ReactElement | null} The child components or null while redirecting/checking auth.
 */
const AuthLayout = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement | null => {
  // Get user state from the Zustand store
  const { user } = useUserStore();
  console.log("user", user);
  // Get the router instance from Next.js
  const router = useRouter();

  useEffect(() => {
    // Check if the user data is available and if the user is actually logged out
    // This check prevents unnecessary redirects if the user state is initially null/undefined
    // but quickly hydrates. Adjust the condition based on how your store initializes.
    if (user === null || user === undefined) {
      console.log("user", user);
      // Display an informational toast message
      // toast.info("Login first to continue!");
      // Redirect the user to the login page
      // router.push("/login");
    }
  }, [user, router]); // Dependencies: re-run the effect if user or router changes

  // If the user is not authenticated (still null/undefined), render nothing (or a loading spinner)
  // while the useEffect handles the redirect. This prevents briefly rendering the children.
  if (!user) {
    // Optionally, return a loading indicator component here
    // e.g., return <LoadingSpinner />;
    return null;
  }

  // If the user is authenticated, render the children components
  return (
    // Using React.Fragment to avoid adding an extra div unless needed for styling
    <>{children}</>
  );
};

export default AuthLayout;
