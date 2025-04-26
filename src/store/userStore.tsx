import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the structure for the user data
interface User {
    id: string;
    email: string;
    role: string;
    roleDescription: string;
    firstName: string;
    lastName: string;
}

// Define the state structure for the store
interface UserState {
    user: User | null; // User can be null if not logged in
    setUser: (user: User) => void; // Action to set the user data
    clearUser: () => void; // Action to clear user data (logout)
}

/**
 * Zustand store for managing user authentication state.
 *
 * This store holds the current user's information and persists it
 * to local storage using the `persist` middleware.
 */
export const useUserStore = create<UserState>()(
    persist(
        // The core store definition function (factory)
        (set) => ({
            // Initial state: no user logged in
            user: null,

            // Action: Set the user data in the state
            setUser: (userData) => {
                console.log('Setting user in store:', userData);
                set({ user: userData });
            },

            // Action: Clear the user data from the state
            clearUser: () => {
                console.log('Clearing user from store.');
                set({ user: null });
            },
        }),
        // Configuration options for the persist middleware
        {
            name: 'user-auth-storage', // Unique name for the storage item in localStorage
            storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
            // Optionally, you can choose which parts of the state to persist:
            // partialize: (state) => ({ user: state.user }),
        }
    )
);

// --- Example Usage (in a React component) ---

/*
import React, { useEffect } from 'react';
import { useUserStore } from './userStore'; // Adjust the import path

function UserProfile() {
  // Get state and actions from the store
  const { user, setUser, clearUser } = useUserStore();

  // Example function to simulate login
  const handleLogin = () => {
    const loggedInUser: User = {
      id: "aad5e0ca-9587-4b82-a843-594f66214e6f",
      email: "wuxo@mailinator.com",
      role: "petitioner",
      roleDescription: "public",
      firstName: "Justina",
      lastName: "Henson"
    };
    setUser(loggedInUser);
  };

  // Example function to simulate logout
  const handleLogout = () => {
    clearUser();
  };

  useEffect(() => {
    // You can access the persisted user state on component mount
    console.log('Current user from store on mount:', user);
  }, [user]); // Re-run effect if user changes

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.firstName} {user.lastName}!</h2>
          <p>Email: {user.email}</p>
          <p>Role: {user.role} ({user.roleDescription})</p>
          <p>ID: {user.id}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <p>You are not logged in.</p>
          <button onClick={handleLogin}>Login (Simulated)</button>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
*/
