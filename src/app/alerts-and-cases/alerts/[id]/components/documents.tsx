"use client";

import { Alert, AlertDocument } from "@/core/api/ApiTypes";
import MyText from "@/core/components/Text/Text";
import DocumentComponent from "../components/document";
import { boxStyle } from "@/core/constants";
import UploadAlertDocumentButton from "./upload_alert_document";

type AlertDocumentsComponentProps = {
  alert: Alert;
};

const AlertDocumentsComponent: React.FC<AlertDocumentsComponentProps> = ({
  alert,
}) => {
  return (
    <div className={`rounded-lg w-full py-4 ${boxStyle}`}>
      <div className="flex flex-row px-6 pb-4 justify-between">
        <MyText variant="label" size="lg" weight="semibold">
          Documents
        </MyText>
        <UploadAlertDocumentButton alert={alert} />
      </div>
      <div className="px-6 h-[240px] overflow-auto">
        {alert.alertDocuments?.map((document: AlertDocument, index: number) => {
          return (
            <div className="pb-4" key={index}>
              <DocumentComponent alertDocument={document} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertDocumentsComponent;
