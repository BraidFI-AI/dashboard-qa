"use client";

import { Alert, Product } from "@/core/api/ApiTypes";
import ItemRowHorizontal from "@/core/components/Text/ItemRowHorizontal";
import MyText from "@/core/components/Text/Text";
import { ADMIN_OPS_ROLE, ADMIN_ROLE, boxStyle } from "@/core/constants";
import { enumTextToReadableText } from "@/core/utils/formatting_util";
import timestampToDate from "@/core/utils/timestampToDate";
import toDollarFormat from "@/core/utils/toDollarFormat";
import { useSelector } from "react-redux";

type EntityTypeProductComponentProps = {
  alert: Alert;
  context: Product;
};

const EntityTypeProductComponent: React.FC<EntityTypeProductComponentProps> = ({
  alert,
  context,
}) => {
  const userType = useSelector((state: any) => state.app.userType);

  return (
    <div
      className={`flex flex-col min-w-[700px] min-h-fit rounded-[10px] justify-center items-start ${boxStyle}`}
    >
      <div className="pb-4 w-full px-6">
        <div className="pt-6 pb-2">
          <MyText variant="label" size="lg" weight="semibold">
            {context.productName}
          </MyText>
        </div>
        <div className="py-2 flex flex-row justify-start w-full">
          <div className="w-[300px] flex flex-col justify-start">
            <ItemRowHorizontal
              title="Product ID"
              value={context.id?.toString() ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Active"
              value={enumTextToReadableText(context.isActive?.toString() ?? "")}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Bank Name"
              value={context.bankName?.toString() ?? ""}
            />
            <div className="h-3" />
            <div className="pr-1">
              <MyText size="sm" color="text-[#939DA6]">
                Settlement Emails
              </MyText>
            </div>
            {context.productSettlementEmails?.map((email, index) => (
              <div
                key={index}
                className="flex flex-row justify-between items-center"
              >
                <MyText size="md">{email.settlementEmail ?? ""}</MyText>
              </div>
            ))}
            <div className="h-3" />
            <ItemRowHorizontal
              title="Settlement Phone Number"
              value={context.settlementPhoneNumber?.toString() ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Length"
              value={context.prefix?.toString() ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Prefix"
              value={context.prefix?.toString() ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Suffix"
              value={context.prefix?.toString() ?? ""}
            />
          </div>
          <div className="w-[80px]" />
          <div className="w-[300px] flex flex-col justify-start">
            {(userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE) && (
              <>
                <ItemRowHorizontal
                  title="Program"
                  value={context.programId?.toString() ?? ""}
                />
                <div className="h-3" />
                <ItemRowHorizontal
                  title="Tenant"
                  value={context.tenantId?.toString() ?? ""}
                />
                <div className="h-3" />
                <ItemRowHorizontal
                  title="Interest Rate"
                  value={`${
                    ((context as any)?.interestRate as number)?.toFixed(4) ??
                    "0.0000"
                  }%`}
                />
                <div className="h-3" />
                <ItemRowHorizontal
                  title="Interest Payout Date"
                  value={`${
                    (context as any)?.interestPayDayOfMonth?.toString() ?? ""
                  }`}
                />
                <div className="h-3" />
                <ItemRowHorizontal
                  title="Duplicate Payment Check Days"
                  value={`${
                    (context as any)?.duplicatePaymentDays?.toString() ?? ""
                  }`}
                />
                <div className="h-3" />
              </>
            )}
            <ItemRowHorizontal
              title="Account Type"
              value={context.customerAccountType ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Created"
              value={timestampToDate(context.createdAt ?? 0)}
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

export default EntityTypeProductComponent;
