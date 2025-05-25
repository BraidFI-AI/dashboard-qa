import { useParams, usePathname } from "next/navigation";
import MyBlueButton from "../Button/MyBlueButton";
import CreateBusinessPage from "@/app/businesses/components/create_business";
import { useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { runSettlement } from "@/redux/slices/wire_settlement_slice";
import { enqueueSnackbar } from "notistack";
import ProcessInboundWire from "./header_buttons/process_inbound_wire";
import AchHistoryFilters from "@/app/ach/settlement/components/ach_history_filter";
import AddCaseNodeButton from "../../../app/alerts-and-cases/cases/[id]/components/add_case_note";
import ResolveCaseButton from "./header_buttons/resolve_case_button";
import EsclateAlertButton from "./header_buttons/esclate_alert_button";
import ResolveAlertButton from "./header_buttons/resolve_alert";
import UploadCaseDocumentButton from "../../../app/alerts-and-cases/cases/[id]/components/upload_case_document";
import CreateProductPage from "@/app/configuration/products/components/create_product";
import CreateBusinessAccount from "../views/account/create_business_account";
import CreateIndividualAccount from "../views/account/create_individual_account";
import WhitelistDeveloperID from "./header_buttons/white_developer_id";
import WireRunReturnSettlementButton from "./header_buttons/wire_run_return_settlement";
import Upload314AFile from "./header_buttons/upload_314a_file";
import ReturnTransactionButton from "./header_buttons/return_transaction";
import CancelTransactionButton from "./header_buttons/cancel_transaction";
import CreateVelocityLimit from "@/app/compliance/limits/components/create_limit/create_velocity_limit";
import VelocityLimitFilters from "@/app/compliance/limits/components/filters";
import GenerateMonthlyStatement from "@/app/statements/components/generate_monthly_statement";
import GenerateStatement from "@/app/statements/components/generate_monthly_statement";
import { useSelector } from "react-redux";
import {
  ADMIN_OPS_ROLE,
  ADMIN_READONLY_ROLE,
  ADMIN_ROLE,
} from "@/core/constants";

const DrawerHeaderButtons = () => {
  const pathname = usePathname();
  const params = useParams();
  const dispatch = useAppDispatch();

  const [submitting, setSubmitting] = useState(false);

  const userType = useSelector((state: any) => state.app.userType);

  const statementData = useSelector((state: any) => state.statement.statement);

  return (
    (pathname == "/businesses" && <CreateBusinessPage />) ||
    (pathname.includes("/businessAccounts") && <CreateBusinessAccount />) ||
    (pathname.includes("/individualAccounts") && <CreateIndividualAccount />) ||
    (pathname == "/configuration/products" && <CreateProductPage />) ||
    (pathname == "/wire/settlement" && (
      <div className="w-fit">
        <MyBlueButton
          submitting={submitting}
          onClick={() => {
            setSubmitting(true);
            dispatch(runSettlement()).then((d: any) => {
              if (d.payload == "done") {
                enqueueSnackbar("Settlement Generated", {
                  variant: "success",
                  persist: false,
                });
              } else {
                enqueueSnackbar(d.payload, {
                  variant: "error",
                  persist: true,
                });
              }
              setSubmitting(false);
            });
          }}
        >{`Run Settlement`}</MyBlueButton>
      </div>
    )) ||
    (pathname == "/wire/settlement/returnFiles" && (
      <WireRunReturnSettlementButton />
    )) ||
    (pathname == "/wire/processing" && <ProcessInboundWire />) ||
    (pathname == `/transactions/transactionHistory/${params.id}` && (
      <div className="flex flex-row">
        <ReturnTransactionButton />
        <div className="w-4" />
        <CancelTransactionButton />
      </div>
    )) ||
    (pathname == `/alerts-and-cases/alerts/${params.id}` && (
      <div className="flex flex-row">
        <EsclateAlertButton />
        <div className="w-4" />
        <ResolveAlertButton />
      </div>
    )) ||
    (pathname == `/alerts-and-cases/cases/${params.id}` && (
      <ResolveCaseButton />
    )) ||
    (pathname == "/ach/settlement" && <AchHistoryFilters />) ||
    (pathname.includes("/configuration/developers/") && (
      <WhitelistDeveloperID />
    )) ||
    (pathname == "/compliance/314a" && <Upload314AFile />) ||
    (pathname == "/compliance/limits" && (
      <div className="flex flex-row">
        <VelocityLimitFilters />
        <div className="w-4" />
        <CreateVelocityLimit />
      </div>
    )) ||
    (pathname.includes("/limits") && pathname.includes("program") && (
      <CreateVelocityLimit
        entityType="PROGRAM"
        entityId={params.id as string}
      />
    )) ||
    (pathname.includes("/limits") && pathname.includes("product") && (
      <CreateVelocityLimit
        entityType="PRODUCT"
        entityId={params.id as string}
      />
    )) ||
    (pathname.includes("/limits") && pathname.includes("account") && (
      <CreateVelocityLimit
        entityType="ACCOUNT"
        entityId={params.id as string}
      />
    )) ||
    (pathname == "/statements" &&
      typeof statementData != "string" &&
      (userType == ADMIN_ROLE ||
        userType == ADMIN_OPS_ROLE ||
        userType == ADMIN_READONLY_ROLE) && <GenerateStatement />)
  );
};

export default DrawerHeaderButtons;
