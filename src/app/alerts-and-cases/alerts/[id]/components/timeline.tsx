"use client";

import { Alert } from "@/core/api/ApiTypes";
import MyText from "@/core/components/Text/Text";
import { boxBorderStyle } from "@/core/constants";
import Timeline from "@mui/lab/Timeline";

type AlertTimelineComponentProps = {
  alert: Alert;
};

const AlertTimelineComponent: React.FC<AlertTimelineComponentProps> = ({
  alert,
}) => {
  return alert.alertTimelines?.length == 0 ? (
    <></>
  ) : (
    <div className={`rounded-lg w-[240px] shadow-md py-4 ${boxBorderStyle}`}>
      <div className="flex flex-row px-6 pb-4 justify-between">
        <MyText variant="label" size="lg" weight="semibold">
          Timeline
        </MyText>
      </div>
      <Timeline
      // sx={{
      //   [`& .${timelineItemClasses.root}:before`]: {
      //     flex: 0,
      //     padding: 0,
      //   },
      // }}
      >
        {alert.alertTimelines?.map((timeline: any, index: number) => {
          return <></>;
        })}
      </Timeline>
    </div>
  );
};

export default AlertTimelineComponent;
