"use client";

import { AlertTimeline, Case } from "@/core/api/ApiTypes";
import MyText from "@/core/components/Text/Text";
import { boxStyle } from "@/core/constants";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import timestampToDate from "@/core/utils/timestampToDate";
import { enumTextToReadableText } from "@/core/utils/formatting_util";

type CaseTimelineComponentProps = {
  c: Case;
};

const CaseTimelineComponent: React.FC<CaseTimelineComponentProps> = ({ c }) => {
  return c.caseTimelines?.length == 0 ? (
    <></>
  ) : (
    <div
      className={`justify-start rounded-lg w-[260px] h-full overflow-auto py-4 ${boxStyle}`}
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
          {c.caseTimelines?.map((timeline: AlertTimeline, index: number) => {
            return (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot
                    className={`${
                      timeline.action?.toLowerCase() == "created" ||
                      timeline.action == "ESCALATED_TO_CASE"
                        ? "bg-[#F18585]"
                        : timeline.action?.toLowerCase() == "approved"
                        ? "bg-[#93E8A5]"
                        : "bg-[#12A7FF]"
                    } w-[15px] h-[15px] shadow-none`}
                  />
                  {c.caseTimelines != undefined &&
                    index < c.caseTimelines.length - 1 && (
                      <TimelineConnector className="w-[8px] h-[50px] rounded-lg" />
                    )}
                </TimelineSeparator>
                <TimelineContent>
                  <div className="flex flex-col">
                    <MyText size="xs" color="text-[#5C5C5C]" weight="bold">
                      {timestampToDate(
                        timeline.actionDateTime ?? 0,
                        false,
                        true
                      )}
                    </MyText>
                    <MyText>
                      {enumTextToReadableText(timeline.action ?? "")}
                    </MyText>
                    <MyText size="sm" color="text-[#5C5C5C]">
                      {timeline.username}
                    </MyText>
                  </div>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </div>
    </div>
  );
};

export default CaseTimelineComponent;
