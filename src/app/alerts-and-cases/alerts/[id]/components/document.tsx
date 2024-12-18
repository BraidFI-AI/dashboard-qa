"use client";

import { AlertDocument } from "@/core/api/ApiTypes";
import Image from "next/image";
import MyText from "@/core/components/Text/Text";
import { boxStyle } from "@/core/constants";
import timestampToDate from "@/core/utils/timestampToDate";
import Link from "next/link";
import { useParams } from "next/navigation";
import ItemRowHorizontal from "@/core/components/Text/ItemRowHorizontal";

type DocumentComponentProps = {
  alertDocument: AlertDocument;
};
const DocumentComponent: React.FC<DocumentComponentProps> = ({
  alertDocument,
}) => {
  const params = useParams();

  const handleFullscreen = (id: string) => {
    const container = document.getElementById(id);

    if (container) {
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div
      className={`flex min-w-[400px] min-h-[187px] rounded-[10px] justify-start items-center ${boxStyle}`}
    >
      <div className="flex flex-col w-full py-4 px-4">
        <div className="flex flex-row items-center">
          <div className="relative w-[280px] h-[160px] flex justify-center items-center">
            {alertDocument.fileType == "image" ? (
              <Image
                alt={alertDocument.documentType ?? ""}
                id={alertDocument.id?.toString()}
                layout="fill"
                style={{
                  objectFit: "contain",
                }}
                className="rounded-xl hover:cursor-zoom-in"
                src={alertDocument.documentUrl ?? ""}
                loading="lazy"
                onClick={() =>
                  handleFullscreen(alertDocument.id?.toString() ?? "")
                }
              />
            ) : (
              <div className=" underline text-[#12A7FF]">
                <Link
                  href={`/alerts-and-cases/alerts/${params.id.toString()}/${encodeURIComponent(
                    (alertDocument as any).documentUrl
                  )}`}
                >
                  <MyText size="md">View PDF</MyText>
                </Link>
              </div>
            )}
          </div>
          <div className="flex flex-col pl-4 w-full">
            <ItemRowHorizontal
              colon
              title="Name"
              value={alertDocument.name ?? ""}
            />
            <ItemRowHorizontal
              colon
              title="Type"
              value={alertDocument.documentType ?? ""}
            />
            <ItemRowHorizontal
              title="Created"
              colon
              value={timestampToDate(alertDocument.createdAt ?? 0)}
            />
            <ItemRowHorizontal
              title="Updated"
              colon
              value={timestampToDate(alertDocument.updatedAt ?? 0)}
            />
          </div>
        </div>
        <div className="flex flex-row px-6">
          <MyText size="sm" color="text-[#677990]">
            Description:
          </MyText>
          <div className="break-all pl-1">
            <MyText size="sm">
              {alertDocument.description?.toString() ?? ""}
            </MyText>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentComponent;
