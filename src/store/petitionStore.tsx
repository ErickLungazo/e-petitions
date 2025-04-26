import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { z } from "zod";

// --- Re-define Zod Schemas and Types (or import them if they are in a separate file) ---
// It's generally better to define these in a shared types file and import them here and in your form component.

// Schema for a single petitioner entry
const petitionerEntrySchema = z.object({
  id: z.string().uuid(), // ID is required here for stored data
  name: z.string().min(2, "Name must be at least 2 characters."),
  address: z.string().min(10, "Address must be at least 10 characters."),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-()]{7,}$/, "Please enter a valid phone number."),
  nationalId: z.string().min(5, "ID/Passport must be at least 5 characters."),
});

// Main petition schema
const petitionSchema = z.object({
  petitionerIdentification: z.string(),
  grievances: z.string(),
  priorEffortsConfirmation: z.boolean(),
  legalStatusConfirmation: z.boolean(),
  prayer: z.string(),
  petitioners: z.array(petitionerEntrySchema),
});

// --- Type Definitions ---
type Petitioner = z.infer<typeof petitionerEntrySchema>;
type PetitionFormData = z.infer<typeof petitionSchema>;

// --- Store State Interface ---
interface PetitionState extends PetitionFormData {
  // Actions defined below
  setPetitionData: (data: Partial<PetitionFormData>) => void;
  setField: <K extends keyof PetitionFormData>(
    field: K,
    value: PetitionFormData[K],
  ) => void;
  addPetitioner: (petitioner: Omit<Petitioner, "id">) => void; // Accept petitioner data without ID
  deletePetitioner: (id: string) => void;
  resetForm: () => void;
}

// --- Initial State ---
// Define the default state for the form when it's first loaded or reset
const initialState: PetitionFormData = {
  petitionerIdentification: "",
  grievances: "",
  priorEffortsConfirmation: false,
  legalStatusConfirmation: false,
  prayer: "",
  petitioners: [],
};

// --- Helper Function ---
// Generates a unique ID (replace with a more robust library if needed)
const generateUUID = () => crypto.randomUUID();

// --- Zustand Store Definition ---
export const usePetitionStore = create<PetitionState>()(
  // 1. Persist Middleware: Wraps the store definition
  persist(
    // 2. Store Definition Function: Defines state and actions
    (set, get) => ({
      // --- State ---
      ...initialState, // Spread initial state values

      // --- Actions ---

      /**
       * Updates multiple fields in the petition form data at once.
       * @param data - An object containing the fields and values to update.
       */
      setPetitionData: (data) => set((state) => ({ ...state, ...data })),

      /**
       * Updates a single field in the petition form data.
       * @param field - The key of the field to update.
       * @param value - The new value for the field.
       */
      setField: (field, value) => set({ [field]: value }),

      /**
       * Adds a new petitioner to the list. Generates a unique ID.
       * @param petitionerData - The petitioner data (name, address, phone, nationalId).
       */
      addPetitioner: (petitionerData) => {
        const newPetitioner: Petitioner = {
          ...petitionerData,
          id: generateUUID(), // Generate ID upon adding
        };
        set((state) => ({
          petitioners: [...state.petitioners, newPetitioner],
        }));
      },

      /**
       * Removes a petitioner from the list by their ID.
       * @param id - The unique ID of the petitioner to remove.
       */
      deletePetitioner: (id) =>
        set((state) => ({
          petitioners: state.petitioners.filter(
            (petitioner) => petitioner.id !== id,
          ),
        })),

      /**
       * Resets the entire form back to its initial default state.
       */
      resetForm: () => set(initialState),
    }),
    // 3. Persist Options: Configuration for the middleware
    {
      name: "petition-form-storage", // Unique name for the localStorage key
      storage: createJSONStorage(() => localStorage), // Use localStorage (default)
      // partialize: (state) => ({ ... }), // Optionally choose which parts of the state to persist
      // onRehydrateStorage: (state) => { // Optional: Logic after rehydration
      //   console.log("Hydration finished");
      // },
    },
  ),
);

// === How to Use ===
/*
import { usePetitionStore } from './path/to/petitionStore'; // Adjust the import path

function MyFormComponent() {
  // --- Accessing State ---
  const petitionerIdentification = usePetitionStore((state) => state.petitionerIdentification);
  const petitioners = usePetitionStore((state) => state.petitioners);
  // Or get the whole state (less optimal for performance if only using a few fields)
  const allData = usePetitionStore((state) => state);

  // --- Accessing Actions ---
  const setField = usePetitionStore((state) => state.setField);
  const addPetitioner = usePetitionStore((state) => state.addPetitioner);
  const deletePetitioner = usePetitionStore((state) => state.deletePetitioner);
  const resetForm = usePetitionStore((state) => state.resetForm);

  const handleAdd = () => {
    addPetitioner({
      name: "New Person",
      address: "123 Main St",
      phone: "555-1234",
      nationalId: "ABC987"
    });
  };

  return (
    <div>
      <input
        value={petitionerIdentification}
        onChange={(e) => setField('petitionerIdentification', e.target.value)}
      />
      {/* ... other form fields ... *\/}

      <ul>
        {petitioners.map((p) => (
          <li key={p.id}>
            {p.name} <button onClick={() => deletePetitioner(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={handleAdd}>Add Dummy Petitioner</button>
      <button onClick={resetForm}>Reset Form</button>
    </div>
  );
}
*/
