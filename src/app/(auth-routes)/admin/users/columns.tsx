"use client"; // Or remove if this is part of a shared config

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react"; // ChevronDown removed as it wasn't used

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner"; // Import toast for user feedback on actions

// Define the User type based on the structure in users_list_page
// Ensure this matches exactly, or import it if defined centrally
interface User {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone: string | null;
    nationalId: string | null; // Keep if needed for actions, otherwise optional
    profilePicUrl: string | null; // Keep if needed, otherwise optional
    role: string;
    roleDescription: string | null; // Keep if needed, otherwise optional
    createdAt: Date | string;
    updatedAt: Date | string; // Keep if needed, otherwise optional
}

// Define the columns using the User type
export const columns: ColumnDef<User>[] = [
    // --- Select Column ---
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all rows"
                className="translate-y-[2px]" // Minor alignment adjustment
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]" // Minor alignment adjustment
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },

    // --- Name Column ---
    {
        // Use accessorFn for combined fields
        accessorFn: row => `${row.firstName || ''} ${row.lastName || ''}`.trim(),
        id: "name", // Explicit ID needed when using accessorFn
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const name = `${row.original.firstName || ''} ${row.original.lastName || ''}`.trim();
            return <div className="font-medium">{name || 'N/A'}</div>;
        },
        enableSorting: true,
    },

    // --- Email Column ---
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
        enableSorting: true,
    },

    // --- Role Column ---
    {
        accessorKey: "role",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Role
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (
            // Capitalize the first letter of the role
            <div className="capitalize">{row.getValue("role")}</div>
        ),
        enableSorting: true,
        // Optional: Add filtering capabilities
        // filterFn: (row, id, value) => {
        //   return value.includes(row.getValue(id))
        // },
    },

    // --- Phone Column ---
    {
        accessorKey: "phone",
        // Header without sorting button (optional)
        header: "Phone Number",
        cell: ({ row }) => {
            const phone = row.getValue("phone") as string | null;
            return <div>{phone || 'N/A'}</div>; // Display N/A if phone is null/empty
        },
        enableSorting: false, // Disable sorting for phone if not needed
    },

    // --- Joined Date Column ---
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Joined Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const dateValue = row.getValue("createdAt");
            // Format the date - ensure the value is a valid Date or date string
            try {
                const formattedDate = dateValue
                    ? new Date(dateValue as string | Date).toLocaleDateString()
                    : 'N/A';
                return <div className="text-center">{formattedDate}</div>;
            } catch (e) {
                console.error("Error formatting date:", dateValue, e);
                return <div className="text-right">Invalid Date</div>;
            }
        },
        enableSorting: true,
    },

    // --- Actions Column ---
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            // Get the full user object for context
            const user = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => {
                                navigator.clipboard.writeText(user.id);
                                toast.success(`User ID copied: ${user.id}`);
                            }}
                        >
                            Copy User ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                // Placeholder: Implement view logic (e.g., open modal, navigate)
                                console.log("View user:", user.id);
                                toast.info(`Viewing details for ${user.firstName || user.email}`);
                            }}
                        >
                            View User Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                // Placeholder: Implement edit logic
                                console.log("Edit user:", user.id);
                                toast.info(`Editing user ${user.firstName || user.email}`);
                                // Example: router.push(`/users/${user.id}/edit`);
                            }}
                        >
                            Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-700 focus:bg-red-50" // Destructive styling
                            onClick={() => {
                                // Placeholder: Implement delete logic (with confirmation)
                                console.log("Delete user:", user.id);
                                if(confirm(`Are you sure you want to delete user ${user.firstName || user.email}?`)) {
                                    toast.warning(`Deleting user ${user.firstName || user.email}...`);
                                    // Call deleteUser(user.id) action here
                                }
                            }}
                        >
                            Delete User
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
