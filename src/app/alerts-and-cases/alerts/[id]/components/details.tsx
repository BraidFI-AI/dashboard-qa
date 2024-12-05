"use client";

import { Alert, User } from "@/core/api/ApiTypes";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import ErrorPage from "@/core/components/error_page";
import ItemRow from "@/core/components/Text/ItemRow";
import ItemRowHorizontal from "@/core/components/Text/ItemRowHorizontal";
import MyLinkText from "@/core/components/Text/LinkText";
import MyText from "@/core/components/Text/Text";
import { boxStyle } from "@/core/constants";
import { enumTextToReadableText } from "@/core/utils/formatting_util";
import linkToCounterparty from "@/core/utils/link_to_counterparty";
import { assignAlertToUser, fetchAlert } from "@/redux/slices/alerts_slice";
import { fetchCounterParty } from "@/redux/slices/CounterpartySlice";
import { UserManagementState } from "@/redux/slices/UsermanagementSlice";
import { useAppDispatch } from "@/redux/store/store";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

type AlertDetailsComponentProps = {
  alert: Alert;
  context: any;
  entity: string;
};

const AlertDetailsComponent: React.FC<AlertDetailsComponentProps> = ({
  alert,
  entity,
  context,
}) => {
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const users: User[] = useSelector((state: any) => state.userManagement.users);

  const [tempUser, setTempUsers] = useState<string[]>([]);

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    getValues,
    handleSubmit,
  } = useForm<{ username: string; alertId: string }>({
    defaultValues: {
      username: alert.assignedUsername ?? "Unassigned",
      alertId: alert.id?.toString() ?? "",
    },
  });
  const onSubmit: SubmitHandler<{
    username: string;
    alertId: string;
  }> = (data: { username: string; alertId: string }) => {
    data = { ...data, alertId: alert.id?.toString() ?? "" };

    setSubmitting(true);

    dispatch(
      assignAlertToUser({
        alertId: data.alertId,
        username: data.username == "Unassigned" ? null : data.username,
      })
    ).then((d: any) => {
      if (typeof d.payload != "string") {
        enqueueSnackbar(
          `Alert ${
            data.username == "Unassigned" ? "unassigned" : "assigned"
          } successfully`,
          { variant: "success" }
        );
      } else {
        enqueueSnackbar(d.payload, { variant: "error", persist: true });
      }
      dispatch(fetchAlert(alert.id?.toString() ?? ""));
      setSubmitting(false);
    });
  };

  useEffect(() => {
    setTempUsers([]);
    let usersList = ["Unassigned"];

    // convert users which is a list of User to a list of string
    users.forEach((user: User) => {
      usersList.push(user.Username ?? "");
    });

    setTempUsers(usersList);
  }, [users]);

  return (
    <div
      className={`flex flex-col min-w-[700px] min-h-fit rounded-[10px] justify-center items-start ${boxStyle}`}
    >
      <div className="pt-6 pb-2 px-6">
        <MyText variant="label" size="lg" weight="semibold">
          Details
        </MyText>
      </div>
      <div className="w-full pt-2 px-6 flex flex-row justify-start">
        <div className="flex flex-col justify-start w-[300px]">
          <ItemRowHorizontal
            title="Alert ID"
            value={alert.id?.toString() ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Status"
            value={enumTextToReadableText(alert.status?.toString() ?? "")}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Alert Type"
            value={enumTextToReadableText(alert.type?.toString() ?? "")}
          />
        </div>
        <div className="w-[80px]" />
        <div className="flex flex-col justify-start w-[300px]">
          <div className="flex flex-row items-center">
            <div className="pr-6">
              <MyText size="sm" color="text-[#939DA6]">
                Asignee
              </MyText>
            </div>
            <div className={`${submitting ? "pointer-events-none pr-2" : ""}`}>
              <MyControlledAutocomplete
                clearable={false}
                value={
                  getValues("username") == null
                    ? "Unassigned"
                    : getValues("username")
                }
                displayName="Username"
                name={"username"}
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                options={tempUser}
                customOnChange={(value: string) => {
                  handleSubmit(onSubmit)();
                }}
              />
            </div>
            <CircularProgress
              size={20}
              className={submitting ? "block" : "hidden"}
            />
          </div>
          <div className="h-3" />
          <ItemRowHorizontal
            title="Entity Type"
            value={enumTextToReadableText(alert.contextType?.toString() ?? "")}
          />
          <div className="h-3" />
          <AlertEntityIDComponent
            entity={entity}
            entityId={alert.contextId ?? ""}
          />
        </div>
      </div>
      <div className="h-3" />
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

const AlertEntityIDComponent: React.FC<{
  entity: string;
  entityId: string;
}> = ({ entity, entityId }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return (
    <div className="flex flex-row w-full justify-between">
      <div className="pr-1">
        <MyText size="sm" color="text-[#939DA6]">
          Entity ID
        </MyText>
      </div>
      <div className="break-all">
        {entity == "OFAC" ? (
          <MyLinkText
            textProps={{ size: "sm" }}
            link={`/compliance/ofac/${entityId}`}
          >
            {entityId}
          </MyLinkText>
        ) : entity == "LIST_314A" ? (
          <MyLinkText
            textProps={{ size: "sm" }}
            link={`/compliance/314a/${entityId}`}
          >
            {entityId}
          </MyLinkText>
        ) : entity == "PRODUCT" ? (
          <MyLinkText
            textProps={{ size: "sm" }}
            link={`/configuration/products/${entityId}`}
          >
            {entityId}
          </MyLinkText>
        ) : entity == "INDIVIDUAL" ? (
          <MyLinkText
            textProps={{ size: "sm" }}
            link={`/individuals/${entityId}`}
          >
            {entityId}
          </MyLinkText>
        ) : entity == "BUSINESS" ? (
          <MyLinkText
            textProps={{ size: "sm" }}
            link={`/businesses/${entityId}`}
          >
            {entityId}
          </MyLinkText>
        ) : entity == "COUNTERPARTY" ? (
          <div
            className="cursor-pointer"
            onClick={() => {
              dispatch(fetchCounterParty(parseInt(entityId ?? "0"))).then(
                (cp: any) => {
                  if (cp.payload) {
                    const link = linkToCounterparty(cp.payload);
                    if (link) {
                      router.push(link);
                    }
                  }
                }
              );
            }}
          >
            <div className="pointer-events-none">
              <MyText size="sm" primary underline>
                {entityId}
              </MyText>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
