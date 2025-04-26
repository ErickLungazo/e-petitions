"use client"; // Keep if client-side interactions or hooks are needed later

import React, { useEffect, useState } from 'react'; // Import useEffect and useState for client-side data fetching
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
// Assuming getUsers returns a promise resolving to an array of users
// Adjust the import path as necessary
import {getUsers, getUsersByRole} from "@/actions/users";
import {DataTable} from "../data-table";
import {useParams} from "next/navigation"; // Import the server action

// Define an interface for the User object based on the provided example
// Ensure this matches the actual structure returned by getUsers
interface User {
    id: string;
    firstName: string | null; // Allow null if possible in DB
    lastName: string | null; // Allow null if possible in DB
    email: string;
    phone: string | null;
    nationalId: string | null;
    profilePicUrl: string | null;
    role: string;
    roleDescription: string | null;
    createdAt: Date | string; // Use Date if it's a Date object, string if serialized
    updatedAt: Date | string;
    // Add other fields if necessary
}

/**
 * Page Component
 *
 * Fetches and displays a list of users in a table format.
 * Uses client-side data fetching with useEffect and useState.
 */
const Page = () => {
    // State to hold the list of users
    const [usersList, setUsersList] = useState<User[]>([]);
    // State to manage loading status
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // State to manage potential errors
    const [error, setError] = useState<string | null>(null);
    const {role}=useParams();
    console.log("role",role);

    // Fetch users when the component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true); // Start loading
            setError(null); // Reset error state
            try {
                const users = await getUsersByRole(role); // Call the server action
                // Type assertion if needed, or ensure getUsers has proper return type
                setUsersList(users as User[]);
            } catch (err) {
                console.error("Failed to fetch users:", err);
                setError("Failed to load users. Please try again later.");
            } finally {
                setIsLoading(false); // Stop loading regardless of outcome
            }
        };

        fetchUsers();
    }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <div className=""> {/* Added padding */}
            <Card className=""> {/* Added shadow and rounded corners */}
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Users List</CardTitle>
                    <CardDescription>A list of all registered users in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Display Loading State */}
                    {isLoading && <p className="text-center text-muted-foreground">Loading users...</p>}

                    {/* Display Error State */}
                    {error && <p className="text-center text-red-600">{error}</p>}

                    {/* Display Table when not loading and no error */}
                    {!isLoading && !error && (
                       <DataTable data={usersList}/>
                    )}
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                    <p>End of user list.</p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Page;
