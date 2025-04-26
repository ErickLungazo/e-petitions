"use server";

import { db } from "@/db/drizzle";
import { submittedPetitions, users } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

/**
 * Submits a petition to the database.
 *
 * @param data Object containing petition URL and sources.
 * @param userId The ID of the user submitting the petition.
 * @returns The inserted petition data or null on failure.
 */
export const submitPetition = async (
  data: {
    subjectMatter: string;
    petitionUrl: string;
    sources: { id: string; url: string }[];
  },
  userId: string,
) => {
  if (!userId) {
    console.error("submitPetition: No userId provided.");
    return null;
  }

  try {
    const { petitionUrl, sources, subjectMatter } = data;

    console.log("Submitting petition with data:", {
      petitionUrl,
      subjectMatter,
      sources,
      userId,
    });

    const insertedPetitions = await db
      .insert(submittedPetitions)
      .values({
        submittedByUserId: userId,
        petitionFormUrl: petitionUrl,
        subjectMatter,
        sources,
        status: "PENDING",
      })
      .returning({
        id: submittedPetitions.id,
        petitionFormUrl: submittedPetitions.petitionFormUrl,
        status: submittedPetitions.status,
        subjectMatter: submittedPetitions.subjectMatter,
      });

    if (!insertedPetitions || insertedPetitions.length === 0) {
      console.error("submitPetition: Failed to insert petition.");
      return null;
    }

    const newPetition = insertedPetitions[0];

    console.log("Petition submitted successfully:", newPetition);

    // Optional: Invalidate/revalidate relevant page path
    revalidatePath("/petitions"); // Or wherever your list is

    return newPetition;
  } catch (error) {
    console.error("Error submitting petition:", error);
    return null;
  }
};

/**
 * Retrieves all petitions submitted by a specific user, including the user's first name, last name, and id.
 *
 * @param userId The ID of the user whose petitions to retrieve.
 * @returns An array of petition objects, or an empty array if no petitions are found.
 */

export const getPetitionsByUserId = async (userId: string) => {
  try {
    const petitions = await db
      .select({
        id: submittedPetitions.id,
        submittedByUserId: submittedPetitions.submittedByUserId,
        petitionFormUrl: submittedPetitions.petitionFormUrl,
        subjectMatter: submittedPetitions.subjectMatter,
        sources: submittedPetitions.sources,
        status: submittedPetitions.status,
        createdAt: submittedPetitions.createdAt,
        updatedAt: submittedPetitions.updatedAt,
        userFirstName: users.firstName, // Include user's first name
        userLastName: users.lastName, // Include user's last name
        userId: users.id, // Include user's id
      })
      .from(submittedPetitions)
      .leftJoin(users, eq(submittedPetitions.submittedByUserId, users.id))
      .where(eq(submittedPetitions.submittedByUserId, userId));

    console.log(`Retrieved ${petitions.length} petitions for user: ${userId}`);
    return petitions;
  } catch (error) {
    console.error(`Error fetching petitions for user ${userId}:`, error);
    return [];
  }
};

/**
 * Retrieves all petitions based on their status, including the user's first name, last name, and id.
 *
 * @param status The status of the petitions to retrieve.
 * @returns An array of petition objects, or an empty array if no petitions are found.
 */
export const getPetitionsByStatus = async (status: string) => {
  try {
    const petitions = await db
      .select({
        id: submittedPetitions.id,
        submittedByUserId: submittedPetitions.submittedByUserId,
        petitionFormUrl: submittedPetitions.petitionFormUrl,
        subjectMatter: submittedPetitions.subjectMatter,
        sources: submittedPetitions.sources,
        status: submittedPetitions.status,
        createdAt: submittedPetitions.createdAt,
        updatedAt: submittedPetitions.updatedAt,
        userFirstName: users.firstName,
        userLastName: users.lastName,
        userId: users.id,
      })
      .from(submittedPetitions)
      .leftJoin(users, eq(submittedPetitions.submittedByUserId, users.id))
      .where(eq(submittedPetitions.status, status));

    console.log(
      `Retrieved ${petitions.length} petitions with status: ${status}`,
    );
    return petitions;
  } catch (error) {
    console.error(`Error fetching petitions with status ${status}:`, error);
    return [];
  }
};

export const getPetitionById = async (petitionId: string) => {
  try {
    const petition = await db
      .select({
        id: submittedPetitions.id,
        submittedByUserId: submittedPetitions.submittedByUserId,
        petitionFormUrl: submittedPetitions.petitionFormUrl,
        subjectMatter: submittedPetitions.subjectMatter,
        sources: submittedPetitions.sources,
        status: submittedPetitions.status,
        createdAt: submittedPetitions.createdAt,
        updatedAt: submittedPetitions.updatedAt,
        userFirstName: users.firstName,
        userLastName: users.lastName,
        userId: users.id,
      })
      .from(submittedPetitions)
      .leftJoin(users, eq(submittedPetitions.submittedByUserId, users.id))
      .where(eq(submittedPetitions.id, petitionId))
      .limit(1); // Ensure only one result is returned

    if (!petition || petition.length === 0) {
      console.log(`Petition with ID ${petitionId} not found.`);
      return null;
    }

    console.log(`Retrieved petition with ID: ${petitionId}`, petition[0]);
    return petition[0];
  } catch (error) {
    console.error(`Error fetching petition with ID ${petitionId}:`, error);
    return null;
  }
};
/**
 * Updates the status of a petition by its ID.
 *
 * @param id The ID of the petition to update.
 * @param status The new status to set for the petition.
 * @returns The updated petition data or null on failure.
 */
export const updatePetitionStatus = async (id: string, status: string) => {
  try {
    console.log(`Updating petition status for ID ${id} with status: ${status}`);

    const updatedPetitions = await db
      .update(submittedPetitions)
      .set({ status, updatedAt: new Date() }) // Also update updatedAt
      .where(eq(submittedPetitions.id, id))
      .returning();

    if (!updatedPetitions || updatedPetitions.length === 0) {
      console.error(
        `updatePetitionStatus: Failed to update petition with ID ${id}.`,
      );
      return null;
    }

    const updatedPetition = updatedPetitions[0];
    console.log("Petition status updated successfully:", updatedPetition);

    revalidatePath(`/clerk/petitions/${id}`); // Revalidate the specific petition page
    revalidatePath("/clerk/petitions"); //  Revalidate the main petitions page.

    return updatedPetition;
  } catch (error) {
    console.error(`Error updating petition status for ID ${id}:`, error);
    return null;
  }
};
