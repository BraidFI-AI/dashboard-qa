"use client";

import { Alert, AlertNote, Case } from "@/core/api/ApiTypes";
import MyText from "@/core/components/Text/Text";
import { boxStyle } from "@/core/constants";
import AlertNoteComponent from "@/app/alerts-and-cases/alerts/[id]/components/note";
import AddCaseNodeButton from "./add_case_note";

type CaseNotesComponentProps = {
  c: Case;
};

const CaseNotesComponent: React.FC<CaseNotesComponentProps> = ({ c }) => {
  return (
    <div className={`rounded-lg w-full py-4 ${boxStyle}`}>
      <div className="flex flex-row px-6 pb-4 justify-between">
        <MyText variant="label" size="lg" weight="semibold">
          Notes
        </MyText>
        <AddCaseNodeButton c={c} />
      </div>
      <div className="px-6 h-[240px] overflow-auto">
        {c.caseNotes?.length == 0 ? (
          <MyText>No notes</MyText>
        ) : (
          <>
            {c.caseNotes?.map((note: any, index: number) => (
              <div className="pb-4" key={index}>
                <AlertNoteComponent note={note} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default CaseNotesComponent;
