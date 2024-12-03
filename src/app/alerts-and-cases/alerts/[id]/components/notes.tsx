"use client";

import { Alert, AlertNote } from "@/core/api/ApiTypes";
import MyText from "@/core/components/Text/Text";
import AlertNoteComponent from "../components/note";
import { boxBorderStyle } from "@/core/constants";
import AddAlertNodeButton from "@/app/alerts-and-cases/alerts/[id]/components/add_alert_note";

type AlertNotesComponentProps = {
  alert: Alert;
};

const AlertNotesComponent: React.FC<AlertNotesComponentProps> = ({ alert }) => {
  return (
    <div className={`rounded-lg w-full shadow-md py-4 ${boxBorderStyle}`}>
      <div className="flex flex-row px-6 pb-4 justify-between">
        <MyText variant="label" size="lg" weight="semibold">
          Notes
        </MyText>
        <AddAlertNodeButton alert={alert} />
      </div>
      <div className="px-10 h-[240px] overflow-auto">
        {alert.alertNotes?.length == 0 ? (
          <MyText>No notes</MyText>
        ) : (
          <>
            {alert.alertNotes?.map((note: any, index: number) => (
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

export default AlertNotesComponent;
