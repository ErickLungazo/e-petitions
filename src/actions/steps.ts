"use server";

import { db } from "@/db/drizzle";
import { NewVerificationStep, verificationSteps } from "@/db/schema"; // Import the type // Import the verificationSteps table
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

/**
 * Creates a new verification step in the database.
 *
 * @param stepData The data for the new verification step.
 * @returns The newly created verification step, or null on failure.
 */
export const createVerificationStep = async (
  stepData: Omit<NewVerificationStep, "id" | "timestamp">, // Omit id and timestamp as they are generated in the function
) => {
  try {
    // 1. Validate the input data (optional, but recommended)
    if (!stepData.petitionId || !stepData.title || !stepData.description) {
      console.error("createVerificationStep: Missing required data.");
      return null; // Or throw an error: throw new Error("Missing required data.");
    }

    // 2. Insert the new verification step into the database
    const insertedSteps = await db
      .insert(verificationSteps)
      .values({
        petitionId: stepData.petitionId,
        title: stepData.title,
        description: stepData.description,
        // id and timestamp are handled by the database defaults
      })
      .returning(); // Get the inserted row(s)

    // 3. Handle the result
    if (!insertedSteps || insertedSteps.length === 0) {
      console.error(
        "createVerificationStep: Failed to insert verification step.",
      );
      return null;
    }
    const newStep = insertedSteps[0]; // Get the first inserted step

    // 4. Optionally revalidate the relevant page(s) to update the UI
    revalidatePath(`/clerk/petitions/${stepData.petitionId}`); //  Revalidate the specific petition page
    revalidatePath("/clerk/petitions");

    return newStep;
  } catch (error) {
    // 5. Handle errors
    console.error(
      "createVerificationStep: Error creating verification step:",
      error,
    );
    return null; // Or throw the error to be handled by a global error handler
  }
};

/**
 * Retrieves all verification steps for a given petition ID.
 *
 * @param petitionId The ID of the petition.
 * @returns A promise that resolves to an array of verification steps, or null on error.
 */
export const getVerificationStepsByPetitionId = async (petitionId: string) => {
  try {
    // 1. Query the database for verification steps with the given petitionId
    const steps = await db
      .select()
      .from(verificationSteps)
      .where(eq(verificationSteps.petitionId, petitionId))
      .orderBy(verificationSteps.timestamp); // Order by timestamp, assuming you want them in chronological order

    // 2. Handle the result
    if (!steps) {
      console.error(
        `getVerificationStepsByPetitionId: No verification steps found for petition ID ${petitionId}.`,
      );
      return null; // Or return an empty array: return [];
    }

    console.log(
      `Successfully retrieved verification steps for petition ID ${petitionId}:`,
      steps,
    );
    return steps;
  } catch (error) {
    // 3. Handle errors
    console.error(
      `getVerificationStepsByPetitionId: Error retrieving verification steps for petition ID ${petitionId}:`,
      error,
    );
    return null; // Or throw the error, depending on your error handling strategy
  }
};
