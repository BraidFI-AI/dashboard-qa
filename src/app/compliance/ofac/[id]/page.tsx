"use client";

import { Counterparty, OFAC } from "@/core/api/ApiTypes";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import timestampToDate from "@/core/utils/timestampToDate";
import { setTitle } from "@/redux/slices/AppSlice";
import { useAppDispatch } from "@/redux/store/store";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { fetchCounterParty } from "@/redux/slices/CounterpartySlice";
import { useParams, useRouter } from "next/navigation";
import {
  ADMIN_OPS_ROLE,
  ADMIN_ROLE,
  ADMIN_ROUTE,
  DEVELOPER_ROUTE,
} from "@/core/constants";
import RequireRole from "@/core/components/RequireRole";
import { JSONTree } from "react-json-tree";
import MyEditableTextField from "@/core/components/TextField/MyEditableTextField";
import { SubmitHandler, useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import linkToCounterparty from "@/core/utils/link_to_counterparty";
import { useSelector } from "react-redux";
import { fetchOFACHit, updateOFACHit } from "@/redux/slices/OFACSlice";

const OFACHitDetails = () => {
  const router = useRouter();

  const [navigating, setNavigating] = useState(false);

  const params = useParams();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [ofacHit, setOfacHit] = useState<OFAC | null>(null);
  const [counterparty, setCounterparty] = useState<Counterparty | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [editing, setEditing] = useState(false);

  const userType = useSelector((state: any) => state.app.userType);

  const navigateToEntity = async (row: any) => {
    if (row.transactionPaymentId) {
      router.push(
        `/transactions/transactionHistory?paymentId=${row.transactionPaymentId}`
      );
    }
    if (row.uboId) {
      router.push(`/individuals/${row.individualId}`);
    } else if (row.businessName) {
      router.push(`/businesses/${row.businessId}`);
    } else if (row.individualName) {
      router.push(`/individuals/${row.individualId}`);
    } else if (row.counterpartyName) {
      setNavigating(true);
      dispatch(fetchCounterParty(row.counterpartyId)).then((cp: any) => {
        if (cp.payload) {
          const link = linkToCounterparty(cp.payload);
          if (link) {
            router.push(link);
          }
        }
        setNavigating(false);
      });
    }
  };

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    getValues,
    handleSubmit,
    reset,
  } = useForm<{ status: string; note: string }>();
  const onSubmit: SubmitHandler<{ status: string; note: string }> = (data: {
    status: string;
    note: string;
  }) => {
    console.log("data:", data);

    if (data.note == ofacHit?.note) {
      enqueueSnackbar("Note should be updated in order to change the status", {
        variant: "error",
      });
      return;
    }

    setSubmitting(true);
    dispatch(
      updateOFACHit({
        id: ofacHit?.ofacId ?? "-1",
        status: data.status,
        note: data.note,
      })
    ).then((d: any) => {
      if (typeof d.payload == "string") {
        enqueueSnackbar(d.payload, {
          variant: "error",
          persist: true,
        });
      } else {
        enqueueSnackbar("OFAC status updated successfully", {
          variant: "success",
        });
      }
      setSubmitting(false);
      setRefresh(true);
    });
  };

  useEffect(() => {
    if (refresh) {
      setEditing(false);
      dispatch(setTitle("OFAC Check"));
      dispatch(fetchOFACHit(params.id.toString())).then((data: any) => {
        if (data.payload) {
          dispatch(setTitle(data.payload.value));
          setOfacHit(data.payload);

          if (data.payload.counterpartyId) {
            dispatch(fetchCounterParty(data.payload.counterpartyId)).then(
              (cp: any) => {
                setCounterparty(cp.payload);
                console.log(cp.payload);
              }
            );
          }
        }
        setLoading(false);
      });
      setRefresh(false);
    }
  }, [dispatch, refresh, params.id]);

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading OFAC check...</div>
        </div>
      ) : ofacHit == null ? (
        <MyText size="md">OFAC check not found</MyText>
      ) : (
        <div
          style={navigating ? { pointerEvents: "none" } : {}}
          className="flex flex-row w-[700px] justify-between"
        >
          <div className="w-[350px]">
            <ItemRow title="OFAC ID" value={ofacHit.ofacId ?? ""}></ItemRow>
            <ItemRow
              title="Created"
              value={timestampToDate(ofacHit.createdAt ?? 0)}
            ></ItemRow>
            <div
              className="cursor-pointer"
              onClick={() => {
                navigateToEntity(ofacHit);
              }}
            >
              <div className="pointer-events-none">
                <ItemRow
                  title="Entity"
                  value={{
                    value:
                      ofacHit.businessName ??
                      ofacHit.individualName ??
                      ofacHit.counterpartyName ??
                      ofacHit.transactionPaymentId ??
                      "Unknown",
                    link: "asd",
                  }}
                ></ItemRow>
              </div>
            </div>
            <ItemRow
              title="Entity Type"
              value={
                ofacHit.uboId
                  ? "UBO"
                  : ofacHit.businessName
                  ? "Business"
                  : ofacHit.individualName
                  ? "Individual"
                  : ofacHit.counterpartyName
                  ? "Counterparty"
                  : ofacHit.transactionPaymentId
                  ? "Transaction"
                  : "Unknown"
              }
            ></ItemRow>
            <ItemRow
              title="Alert ID"
              value={{
                value: ofacHit.alertId ?? "",
                link: `/alerts-and-cases/alerts/${ofacHit.alertId}`,
              }}
            ></ItemRow>
            <ItemRow title="Status" value={ofacHit.status ?? ""}></ItemRow>
            {/* Hiding the update option from ofac page to make it centeralized on alerts*/}
            {/* {userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE ? (
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="status"
                displayName="Status"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                value={ofacHit.status ?? ""}
                submitting={false}
                clearable={false}
                options={["CLEARED", "CONFIRMED"]}
              />
            ) : (
              <ItemRow title="Status" value={ofacHit.status ?? ""}></ItemRow>
            )} */}
            <ItemRow
              title="Updated"
              value={timestampToDate(ofacHit.updatedAt ?? 0)}
            ></ItemRow>
            <ItemRow
              title="Updated By"
              value={ofacHit.updatedBy ?? ""}
            ></ItemRow>
            <div className="pb-4" />
            {editing && (
              <MyBlueButton
                submitting={submitting}
                onClick={() => {
                  handleSubmit(onSubmit)();
                }}
              >
                Update
              </MyBlueButton>
            )}
          </div>
          <div className="w-[500px]">
            <ItemRow title="Note" value={ofacHit.note ?? ""}></ItemRow>
            {/* Hiding the update option from ofac page to make it centeralized on alerts*/}
            {/* {userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE ? (
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="note"
                displayName="Note"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                value={ofacHit.note ?? ""}
                submitting={false}
              />
            ) : (
              <ItemRow title="Note" value={ofacHit.note ?? ""}></ItemRow>
            )} */}

            {ofacHit.rawResults && (
              <>
                <MyText>Results</MyText>
                <JSONTree
                  data={JSON.parse(ofacHit.rawResults)}
                  hideRoot
                  theme={{
                    base00: "#ffffff",
                    base01: "#000000",
                    base02: "#000000",
                    base03: "#000000",
                    base04: "#000000",
                    base05: "#000000",
                    base06: "#000000",
                    base07: "#000000",
                    base08: "#000000",
                    base09: "#000000",
                    base0A: "#000000",
                    base0B: "#000000",
                    base0C: "#000000",
                    base0D: "#000000",
                    base0E: "#000000",
                    base0F: "#000000",
                  }}
                />
                {/* <MyText size="md">Results</MyText>
                <MyText>SDNs</MyText>
                <div className="pb-4" />
                <ItemRow
                  title="SDN Name"
                  value={ofacHit.results?.sdns?.[0]?.sdnName ?? ""}
                ></ItemRow>
                <ItemRow
                  title="Entity ID"
                  value={ofacHit.results?.sdns?.[0]?.entityID ?? ""}
                ></ItemRow>
                <ItemRow
                  title="SDN Type"
                  value={ofacHit.results?.sdns?.[0]?.sdnType ?? ""}
                ></ItemRow>
                <ItemRow
                  title="Program"
                  value={ofacHit.results?.sdns?.[0]?.program[0] ?? ""}
                ></ItemRow>
                <ItemRow
                  title="Vessel Flag"
                  value={ofacHit.results?.sdns?.[0]?.vesselFlag ?? ""}
                ></ItemRow>
                <ItemRow
                  title="Remarks"
                  value={ofacHit.results?.sdns?.[0]?.remarks ?? ""}
                ></ItemRow>
                <ItemRow
                  title="Last Refreshed"
                  value={
                    ofacHit.results?.sdns?.[0]?.refreshedAt
                      ?.replace("T", " ")
                      ?.slice(0, 19) ?? ""
                  }
                ></ItemRow> */}
              </>
            )}
          </div>
          <div className="pb-4"></div>
        </div>
      )}
    </>
  );
};

export default RequireRole(OFACHitDetails, DEVELOPER_ROUTE);
