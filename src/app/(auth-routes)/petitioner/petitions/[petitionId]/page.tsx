import React from "react";
import Details from "@/app/(auth-routes)/clerk/petitions/[petitionId]/details";
import Approvals from "@/app/(auth-routes)/clerk/petitions/[petitionId]/approvals";

const PetitionDetails = () => {
  return (
    <section className={"p-5 flex flex-col gap-3"}>
      <Details />
      <Approvals />
    </section>
  );
};

export default PetitionDetails;
