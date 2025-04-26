"use client";

import React, { useEffect } from 'react';
import { useUserStore } from "@/store/userStore"; // Assuming this hook provides user state
import { useRouter } from "next/navigation"; // Use next/navigation for App Router
import { toast } from "sonner";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "./app-sidebar";
import {SiteHeader} from "@/components/site-header";
import {SectionCards} from "@/components/section-cards";
import {ChartAreaInteractive} from "@/components/chart-area-interactive";
import {DataTable} from "@/components/data-table";
import data from "@/app/dashboard/data.json"; // For displaying notifications

// Define the expected shape of the user object, at least the role property
interface UserWithRole {
    role?: string; // Make role optional to handle loading/null states gracefully
    // Include other user properties if needed for type checking
}

/**
 * AdminLayout Component
 *
 * This component wraps routes specifically intended for users with the "admin" role.
 * It checks for authentication and the correct user role using `useUserStore`.
 * - If the user is not logged in, it redirects to the login page.
 * - If the user is logged in but does not have the "admin" role,
 * it redirects to a default page (e.g., dashboard) and shows an unauthorized message.
 * - If the user is authenticated and has the correct role, it renders the children.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The child components to render if authorized.
 * @returns {React.ReactElement | null} The child components or null while redirecting/checking auth.
 */
const AdminLayout = ({ children }: { children: React.ReactNode }): React.ReactElement | null => {
    // Get user state from the Zustand store, assuming it matches UserWithRole structure
    const { user } = useUserStore() as { user: UserWithRole | null | undefined };
    // Get the router instance from Next.js
    const router = useRouter();

    useEffect(() => {
        // 1. Check if the user is logged out (null or undefined)
        if (!user) {
            toast.info("Login first to continue!");
            console.log(user)
            router.push("/login");
            return; // Stop further checks if not logged in
        }

        // 2. Check if the logged-in user has the correct role (changed to "admin")
        if (user.role !== "admin") {
            toast.error("Unauthorized access. Admin privileges required."); // Updated toast message
            // Redirect to a safe default page, like the dashboard or home page
            // Adjust "/dashboard" if your non-admin logged-in users go elsewhere
            router.push("/login"); // Redirect non-admins away
        }

    }, [user, router]); // Dependencies: re-run the effect if user or router changes

    // Determine if the user is authorized *before* rendering children
    // Render children ONLY if the user exists AND has the correct "admin" role
    const isAuthorized = user && user.role === "admin";

    // While checking or if unauthorized, render nothing (or a loading/unauthorized indicator)
    // This prevents briefly rendering the children before redirection or for unauthorized users.
    if (!isAuthorized) {
        // Optionally, return a loading indicator or a dedicated "Unauthorized" component
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

// Export the component with the new name
export default AdminLayout;
