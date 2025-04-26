"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

import { z } from "zod";
import bcrypt from 'bcryptjs';

// Infer the User type from the schema if possible
type User = typeof users.$inferSelect;

/**
 * Fetches users from the database filtered by a specific role.
 *
 * @param {string} role - The role to filter users by (e.g., "admin", "petitioner").
 * @returns {Promise<User[]>} A promise that resolves to an array of User objects matching the role.
 * @throws Will throw an error if the database query fails or if the role parameter is invalid.
 */
export const getUsersByRole = async (role: string): Promise<User[]> => {
    // Optional: Add basic validation for the role parameter
    if (!role || typeof role !== 'string' || role.trim() === '') {
        console.error("getUsersByRole called with invalid role:", role);
        // Decide whether to throw an error or return an empty array
        // throw new Error("Invalid role provided.");
        return []; // Returning empty array for invalid input might be safer
    }

    console.log(`Fetching users with role: ${role}`); // Log the role being queried

    try {
        // Query the database, selecting users where the 'role' column matches the provided role parameter
        const data = await db
            .select()
            .from(users)
            .where(eq(users.role, role.toLowerCase())); // Use eq() for equality check, consider case sensitivity (e.g., .toLowerCase())

        console.log(`Found ${data.length} users with role: ${role}`);
        return data; // Return the array of matching users (can be empty)

    } catch (error) {
        console.error(`Error fetching users by role (${role}):`, error);
        // Re-throw the error or return an empty array depending on desired error handling
        // For robust applications, re-throwing might be better to signal failure upstream
        throw new Error(`Failed to fetch users with role: ${role}.`);
        // Alternatively, return []:
        // return [];
    }
};

// Example of the original function for context (optional to keep)
/**
 * Fetches all users from the database.
 * @returns A promise that resolves to an array of all User objects.
 * @throws Will throw an error if the database query fails.
 */
export const getUsers = async (): Promise<User[]> => {
    try {
        const data = await db.select().from(users);
        return data;
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw new Error("Failed to fetch all users.");
    }
};

// Add new user

export const addUser = async (userData,role='petitioner',roleDescription='public') => {
    console.log("userData being sent to DB:", userData);

    try {
        // Hash the plain-text password before saving
        const hashedPassword = await bcrypt.hash(userData.password, 10); // 10 is the salt rounds

        const insertedUsers = await db.insert(users).values({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            nationalId: userData.nationalId,
            passwordHash: hashedPassword, // Use the hashed password here
            profilePicUrl: userData.profilePicUrl,
            role,
            roleDescription,
        }).returning({
            id: users.id,
            email: users.email,
            role: users.role,
            roleDescription: users.roleDescription,
            firstName: users.firstName,
            lastName: users.lastName,
        });

        revalidatePath("/");

        const newUser = insertedUsers[0];
        console.log("User inserted successfully:", newUser);
        return newUser;

    } catch (error) {
        console.error("Error inserting user:", error);
        return null;
    }
};



// Delete a user by ID
export const deleteUser = async (id) => {
    await db.delete(users).where(eq(users.id, id));

    revalidatePath("/");
};

// Update a user by ID
export const updateUser = async (id, updateData) => {
    await db
        .update(users)
        .set({
            ...updateData,
            updatedAt: new Date(),
        })
        .where(eq(users.id, id));

    revalidatePath("/");
};

// Get a single user by ID
export const getUserById = async (id) => {
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user[0];
};


// Login user
export const loginUser = async (email: string, password: string) => {
    try {
        // Find user by email
        const userResult = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        console.log(userResult)

        const user = userResult[0];

        if (!user) {
            return { error: "Invalid email or password." };

        }

        // Compare password with stored hash
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            return { error: "Invalid email or password." };
        }

        // Return selected user fields
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            roleDescription: user.roleDescription,
            firstName: user.firstName,
            lastName: user.lastName,
        };
    } catch (error) {
        console.error("Login error:", error);
        return { error: "Something went wrong. Please try again." };
    }
};