"use client";

import { CounterpartyBlockedResults } from "@/core/api/ApiTypes";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import MyModal from "@/core/components/my_modal";
import { useState } from "react";

interface CounterpartyBlockedResultsViewProps {
  results: CounterpartyBlockedResults;
  modalOpen: boolean;
  handleModalClose: any;
  handleModalOpen: any;
}

const CounterpartyBlockedResultsView: React.FC<
  CounterpartyBlockedResultsViewProps
> = ({ results, modalOpen, handleModalClose, handleModalOpen }) => {
  return (
    <>
      <div onClick={handleModalOpen} className="cursor-pointer">
        <MyText primary={true}>{results.value ?? "Result"}</MyText>
      </div>

      <MyModal modalOpen={modalOpen} handleModalClose={handleModalClose}>
        <MyText>Blocked Results</MyText>
        <div className="pb-4"></div>
        <ItemRow title={results.key ?? ""} value={results.value ?? ""} />
      </MyModal>
    </>
  );
};
export default CounterpartyBlockedResultsView;
