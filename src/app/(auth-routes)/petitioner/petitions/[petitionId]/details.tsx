"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams } from "next/navigation";
import { getPetitionById } from "@/actions/petitions"; // Adjust the path if needed
import { Button } from "@/components/ui/button";
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

const Details = () => {
  const { petitionId } = useParams();
  const [petition, setPetition] = useState<any | null>(null); // Use 'any' or create a specific type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPetition = async () => {
      if (!petitionId) {
        setError("Petition ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const data = await getPetitionById(petitionId);
        if (data) {
          setPetition(data);
        } else {
          setError("Petition not found.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch petition.");
      } finally {
        setLoading(false);
      }
    };

    fetchPetition();
  }, [petitionId]);

  // Function to render source based on its URL
  const renderSource = (source: { id: string; url: string }) => {
    const fileType = getFileType(source.url);

    return (
      <div key={source.id} className="mb-4">
        <Button
          variant="outline"
          onClick={() => window.open(source.url, "_blank")}
          className="w-full" // Make button take full width
        >
          {fileType === "pdf"
            ? "View PDF Source"
            : fileType === "image"
              ? "View Image Source"
              : fileType === "video"
                ? "View Video Source"
                : "View Source"}
        </Button>
      </div>
    );
  };

  // Helper function to determine file type from URL
  const getFileType = (url: string) => {
    const lowerCaseUrl = url.toLowerCase();
    if (lowerCaseUrl.endsWith(".pdf")) return "pdf";
    if (lowerCaseUrl.match(/\.(jpeg|jpg|gif|png)$/)) return "image";
    if (lowerCaseUrl.match(/\.(mp4|webm|ogg)$/)) return "video";
    return "unknown";
  };

  if (loading) {
    return <div>Loading petition details...</div>; // Simple loading indicator
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message
  }

  if (!petition) {
    return <div>Petition not found.</div>; // Handle the null case
  }

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Petition Form</CardTitle>
          <CardDescription>Petition Form</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Petition Details</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Petition ID</TableCell>
                <TableCell>{petition.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Subject Matter</TableCell>
                <TableCell>{petition.subjectMatter}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Petitioner</TableCell>
                <TableCell>
                  {petition.userFirstName} {petition.userLastName}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>{petition.status}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Created At</TableCell>
                <TableCell>
                  {new Date(petition.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>
                  {petition.petitionFormUrl && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(petition.petitionFormUrl, "_blank")
                      }
                      className="mt-4" // Add some margin
                    >
                      View Petition Form
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Supporting Evidence</CardTitle>
          <CardDescription>
            List of evidence provided with the petition.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {petition.sources && petition.sources.length > 0 ? (
            petition.sources.map(renderSource)
          ) : (
            <p>No evidence provided.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Details;
