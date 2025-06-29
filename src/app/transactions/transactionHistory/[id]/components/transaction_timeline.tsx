"use client";

import { Transaction } from "@/core/api/ApiTypes";
import MyText from "@/core/components/Text/Text";
import { boxStyle } from "@/core/constants";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { timestampToDate } from "@/core/utils/date_time_util";
import {
  enumTextToReadableText,
  formatTitle,
} from "@/core/utils/formatting_util";
import { useEffect, useState } from "react";

interface TransactionTimelineProps {
  transaction: Transaction;
}

export const TransactionTimeline: React.FC<TransactionTimelineProps> = ({
  transaction,
}) => {
  const [data, setData] = useState<
    { action: string; date: string; extra: string }[]
  >([]);

  useEffect(() => {
    const dateMapping = {
      createdAt: (transaction as any).createdAt,
      initiatedAt: (transaction as any).initiatedAt,
      cancelledAt: (transaction as any).cancelledAt,
      manuallyReviewedAt: (transaction as any).manuallyReviewedAt,
      returnedAt: (transaction as any).returnedAt,
      submittedAt: (transaction as any).submittedAt,
      sentAt: (transaction as any).sentAt,
    };

    // Create array of objects with both name and timestamp
    const datesWithNames = Object.entries(dateMapping)
      .filter(([_, timestamp]) => timestamp !== null)
      .sort(([_, a], [__, b]) => a - b)
      .map(([name, timestamp]) => ({
        action: formatTitle(name),
        extra: timestampToDate(timestamp, false, true).split(" ")[1],
        date: timestampToDate(timestamp),
      }));

    setData(datesWithNames);
  }, [transaction]);

  return (
    <div
      className={`justify-start rounded-lg w-[196px] h-full overflow-auto py-4 ${boxStyle}`}
    >
      <div className="px-6">
        <div className="flex flex-row px-[14px] pb-2 justify-between">
          <MyText variant="label" size="lg" weight="semibold">
            Timeline
          </MyText>
        </div>
        <Timeline
          sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          {data.map((item, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot
                  className={`${
                    item.action.toLowerCase().includes("cancel")
                      ? "bg-[#F18585]"
                      : item.action.toLowerCase().includes("sent")
                      ? "bg-[#93E8A5]"
                      : "bg-[#12A7FF]"
                  } w-[15px] h-[15px] shadow-none`}
                />

                <TimelineConnector className="w-[8px] h-[50px] rounded-lg" />
              </TimelineSeparator>
              <TimelineContent>
                <div className="flex flex-col">
                  <MyText size="xs" color="text-[#5C5C5C]" weight="bold">
                    {item.date}
                  </MyText>
                  <MyText size="sm" color="text-[#5C5C5C]">
                    {item.action}
                  </MyText>
                  <MyText size="sm" color="text-[#5C5C5C]">
                    {item.extra}
                  </MyText>
                </div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </div>
  );
};
