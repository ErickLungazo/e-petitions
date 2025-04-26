"use client";

import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IdCard, Mail, Terminal, User } from "lucide-react"; // Import User icon
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/userStore";

interface UserData {
  id: string;
  email: string;
  role: string;
  roleDescription: string;
  firstName: string;
  lastName: string;
}

const Page = () => {
  // Mock user data (replace with actual data from your store/context)
  const { user } = useUserStore();

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  return (
    <div
      className={
        "w-full min-h-screen flex items-center justify-center p-4 md:p-8 bg-gray-100"
      }
    >
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl space-y-6" // Added space-y-6
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Terminal className="h-6 w-6 text-blue-500" />
              Dashboard
            </CardTitle>
            <CardDescription>
              Welcome to your E-Petitions portal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* User Card */}
              <Card className="border-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-500" />
                    Your Profile
                  </CardTitle>
                  <CardDescription>
                    Welcome, {user.firstName} {user.lastName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IdCard className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Name:</span>
                    <span>
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Email:</span>
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Role:</span>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 border-blue-300"
                    >
                      {user.role} ({user.roleDescription})
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Main Dashboard Content */}
              <div>
                <Alert>
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Heads up, Petitioner!</AlertTitle>
                  <AlertDescription>
                    This is your personalized dashboard. Here, you can:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>View the status of your petitions.</li>
                      <li>Manage your account settings.</li>
                      <li>Find resources and support.</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="mt-6 space-y-4">
                  <h2 className="text-xl font-semibold">Key Actions:</h2>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <Link
                        href="/petitioner/create"
                        className="text-blue-600 hover:underline"
                      >
                        Create a New Petition
                      </Link>
                      - Start a new petition to raise an issue with the
                      Parliament.
                    </li>
                    <li>
                      <Link
                        href="/petitioner/petitions"
                        className="text-blue-600 hover:underline"
                      >
                        View Your Petitions
                      </Link>
                      - See the status of petitions you've created or signed.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Page;
