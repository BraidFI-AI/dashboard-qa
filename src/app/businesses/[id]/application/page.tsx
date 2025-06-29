"use client";

import { Submission } from "@/core/api/ApiTypes";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import { timestampToDate } from "@/core/utils/date_time_util";
import {
  fetchBusiness,
  fetchBusinessSubmission,
} from "@/redux/slices/BusinessSlice";
import { useAppDispatch } from "@/redux/store/store";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import { setTitle } from "@/redux/slices/AppSlice";
import { useParams } from "next/navigation";

const questionTypeMapping = (type: string) => {
  if (type === "FREE_TEXT") {
    return "Free Text";
  } else if (type === "YES_NO") {
    return "Yes/No";
  } else if (type === "DROPDOWN_LIST_MULTIPLE_SELECTION") {
    return "Multiple Selection";
  } else if (type === "DROPDOWN_LIST_SINGLE_SELECTION") {
    return "Single Selection";
  } else if (type === "CHECKBOX") {
    return "Checkbox";
  } else {
    return "Invalid Answer Type";
  }
};

const ApplicationPage = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [submission, setSubmission] = useState<Submission | null>(null);

  const params = useParams();

  useEffect(() => {
    dispatch(setTitle("Business Customer"));
    dispatch(fetchBusiness(parseInt((params.id as string) || ""))).then(
      (business: any) => {
        if (business.payload != null) {
          dispatch(setTitle(business.payload.name));
        }
        if (business.payload != null) {
          dispatch(fetchBusinessSubmission(parseInt(business.payload.id))).then(
            (data: any) => {
              setSubmission(data.payload);
              setLoading(false);
            }
          );
        } else {
          setLoading(false);
        }
      }
    );
  }, [dispatch, params.id]);

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading submission...</div>
        </div>
      ) : submission == null ? (
        <MyText size="md">No application found</MyText>
      ) : (
        <>
          <MyText size="lg">Submission</MyText>
          <div className="pb-4"></div>
          <ItemRow
            title="Submission ID"
            value={submission.submissionId}
          ></ItemRow>
          <ItemRow title="Form ID" value={submission.questionSetId}></ItemRow>
          <ItemRow
            title="Form version"
            value={submission.questionSetVersion}
          ></ItemRow>
          <ItemRow
            title="Created at"
            value={timestampToDate(submission.createdAt)}
          ></ItemRow>
          <ItemRow
            title="Updated at"
            value={timestampToDate(submission.updatedAt)}
          ></ItemRow>
          <div className="pb-2"></div>
          <Divider />
          <div className="pb-4"></div>
          <MyText size="lg">Submission Details</MyText>
          <div className="pb-4"></div>
          <div className="min-w-[700px]">
            {submission.answers.length == 0 ? (
              <MyText>
                Either no questions were configured or no question was required
              </MyText>
            ) : (
              submission.answers.map((answer, index) => {
                return (
                  <div key={index} className="pb-4">
                    {/* <ItemRow
                    title="Question ID"
                    value={answer.question.id}
                  ></ItemRow> */}
                    <ItemRow
                      title="Question"
                      value={answer.question.questionText}
                    ></ItemRow>
                    <div className="">
                      {answer.question.answerType ==
                        "DROPDOWN_LIST_MULTIPLE_SELECTION" ||
                      answer.question.answerType ==
                        "DROPDOWN_LIST_SINGLE_SELECTION" ? (
                        <ItemRow
                          title="Submitted Answers"
                          values={answer.answer.answer}
                        ></ItemRow>
                      ) : (
                        <ItemRow
                          title="Submitted Answer"
                          value={answer.answer?.answer[0] ?? ""}
                        ></ItemRow>
                      )}
                    </div>
                    {/* <ItemRow
                    title="Question Type"
                    value={questionTypeMapping(answer.question.answerType)}
                  ></ItemRow> */}
                    <div className="pb-2 w-[300px]">
                      <Divider />
                    </div>
                  </div>
                );
              })
            )}
            <div className="pb-4" />
          </div>
        </>
      )}
    </>
  );
};

export default ApplicationPage;
