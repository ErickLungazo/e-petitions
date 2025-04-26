"use client"; // Assuming this runs on the client

import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {Button} from "@/components/ui/button"; // Assuming shadcn/ui Card component
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import SetRole from "@/app/(auth-routes)/admin/users/[role]/set-role";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import UserForm from "@/app/(auth-routes)/admin/users/[role]/user-form";

// Define the user roles to be displayed
const userRoles = ["Admin", "Petitioner", "Clerks", "Speakers", "Committee"];

/**
 * UsersLayout Component
 *
 * Provides a layout structure for user management pages, including a header card
 * that lists the available user roles.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to be rendered within the layout.
 * @returns {React.ReactElement} The layout component.
 */
const UsersLayout = ({ children }: { children: React.ReactNode }): React.ReactElement => {
    return (
        <div className="flex flex-col gap-4 p-4 md:p-6"> {/* Added padding and consistent gap */}
            <Card className="shadow-md rounded-lg"> {/* Added subtle shadow and rounded corners */}
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Manage Users</CardTitle> {/* Adjusted title size */}
                    <CardDescription>Overview of user roles within the system.</CardDescription> {/* More descriptive */}
                </CardHeader>
                <CardContent>
                    <div className="w-full flex items-center justify-between gap-3">
                        <ul className="bg-muted rounded-lg p-3 flex items-center gap-3"> {/* Added padding and spacing between items */}
                            {/* Map over the userRoles array to render each role */}
                            {userRoles.map((role) => (
                                <li key={role} className=""> {/* Added key, padding, hover effect */}
                                    <Link href={`/admin/users/${role.toLowerCase()}`}>
                                        <Button variant={"outline"}>
                                            {role}
                                        </Button>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button>
                                    Create Users
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Select Role</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Clerks</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={(e)=>e.preventDefault()}>
                                    <Dialog>
                                        <DialogTrigger asChild={true}>
                                            <Button>SENATE</Button>
                                        </DialogTrigger>
                                        <DialogContent className={"max-h-screen overflow-y-auto"}>
                                            <DialogHeader>
                                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                <DialogDescription>
                                                    This action cannot be undone. This will permanently delete your account
                                                    and remove your data from our servers.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <UserForm role={"clerk"} roleDescription={"senate"}/>
                                        </DialogContent>
                                    </Dialog>
                                </DropdownMenuItem>   <DropdownMenuItem onSelect={(e)=>e.preventDefault()}>
                                    <Dialog>
                                        <DialogTrigger asChild={true}>
                                            <Button>NATONAL ASSEMBLY</Button>
                                        </DialogTrigger>
                                        <DialogContent className={"max-h-screen overflow-y-auto"}>
                                            <DialogHeader>
                                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                <DialogDescription>
                                                    This action cannot be undone. This will permanently delete your account
                                                    and remove your data from our servers.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <UserForm role={"clerk"} roleDescription={"national-assembly"}/>
                                        </DialogContent>
                                    </Dialog>
                                </DropdownMenuItem> <DropdownMenuSeparator />
                                <DropdownMenuLabel>Speakers</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={(e)=>e.preventDefault()}>
                                    <Dialog>
                                        <DialogTrigger asChild={true}>
                                            <Button>SENATE</Button>
                                        </DialogTrigger>
                                        <DialogContent className={"max-h-screen overflow-y-auto"}>
                                            <DialogHeader>
                                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                <DialogDescription>
                                                    This action cannot be undone. This will permanently delete your account
                                                    and remove your data from our servers.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <UserForm role={"speaker"} roleDescription={"senate"}/>
                                        </DialogContent>
                                    </Dialog>
                                </DropdownMenuItem>   <DropdownMenuItem onSelect={(e)=>e.preventDefault()}>
                                    <Dialog>
                                        <DialogTrigger asChild={true}>
                                            <Button>NATONAL ASSEMBLY</Button>
                                        </DialogTrigger>
                                        <DialogContent className={"max-h-screen overflow-y-auto"}>
                                            <DialogHeader>
                                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                <DialogDescription>
                                                    This action cannot be undone. This will permanently delete your account
                                                    and remove your data from our servers.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <UserForm role={"speaker"} roleDescription={"national-assembly"}/>
                                        </DialogContent>
                                    </Dialog>
                                </DropdownMenuItem>


                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>

                </CardContent>
                <CardFooter className="text-xs text-muted-foreground"> {/* Styled footer text */}
                    <p>Manage user accounts and permissions based on their roles.</p> {/* More relevant footer text */}
                </CardFooter>
            </Card>

            {/* Render any child components passed to the layout */}
            <div className="mt-4"> {/* Added margin-top for separation */}

                {children}

            </div>
        </div>
    );
};

export default UsersLayout;
