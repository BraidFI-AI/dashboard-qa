"use client";

import { VelocityLimit, VelocityLimitFilters } from "@/core/api/ApiTypes";
import MyRedButton from "@/core/components/Button/MyRedButton";
import MyModal from "@/core/components/my_modal";
import MyTable from "@/core/components/Table/MyTable";
import ItemRowHorizontal from "@/core/components/Text/ItemRowHorizontal";
import MyText from "@/core/components/Text/Text";
import {
  deactivateVelocityLimit,
  fetchVelocityLimits,
} from "@/redux/slices/velocity_limit_slice";
import { useAppDispatch } from "@/redux/store/store";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
const LimitDetails = ({
  limit,
  modalOpen,
  handleModalClose,
  filters,
}: {
  limit: VelocityLimit;
  modalOpen: boolean;
  handleModalClose: () => void;
  filters: VelocityLimitFilters;
}) => {
  const dispatch = useAppDispatch();

  const [deactivating, setDeactivating] = useState(false);

  return (
    <MyModal
      modalOpen={modalOpen}
      handleModalClose={handleModalClose}
      width={
        limit.restrictedEntities != null && limit.restrictedEntities.length > 0
          ? "700px"
          : "500px"
      }
    >
      <div className="flex flex-row justify-between">
        <MyText size="lg">{limit.limitName}</MyText>
        {limit.status == "ACTIVE" && (
          <div className="w-fit">
            <MyRedButton
              submitting={deactivating}
              onClick={() => {
                setDeactivating(true);
                dispatch(deactivateVelocityLimit(limit.id ?? "")).then(
                  (res: any) => {
                    setDeactivating(false);
                    if (typeof res.payload == "string") {
                      enqueueSnackbar(res.payload, {
                        variant: "error",
                        persist: true,
                      });
                    } else {
                      enqueueSnackbar("Limit deactivated successfully", {
                        variant: "success",
                      });
                      dispatch(
                        fetchVelocityLimits({
                          refresh: false,
                          filters: filters,
                        })
                      );
                      handleModalClose();
                    }
                  }
                );
              }}
            >
              Deactivate
            </MyRedButton>
          </div>
        )}
      </div>
      <div className="pb-4" />
      <div className="flex flex-col gap-1">
        <ItemRowHorizontal title="Limit Type" value={limit.limitType ?? ""} />
        <ItemRowHorizontal title="Status" value={limit.status ?? ""} />
        <ItemRowHorizontal title="Action" value={limit.action ?? ""} />
        <div className="flex flex-row gap-4">
          <ItemRowHorizontal
            title="Associated Entity"
            value={
              (limit as any).programId != null
                ? "Program"
                : (limit as any).productId != null
                ? "Product"
                : (limit as any).accountNumber != null
                ? "Account"
                : (limit as any).counterpartyId != null
                ? "Counterparty"
                : "Global"
            }
          />
          {!(
            (limit as any).programId == null &&
            (limit as any).productId == null &&
            (limit as any).accountNumber == null &&
            (limit as any).counterpartyId == null
          ) && (
            <ItemRowHorizontal
              title="Associated Entity ID"
              value={
                (limit as any).programId != null
                  ? (limit as any).programId
                  : (limit as any).productId != null
                  ? (limit as any).productId
                  : (limit as any).accountNumber != null
                  ? (limit as any).accountNumber
                  : (limit as any).counterpartyId != null
                  ? (limit as any).counterpartyId
                  : ""
              }
            />
          )}
        </div>
        <ItemRowHorizontal
          title="Aggregation Level"
          value={limit.aggregationLevel ?? ""}
        />
        <ItemRowHorizontal
          title="Aggregation Days"
          value={limit.aggregationDays ?? ""}
        />
        <ItemRowHorizontal
          title="Volume"
          value={limit.volume?.toString() ?? ""}
        />
        <ItemRowHorizontal
          title="Frequency Max"
          value={limit.frequencyMax ?? ""}
        />
      </div>
      <div className="pb-4" />
      {limit.transactionGroups != null &&
        limit.transactionGroups.length > 0 && (
          <div className="flex flex-col gap-1">
            <MyText>Transaction Types | Groups</MyText>
            <div className="flex flex-col gap-1">
              {limit.transactionGroups.map((transactionGroup, index) => (
                <MyText key={index}>{transactionGroup}</MyText>
              ))}
            </div>
          </div>
        )}
      {limit.transactionTypes != null && limit.transactionTypes.length > 0 && (
        <div className="flex flex-col gap-1">
          <MyText weight="semibold">Transaction Types | Groups</MyText>
          <div className="flex flex-col gap-1">
            {limit.transactionTypes.map((transactionType, index) => (
              <MyText key={index}>{transactionType}</MyText>
            ))}
          </div>
        </div>
      )}
      <div className="pb-4" />
      {limit.restrictedEntities != null &&
        limit.restrictedEntities.length > 0 && (
          <div className="flex flex-col gap-1">
            <MyText weight="semibold">Restricted Entities</MyText>
            <MyTable
              hideColumnsButton
              hideDensityButton
              hideFilterButton
              hideSearch
              rows={limit.restrictedEntities}
              columns={[
                {
                  field: "id",
                  headerName: "Entity ID",
                  flex: 1,
                  minWidth: 120,
                },
                {
                  field: "type",
                  headerName: "Type",
                  flex: 1,
                  minWidth: 120,
                },
                {
                  field: "entityName",
                  headerName: "Name",
                  flex: 1,
                  minWidth: 120,
                },
                {
                  field: "entityCode",
                  headerName: "Code",
                  flex: 1,
                  minWidth: 120,
                },
              ]}
              handleRowClick={() => {}}
            />
          </div>
        )}
    </MyModal>
  );
};

export default LimitDetails;
