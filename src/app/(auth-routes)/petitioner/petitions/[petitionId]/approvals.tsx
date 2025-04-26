"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChangeStatusDialog from "@/app/(auth-routes)/clerk/petitions/[petitionId]/change-status-dialog";
import { getVerificationStepsByPetitionId } from "@/actions/steps";
import { useParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useUserStore } from "@/store/userStore";

const Approvals = () => {
  const { petitionId } = useParams();
  const [verificationSteps, setVerificationSteps] = useState<any[] | null>(
    null,
  ); // Use 'any' or define a proper type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerificationSteps = async () => {
      if (!petitionId) {
        setError("Petition ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const steps = await getVerificationStepsByPetitionId(petitionId);
        if (steps) {
          setVerificationSteps(steps);
        } else {
          setError("No verification steps found for this petition.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch verification steps.");
      } finally {
        setLoading(false);
      }
    };

    fetchVerificationSteps();
  }, [petitionId]);
  const { user } = useUserStore();
  return (
    <div>
      {user.role === "clerk" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
            <CardDescription>Update the petition's status</CardDescription>
          </CardHeader>
          <CardContent>
            <ChangeStatusDialog />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Verification Steps</CardTitle>
          <CardDescription>Track the petition&apos;s progress</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading verification steps...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : verificationSteps && verificationSteps.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {verificationSteps.map(
                (
                  step: any, // Use 'any' or a defined type
                ) => (
                  <AccordionItem key={step.id} value={`step-${step.id}`}>
                    <AccordionTrigger>{step.title}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-400">{step.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Timestamp: {new Date(step.timestamp).toLocaleString()}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ),
              )}
            </Accordion>
          ) : (
            <p>No verification steps available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Approvals;
