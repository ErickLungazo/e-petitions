"use client";

import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Briefcase,
  FileText,
  Link,
  Settings,
  Terminal,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const ClerkPage = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  // Added some sample data for recent petitions
  const recentPetitions = [
    {
      id: "1",
      title: "Petition to Improve Local Roads",
      status: "Pending",
      createdAt: "2024-07-28",
    },
    {
      id: "2",
      title: "Petition for Better Healthcare Access",
      status: "Under Review",
      createdAt: "2024-07-25",
    },
    {
      id: "3",
      title: "Petition to Protect Wildlife Habitats",
      status: "Approved",
      createdAt: "2024-07-20",
    },
  ];
  const router = useRouter();
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 md:p-8 bg-gray-100">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-3xl space-y-6" // Increased max-width
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-green-500" />
              Clerk Dashboard
            </CardTitle>
            <CardDescription>
              Welcome to the E-Petitions Clerk Portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Heads up, Clerk!</AlertTitle>
              <AlertDescription>
                This is your dashboard. Here, you can:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Manage and process petitions.</li>
                  <li>Communicate with petitioners.</li>
                  <li>Oversee the petition process.</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quick Action Buttons */}
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center hover:bg-green-50 transition-colors"
                  onClick={() => {
                    router.push("/clerk/petitions");
                  }}
                >
                  <FileText className="h-6 w-6 text-green-500 mb-2" />
                  Manage Petitions
                </Button>

                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center hover:bg-green-50 transition-colors"
                  onClick={() => {
                    /* Handle Manage Users */
                  }}
                >
                  <Users className="h-6 w-6 text-blue-500 mb-2" />
                  Manage Users
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center hover:bg-green-50 transition-colors"
                  onClick={() => {
                    /* Handle Clerk Settings */
                  }}
                >
                  <Settings className="h-6 w-6 text-gray-500 mb-2" />
                  Clerk Settings
                </Button>
              </div>

              <Separator />

              {/* Recent Petitions */}
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-700" />
                  Recent Petitions
                </h2>
                <div className="space-y-4">
                  {recentPetitions.map((petition) => (
                    <Card
                      key={petition.id}
                      className="border-l-4 border-green-500 shadow-md"
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">
                          {petition.title}
                        </CardTitle>
                        <span
                          className={cn(
                            "text-xs px-2 py-1 rounded",
                            petition.status === "Pending" &&
                              "bg-yellow-100 text-yellow-800",
                            petition.status === "Under Review" &&
                              "bg-blue-100 text-blue-800",
                            petition.status === "Approved" &&
                              "bg-green-100 text-green-800",
                          )}
                        >
                          {petition.status}
                        </span>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">
                          Created At: {petition.createdAt}
                        </p>
                        <Link href={`/clerk/petitions/${petition.id}`}>
                          <span className="text-blue-600 hover:underline cursor-pointer mt-2 block">
                            View Details
                          </span>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ClerkPage;
