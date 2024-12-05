"use client";

import AlertsTable from "@/app/alerts-and-cases/alerts/alerts_table";
import { Case } from "@/core/api/ApiTypes";
import MyText from "@/core/components/Text/Text";
import { boxStyle } from "@/core/constants";

type LinkedAlertsComponentProps = {
  c: Case;
};

const LinkedAlertsComponent: React.FC<LinkedAlertsComponentProps> = ({ c }) => {
  return (
    <div
      className={`flex flex-col min-w-[700px] h-[440px] rounded-[10px] justify-center items-start ${boxStyle}`}
    >
      <div className="pb-6 w-full px-6">
        <div className="pt-6 pb-3">
          <MyText variant="label" size="lg" weight="semibold">
            Linked Alerts
          </MyText>
        </div>
        <div className="h-[350px] w-full">
          <AlertsTable
            isPaginated={false}
            alerts={c.alerts}
            hideHeaders={true}
            filters={{}}
          />
        </div>
      </div>
    </div>
  );
};

export default LinkedAlertsComponent;
