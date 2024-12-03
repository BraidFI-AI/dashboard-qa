import { useParams, usePathname } from "next/navigation";
import MyBlueButton from "../Button/MyBlueButton";
import CreateBusinessPage from "@/app/businesses/components/create_business";
import { useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { runSettlement } from "@/redux/slices/wire_settlement_slice";
import { enqueueSnackbar } from "notistack";
import ProcessInboundWire from "./header_buttons/process_inbound_wire";
import AchHistoryFilters from "@/app/ach/settlement/components/ach_history_filter";
import AddCaseNodeButton from "./header_buttons/add_case_note";
import ResolveCaseButton from "./header_buttons/resolve_case_button";
import EsclateAlertButton from "./header_buttons/esclate_alert_button";
import ResolveAlertButton from "./header_buttons/resolve_alert";
import UploadCaseDocumentButton from "./header_buttons/upload_case_document";
import CreateProductPage from "@/app/configuration/products/components/create_product";
import CreateBusinessAccount from "../views/account/create_business_account";
import CreateIndividualAccount from "../views/account/create_individual_account";
import WhitelistDeveloperID from "./header_buttons/white_developer_id";
import WireRunReturnSettlementButton from "./header_buttons/wire_run_return_settlement";
import Upload314AFile from "./header_buttons/upload_314a_file";

const DrawerHeaderButtons = () => {
  const pathname = usePathname();
  const params = useParams();
  const dispatch = useAppDispatch();

  const [submitting, setSubmitting] = useState(false);

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
    (pathname == `/alerts-and-cases/cases/${params.id}/notes` && (
      <AddCaseNodeButton />
    )) ||
    (pathname == `/alerts-and-cases/cases/${params.id}/documents` && (
      <UploadCaseDocumentButton />
    )) ||
    (pathname == "/ach/settlement" && <AchHistoryFilters />) ||
    (pathname.includes("/configuration/developers/") && (
      <WhitelistDeveloperID />
    )) ||
    (pathname == "/compliance/314a" && <Upload314AFile />)
  );
};

export default DrawerHeaderButtons;
