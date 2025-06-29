"use client";

import { AlertNote } from "@/core/api/ApiTypes";
import MyText from "@/core/components/Text/Text";
import { boxStyle } from "@/core/constants";
import { timestampToDate } from "@/core/utils/date_time_util";
type AlertNoteProps = {
  note: AlertNote;
};

const AlertNoteComponent: React.FC<AlertNoteProps> = ({ note }) => {
  return (
    <div
      className={`flex min-w-[400px] min-h-fit rounded-[10px] justify-center items-center ${boxStyle}`}
    >
      <div className="flex flex-col px-4 py-4 justify-between w-full">
        <div className="flex flex-row pb-2 justify-between">
          <MyText size="sm" weight="semibold">
            {note.username}
          </MyText>
          <MyText weight="semibold" size="sm">
            {timestampToDate(note.noteDateTime ?? 0)}
          </MyText>
        </div>
        <MyText size="sm" color="text-[#677990]">
          {note.note}
        </MyText>
      </div>
    </div>
  );
};

export default AlertNoteComponent;
