"use client";

import { Alert } from "@/core/api/ApiTypes";
import ErrorPage from "@/core/components/error_page";
import ItemRow from "@/core/components/Text/ItemRow";
import ItemRowHorizontal from "@/core/components/Text/ItemRowHorizontal";
import MyText from "@/core/components/Text/Text";
import { boxBorderStyle } from "@/core/constants";

type AlertDetailsComponentProps = {
  alert: Alert;
  context: any;
};

const AlertDetailsComponent: React.FC<AlertDetailsComponentProps> = ({
  alert,
  context,
}) => {
  return (
    <div
      className={`flex flex-col min-w-[700px] min-h-fit rounded-[10px] shadow-md justify-center items-start ${boxBorderStyle}`}
    >
      <div className="pt-6 pb-2 px-6">
        <MyText variant="label" size="lg" weight="semibold">
          Details
        </MyText>
      </div>
      <div className="w-full py-2 px-6 flex flex-row justify-between">
        <div className="flex flex-col justify-start pr-10">
          <ItemRowHorizontal
            title="Alert ID"
            value={alert.id?.toString() ?? ""}
          />
          <div className="h-2" />
          <ItemRowHorizontal
            title="Status"
            value={alert.status?.toString() ?? ""}
          />
          <div className="h-2" />
          <ItemRowHorizontal
            title="Alert Type"
            value={alert.type?.toString() ?? ""}
          />
        </div>
        <div className="flex flex-col justify-start">
          <ItemRowHorizontal
            title="Asignee"
            value={alert.status?.toString() ?? ""}
          />
          <div className="h-2" />
          <ItemRowHorizontal
            title="Entity Type"
            value={alert.contextType?.toString() ?? ""}
          />
          <div className="h-2" />
          {alert.type == "LIST_314A" ? (
            <ItemRow
              title="Entity ID"
              value={{
                value: alert.contextId,
                link: `/compliance/314a/${alert.contextId}`,
              }}
            />
          ) : alert.type == "OFAC" ? (
            <ItemRow
              title="Entity ID"
              value={{
                value: alert.contextId,
                link: `/compliance/ofac/${alert.contextId}`,
              }}
            />
          ) : alert.type == "TRANSACTION_MONITORING" ||
            alert.type == "TRANSACTION_REVIEW" ? (
            <div
              className="cursor-pointer"
              onClick={(e: any) => {
                // if (alert.contextType == "TRANSACTION") {
                //   handleReviewModalOpen();
                //   e.preventDefault();
                //   e.stopPropagation();
                // }
              }}
            >
              <ItemRowHorizontal
                title="Entity ID"
                value={alert.contextId ?? ""}
                // primary={true}
              />
            </div>
          ) : alert.type == "DUAL_APPROVAL" ? (
            <>
              {context == "loading" ? (
                alert.contextType == "VELOCITY_LIMIT" ? (
                  <ItemRowHorizontal
                    title="Entity ID"
                    value={alert.contextId ?? ""}
                  />
                ) : (
                  <ItemRow
                    title="Entity ID"
                    value={{
                      value: alert.contextId,
                      link:
                        alert.contextType == "PRODUCT"
                          ? `/configuration/products/${alert.contextId}`
                          : alert.contextType == "FILE_NAME"
                          ? `/transactions/transactionHistory?wireFileHandle=${alert.contextId}`
                          : "",
                    }}
                  />
                )
              ) : context == null || typeof context == "string" ? (
                <ErrorPage
                  error={
                    typeof context == "string"
                      ? context
                      : `Failed to fetch ${alert.contextType
                          ?.toLowerCase()
                          ?.replaceAll("_", " ")}`
                  }
                  recoveryButtonTitle="Retry"
                  recoveryButtonOnClick={() => {
                    // dispatch(fetchLimit(alert.contextId.toString())).then(
                    //   (data: any) => {
                    //     setContext(data.payload);
                    //   }
                    // );
                  }}
                />
              ) : (
                <ItemRow
                  title="Entity ID"
                  value={{
                    value:
                      alert.contextType == "VELOCITY_LIMIT"
                        ? context.limitName
                        : alert.contextId,
                    link:
                      alert.contextType == "VELOCITY_LIMIT"
                        ? context.productId != null
                          ? `/configuration/products/${context.productId}/limits/${context.id}`
                          : `/accounts/${context.accountNumber}/limits/${context.id}`
                        : alert.contextType == "PRODUCT"
                        ? `/configuration/products/${alert.contextId}`
                        : alert.contextType == "FILE_NAME"
                        ? `/transactions/transactionHistory?wireFileHandle=${alert.contextId}`
                        : "",
                  }}
                />
              )}
            </>
          ) : (
            <ItemRowHorizontal
              title="Entity ID"
              value={alert.contextId ?? ""}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col pb-6 px-6">
        <MyText size="sm" color="text-[#939DA6]">
          Description
        </MyText>
        <div className="break-all">
          <MyText size="sm">{alert.description?.toString() ?? ""}</MyText>
        </div>
      </div>
    </div>
  );
};

export default AlertDetailsComponent;
