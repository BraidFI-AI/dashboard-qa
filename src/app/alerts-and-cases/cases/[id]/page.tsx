"use client";

import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import { setTitle } from "@/redux/slices/AppSlice";
import { fetchCase } from "@/redux/slices/cases_slice";
import { useAppDispatch } from "@/redux/store/store";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Case } from "@/core/api/ApiTypes";
import CaseDetailsComponent from "./components/details";
import LinkedAlertsComponent from "./components/linked_alerts";
import CaseNotesComponent from "./components/notes";
import CaseDocumentsComponent from "./components/documents";
import CaseTimelineComponent from "./components/timeline";
import { SCROLLBAR_STYLE } from "@/core/constants";

const CasesPage = () => {
  const dispatch = useAppDispatch();
  const params = useParams();

  const detailsRef = useRef<HTMLDivElement>(null);
  const [detailsWidth, setDetailsWidth] = useState<number | null>(null);

  const c: "loading" | string | Case = useSelector(
    (state: any) => state.cases.case
  );

  useEffect(() => {
    dispatch(setTitle("Case"));
    dispatch(fetchCase((params.id as string) || "0")).then((data: any) => {
      if (typeof data.payload != "string") {
        dispatch(setTitle(data.payload.name));
      }
    });
  }, [dispatch, params.id]);

  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const children = Array.from(entry.target.children);
        const totalWidth = children.reduce((sum, child) => {
          return sum + child.clientWidth;
        }, 0);

        setDetailsWidth(totalWidth);
      }
    });

    // Start observing the column
    resizeObserver.observe(details);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, [c]);

  return c == "loading" ? (
    <MyCircularProgressIndicator />
  ) : typeof c == "string" ? (
    <ErrorPage
      error={c}
      recoveryButtonTitle="Retry"
      recoveryButtonOnClick={() => {
        dispatch(fetchCase((params.id as string) || "0")).then((data: any) => {
          if (typeof data.payload != "string") {
            dispatch(setTitle(data.payload.name));
          }
        });
      }}
    />
  ) : (
    <div className={`${SCROLLBAR_STYLE}`}>
      <div className="flex flex-row">
        <div className="flex flex-col w-full pr-6">
          <div ref={detailsRef}>
            <CaseDetailsComponent c={c} />
          </div>
          <div className="h-6" />
          <div
            style={{
              width: detailsWidth ? `${detailsWidth}px` : "auto",
            }}
          >
            <LinkedAlertsComponent c={c} />
          </div>
        </div>
        <div className="h-[664px]">
          <CaseTimelineComponent c={c} />
        </div>
      </div>
      <div className="h-6" />
      <div className="w-full flex flex-row pr-6">
        <div className="pr-4 w-full">
          <CaseNotesComponent c={c} />
        </div>
        <CaseDocumentsComponent c={c} />
      </div>
      <div className="h-10" />
    </div>
  );
};

export default CasesPage;
