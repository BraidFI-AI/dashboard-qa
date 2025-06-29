"use client";

import { Alert, Individual } from "@/core/api/ApiTypes";
import ItemRowHorizontal from "@/core/components/Text/ItemRowHorizontal";
import MyText from "@/core/components/Text/Text";
import { boxStyle } from "@/core/constants";
import { timestampToDate } from "@/core/utils/date_time_util";
type EntityTypeIndividualComponentProps = {
  alert: Alert;
  context: Individual;
};

const EntityTypeIndividualComponent: React.FC<
  EntityTypeIndividualComponentProps
> = ({ alert, context }) => {
  return (
    <div
      className={`flex flex-col min-w-[700px] min-h-fit rounded-[10px] justify-center items-start ${boxStyle}`}
    >
      <div className="pb-4 w-full px-6">
        <div className="pt-6 pb-2">
          <MyText variant="label" size="lg" weight="semibold">
            {`${context.firstName} ${context.lastName}`}
          </MyText>
        </div>
        <div className="py-2 flex flex-row justify-start w-full">
          <div className="w-[300px] flex flex-col justify-start">
            <ItemRowHorizontal
              title="ID"
              value={context.id?.toString() ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Name"
              value={`${context.firstName?.toString() ?? ""} ${
                context.lastName?.toString() ?? ""
              }`}
            />

            <div className="h-3" />
            <ItemRowHorizontal title="Email" value={context.email ?? ""} />
            <div className="h-3" />
            <ItemRowHorizontal
              title="ACH Company ID"
              value={context.achCompanyId?.toString() ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="ID Number"
              value={context.idNumber?.toString() ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="ID Number Type"
              value={context.idType?.toString() ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Date of Birth"
              value={
                context.dateOfBirth?.toString()?.replaceAll(",", "-") ?? ""
              }
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Created"
              value={timestampToDate(context.createdAt ?? 0)}
            />
          </div>
          <div className="w-[80px]" />
          <div className="w-[300px] flex flex-col justify-start">
            <ItemRowHorizontal
              title="Street Address"
              value={(context as any)?.addresses?.[0]?.line1 ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Apartment, suite, or floor"
              value={(context as any)?.addresses?.[0]?.line2 ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Country Code"
              value={(context as any)?.addresses?.[0]?.countryCode ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="State"
              value={(context as any)?.addresses?.[0]?.state ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="City"
              value={(context as any)?.addresses?.[0]?.city ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Postal Code"
              value={(context as any)?.addresses?.[0]?.postalCode ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Updated"
              value={timestampToDate(context.updatedAt ?? 0)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityTypeIndividualComponent;
