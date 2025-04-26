"use client";

import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { getPetitionsByUserId } from "@/actions/petitions";
import { PetitionsDataTable } from "@/components/petitions-data-table";
import { Petition } from "@/components/petition-columns"; // Adjust the path if needed, and import the type and columns

const MyPetitions = () => {
  const { user } = useUserStore();
  const [petitions, setPetitions] = useState<Petition[]>([]); // State to hold petitions data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPetitions = async () => {
      if (user?.id) {
        try {
          const fetchedPetitions = await getPetitionsByUserId(user.id);
          setPetitions(fetchedPetitions);
          console.log(fetchedPetitions);
        } catch (error) {
          console.error("Failed to fetch petitions:", error);
          //  setPetitions([]); //set to empty array
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchPetitions();
  }, [user?.id]);

  if (loading) {
    return <div>Loading petitions...</div>; // Simple loading indicator
  }

  return (
    <div className={"p-5"}>
      <PetitionsDataTable data={petitions} />
    </div>
  );
};

export default MyPetitions;
