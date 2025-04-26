"use client";

import React, { useEffect } from "react";
import { useUserStore } from "@/store/userStore"; // Assuming this hook provides user state
import { useRouter } from "next/navigation"; // Use next/navigation for App Router
import { toast } from "sonner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(auth-routes)/admin/app-sidebar";
import { SiteHeader } from "@/components/site-header"; // For displaying notifications

// Define the expected shape of the user object, at least the role property
interface UserWithRole {
  role?: string; // Make role optional to handle loading/null states gracefully
  // Include other user properties if needed for type checking
}

/**
 * ClerkLayout Component
 *
 * This component wraps routes specifically intended for users with the "clerk" role.
 * It checks for authentication and the correct user role using `useUserStore`.
 * - If the user is not logged in, it redirects to the login page.
 * - If the user is logged in but does not have the "clerk" role,
 * it redirects to a default page (e.g., home) and shows an unauthorized message.
 * - If the user is authenticated and has the correct role, it renders the children.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The child components to render if authorized.
 * @returns {React.ReactElement | null} The child components or null while redirecting/checking auth.
 */
const ClerkLayout = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement | null => {
  // Get user state from the Zustand store, assuming it matches UserWithRole structure
  const { user } = useUserStore() as { user: UserWithRole | null | undefined };
  // Get the router instance from Next.js
  const router = useRouter();

  useEffect(() => {
    // 1. Check if the user is logged out (null or undefined)
    if (!user) {
      toast.info("Login first to continue!");
      router.push("/login");
      return; // Stop further checks if not logged in
    }

    // 2. Check if the logged-in user has the correct role
    if (user.role !== "clerk") {
      toast.error("Unauthorized access."); // Use error toast for authorization failure
      // Redirect to a safe default page, like the homepage
      // Adjust "/dashboard" or "/" to your application's appropriate default route
      router.push("/login");
    }
  }, [user, router]); // Dependencies: re-run the effect if user or router changes

  // Determine if the user is authorized *before* rendering children
  // Render children ONLY if the user exists AND has the correct role
  const isAuthorized = user && user.role === "clerk";

  // While checking or if unauthorized, render nothing (or a loading/unauthorized indicator)
  // This prevents briefly rendering the children before redirection or for unauthorized users.
  if (!isAuthorized) {
    // Optionally, return a loading indicator or a dedicated "Unauthorized" component
    // e.g., return <LoadingSpinner />; or return <UnauthorizedMessage />;
    return null;
  }

  // If authorized, render the children components
  return (
    // Using React.Fragment to avoid adding an extra div unless needed for styling
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default ClerkLayout;
