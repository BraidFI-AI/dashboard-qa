"use client";

import DocumentComponent from "@/app/alerts-and-cases/alerts/[id]/components/document";
import { AlertDocument, Case } from "@/core/api/ApiTypes";
import MyText from "@/core/components/Text/Text";
import { boxStyle } from "@/core/constants";
import UploadCaseDocumentButton from "./upload_case_document";

type CaseDocumentsComponentProps = {
  c: Case;
};

const CaseDocumentsComponent: React.FC<CaseDocumentsComponentProps> = ({
  c,
}) => {
  return (
    <div className={`rounded-lg w-full py-4 ${boxStyle}`}>
      <div className="flex flex-row px-6 pb-4 justify-between">
        <MyText variant="label" size="lg" weight="semibold">
          Documents
        </MyText>
        <UploadCaseDocumentButton c={c} />
      </div>
      <div className="px-6 h-[240px] overflow-auto">
        {c.caseDocuments?.map((document: AlertDocument, index: number) => {
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

export default CaseDocumentsComponent;
