"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";

// Define the type for your petition data
export type Petition = {
  id: string;
  submittedByUserId: string;
  petitionFormUrl: string;
  subjectMatter: string;
  sources: { id: string; url: string }[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  userFirstName: string;
  userLastName: string;
  userId: string;
};

export const petitionColumns: ColumnDef<Petition>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "S/NO",
    cell: ({ row }) => <div>{row.index + 1}</div>, // Simple row number
  },
  {
    header: "PETITIONER",
    cell: ({ row }) => (
      <div>
        {row.original.userFirstName} {row.original.userLastName}
      </div>
    ),
  },
  {
    accessorKey: "subjectMatter",
    header: "SUBJECT MATTER",
    cell: ({ row }) => {
      const { user } = useUserStore();
      return (
        <Link href={`/${user!!.role}/petitions/${row.original.id}`}>
          <Button variant={"link"}>{row.getValue("subjectMatter")}</Button>
        </Link>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "DATE RECEIVED",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div>
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
];
