import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// --- Type Definition for a Source Document ---
export interface SourceDocument {
  id: string;
  url: string;
}

// --- Store State Interface ---
interface SubmissionState {
  petitionUrl: string | null;
  subjectMatter: string | null; // Added subjectMatter
  sources: SourceDocument[];
  setPetitionUrl: (url: string | null) => void;
  setSubjectMatter: (subject: string | null) => void; // Added setSubjectMatter
  addSource: (sourceData: Omit<SourceDocument, "id">) => void;
  removeSource: (id: string) => void;
  resetSubmission: () => void;
}

// --- Initial State ---
const initialState: Pick<
  SubmissionState,
  "petitionUrl" | "subjectMatter" | "sources"
> = {
  petitionUrl: null,
  subjectMatter: null, // Initialize subjectMatter
  sources: [],
};

// --- Helper Function ---
const generateUUID = () => crypto.randomUUID();

// --- Zustand Store Definition ---
export const useSubmissionStore = create<SubmissionState>()(
  persist(
    (set) => ({
      // --- State ---
      ...initialState,
      petitionUrl: null,
      subjectMatter: null,
      sources: [],

      // --- Actions ---
      setPetitionUrl: (url) => set({ petitionUrl: url }),
      setSubjectMatter: (subject) => set({ subjectMatter: subject }), // Added setSubjectMatter action

      addSource: (sourceData) => {
        const newSource: SourceDocument = {
          id: generateUUID(),
          url: sourceData.url,
        };
        set((state) => ({
          sources: [...state.sources, newSource],
        }));
      },
      removeSource: (id) =>
        set((state) => ({
          sources: state.sources.filter((source) => source.id !== id),
        })),
      resetSubmission: () => set(initialState),
    }),
    {
      name: "petition-submission-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
