"use client";

import {
  CustomizableForm,
  CustomizableFormQuestion,
} from "@/core/api/ApiTypes";
import {
  addQuestion,
  deleteQuestion,
  fetchForm,
  updateQuestion,
} from "@/redux/slices/CustomizableFormSlice";
import { useAppDispatch } from "@/redux/store/store";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import MyText from "@/core/components/Text/Text";
import { SubmitHandler, useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import ItemRow from "@/core/components/Text/ItemRow";
import timestampToDate from "@/core/utils/timestampToDate";
import MyEditButton from "@/core/components/Button/MyEditButton";
import MyEditableTextField from "@/core/components/TextField/MyEditableTextField";
import MyTextButton from "@/core/components/Button/MyTextButton";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MyTextField from "@/core/components/TextField/MyTextField";
import _ from "lodash";
import MyRefTextField from "@/core/components/TextField/MyRefTextField";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

const FormSettings = ({ params }: { params: { id: number } }) => {
  const searchParams = useSearchParams();
  const [version, setVersion] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const [addingQuestion, setAddingQuestion] = useState(false);

  const [form, setForm] = useState<CustomizableForm | null>(null);
  const [originalForm, setOriginalForm] = useState<CustomizableForm | null>(
    null
  );
  const [addQuestionValueRefs, setAddQuestionValueRefs] = useState<
    any[] | null
  >(null);

  const [addQuestionValueErrors, setAddQuestionValueErrors] = useState<
    boolean[] | null
  >(null);

  const [submitting, setSubmitting] = useState<boolean[] | null>(null);
  const [verticalLayout, setVerticalLayout] = useState(false);

  const [editingQuestionNo, setEditingQuestionNo] = useState<boolean[] | null>(
    null
  );

  const [deleteQuestionIndex, setDeleteQuestionIndex] = useState(-1);
  const [deletingQuestion, setDeletingQuestion] = useState(false);

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
  } = useForm<{ index: number; form: CustomizableForm }>();
  const onSubmit: SubmitHandler<{
    index: number;
    form: CustomizableForm;
  }> = (data: { index: number; form: CustomizableForm }) => {
    console.log("data:", data);

    if (data.index == -1) {
      return;
    }

    const tempArr = Array.from(submitting!);
    tempArr[data.index] = true;

    setSubmitting(tempArr);

    dispatch(updateQuestion(data.form.questions[data.index])).then((q: any) => {
      if (q.payload) {
        enqueueSnackbar("Question updated!", { variant: "success" });

        const tempArr = Array.from(submitting!);
        tempArr[data.index] = false;

        setSubmitting(tempArr);

        const tempEditing = Array.from(editingQuestionNo!);
        tempEditing[data.index] = false;

        setEditingQuestionNo(tempEditing);
      }
      {
        const tempArr = Array.from(submitting!);
        tempArr[data.index] = false;

        setRefresh(true);
        setSubmitting(tempArr);
      }
    });
  };

  useEffect(() => {
    if (isSubmitted && !isValid) {
      enqueueSnackbar("Invalid Fields", { variant: "error" });
      console.log(errors);
    }
  }, [submitCount, isSubmitted, isValid, errors]);

  useEffect(() => {
    if (refresh) {
      setLoading(true);
      const current = new URLSearchParams(searchParams.toString());

      const v = current.get("version");
      let ver = undefined;
      if (v != null && v != "") {
        setVersion(parseInt(v));
        ver = parseInt(v);
      }

      ver = undefined; // making the version undefined
      dispatch(fetchForm({ id: params.id, version: ver })).then((data: any) => {
        if (data.payload) {
          reset({ index: -1, form: { ...data.payload } });
          setOriginalForm(_.cloneDeep(data.payload));
          setForm({ ...data.payload });
          setEditingQuestionNo(
            Array.from(
              { length: data.payload.questions.length },
              (v: any) => false
            )
          );
          setAddQuestionValueRefs(
            Array.from({ length: data.payload.questions.length }, (v: any) =>
              React.createRef()
            )
          );
          setSubmitting(
            Array.from(
              { length: data.payload.questions.length },
              (v: any) => false
            )
          );
          setAddQuestionValueErrors(
            Array.from(
              { length: data.payload.questions.length },
              (v: any) => false
            )
          );
        }
        setLoading(false);
      });
      setRefresh(false);
    }
  }, [dispatch, params.id, version, searchParams, reset, refresh]);

  useEffect(() => {
    console.log("form changed:", form);
  }, [form]);

  const handleClickOpen = (index: number) => {
    setDeleteQuestionIndex(index);
  };

  const handleClose = () => {
    setDeleteQuestionIndex(-1);
  };

  return (
    <Suspense>
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading Forms...</div>
        </div>
      ) : form == null ? (
        <MyText size="md">Form Not found</MyText>
      ) : (
        editingQuestionNo != null && (
          <>
            {
              <Dialog
                open={deleteQuestionIndex != -1 ? true : false}
                onClose={handleClose}
              >
                <DialogTitle>
                  {`Delete question ${deleteQuestionIndex.toString()}`}
                </DialogTitle>
                <DialogContent>
                  <MyText size="md">
                    Are you sure you want to delete this question?
                  </MyText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button
                    onClick={() => {
                      setDeletingQuestion(true);
                      dispatch(
                        deleteQuestion({
                          id: form.questionSetId,
                          questionId:
                            form.questions[deleteQuestionIndex - 1].id,
                        })
                      ).then((p: any) => {
                        // if (p.payload) {
                        //   if (originalForm != null) {
                        //     let tempOForm: CustomizableForm = {
                        //       ...originalForm,
                        //     };
                        //     let tempOQuestions = tempOForm.questions;
                        //     let updatedOQuestions = tempOQuestions!.filter(
                        //       (_, index) => index != deleteQuestionIndex - 1
                        //     );

                        //     tempOForm = {
                        //       ...tempOForm,
                        //       questions: updatedOQuestions,
                        //     };

                        //     setOriginalForm(_.cloneDeep(tempOForm));
                        //   }

                        //   if (form != null) {
                        //     let tempForm = { ...form };
                        //     let tempQuestions = tempForm.questions;
                        //     let updatedQuestions = tempQuestions!.filter(
                        //       (_, index) => index != deleteQuestionIndex - 1
                        //     );

                        //     tempForm = {
                        //       ...tempForm,
                        //       questions: updatedQuestions,
                        //     };

                        //     setForm(_.cloneDeep(tempForm));
                        //   }

                        //   if (editingQuestionNo != null) {
                        //     let tempEditingQuestionNo = editingQuestionNo;
                        //     let updatedEditingQuestionNo =
                        //       tempEditingQuestionNo!.filter(
                        //         (_, index) => index != deleteQuestionIndex - 1
                        //       );

                        //     setEditingQuestionNo(updatedEditingQuestionNo);
                        //   }

                        //   if (addQuestionValueRefs != null) {
                        //     let tempAddQuestionValueRefs = addQuestionValueRefs;
                        //     let updatedAddQuestionValueRefs =
                        //       tempAddQuestionValueRefs!.filter(
                        //         (_, index) => index != deleteQuestionIndex - 1
                        //       );
                        //     setAddQuestionValueRefs(
                        //       updatedAddQuestionValueRefs
                        //     );
                        //   }

                        //   if (submitting != null) {
                        //     let tempSubmitting = submitting;
                        //     let updatedSubmitting = tempSubmitting!.filter(
                        //       (_, index) => index != deleteQuestionIndex - 1
                        //     );
                        //     setSubmitting(updatedSubmitting);
                        //   }

                        //   if (addQuestionValueErrors != null) {
                        //     let tempAddQuestionValueErrors =
                        //       addQuestionValueErrors;
                        //     let updatedAddQuestionValueErrors =
                        //       tempAddQuestionValueErrors!.filter(
                        //         (_, index) => index != deleteQuestionIndex - 1
                        //       );
                        //     setAddQuestionValueErrors(
                        //       updatedAddQuestionValueErrors
                        //     );
                        //   }
                        // }
                        setRefresh(true);
                        setDeletingQuestion(false);
                        setDeleteQuestionIndex(-1);
                      });
                    }}
                    autoFocus
                  >
                    {deletingQuestion ? (
                      <CircularProgress size="25px" />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </DialogActions>
              </Dialog>
            }
            <div className="">
              {form.questions.map(
                (question: CustomizableFormQuestion, index: number) => {
                  return (
                    <div key={index} className="flex flex-col">
                      <Box className="w-[200px] flex flex-row">
                        <div className="pb-[20px]">
                          <MyText size="md">{`Question ${index + 1}`}</MyText>
                        </div>
                        {/* <ItemRow
                        title=
                        value={question.id}
                      ></ItemRow> */}
                        <Box className="w-[30px]" />
                        <Box>
                          <MyEditButton
                            editing={editingQuestionNo[index]}
                            customSetEditing={() => {
                              const tempArr = Array.from(editingQuestionNo);
                              tempArr[index] =
                                editingQuestionNo[index] == true ? false : true;

                              if (tempArr[index] == false) {
                                // revert the question to original state if editing is cancelled
                                const question:
                                  | CustomizableFormQuestion
                                  | undefined = originalForm?.questions[index];
                                console.log("before:", question);

                                if (question != undefined) {
                                  let tempForm: CustomizableForm = { ...form };
                                  const tempQuestions: CustomizableFormQuestion[] =
                                    form.questions;
                                  tempQuestions[index] = { ...question };

                                  tempForm = {
                                    ...tempForm,
                                    questions: tempQuestions,
                                  };

                                  console.log("reverting:", tempForm);
                                  console.log(
                                    "to original question:",
                                    question
                                  );

                                  setForm(_.cloneDeep(tempForm));
                                  reset({ index: -1, form: { ...tempForm } });
                                }
                              }

                              setEditingQuestionNo(tempArr);
                            }}
                          />
                        </Box>
                        <Box className="w-[10px]" />
                        <Box>
                          <IconButton
                            style={{
                              padding: 5,
                              margin: 0,
                              color: "red",
                            }}
                            onClick={() => {
                              handleClickOpen(index + 1);
                            }}
                          >
                            <DeleteOutlineRoundedIcon
                              style={{
                                padding: 0,
                                margin: 0,
                                color: "red",
                              }}
                            />
                          </IconButton>
                        </Box>
                      </Box>
                      <Box className="flex flex-row">
                        <Box className="w-[200px]">
                          <MyEditableTextField
                            editable={false}
                            editing={editingQuestionNo[index]}
                            setEditing={() => {}}
                            name={`form.questions.${index}.questionText`}
                            displayName="Question Text"
                            control={control}
                            errors={errors}
                            rules={
                              submitting
                                ? { required: false }
                                : {
                                    required: true,
                                  }
                            }
                            value={question.questionText}
                            submitting={false}
                            customOnChange={(val: string) => {
                              let tempForm = { ...form };
                              let tempQuestions = tempForm.questions;
                              let tempQuestion: CustomizableFormQuestion =
                                tempQuestions[index];

                              let updatedQuestion: CustomizableFormQuestion = {
                                ...tempQuestion,
                                questionText: val,
                              };

                              tempQuestions[index] = {
                                ...updatedQuestion,
                              };
                              tempForm = {
                                ...tempForm,
                                questions: tempQuestions,
                              };

                              setForm(_.cloneDeep(tempForm));
                              reset({ index: -1, form: { ...tempForm } });
                            }}
                          />
                        </Box>
                        <Box className="w-4" />
                        <Box className="w-[200px]">
                          <MyEditableTextField
                            editable={false}
                            editing={editingQuestionNo[index]}
                            setEditing={() => {}}
                            name={`form.questions.${index}.displayPosition`}
                            displayName="Display Position"
                            control={control}
                            errors={errors}
                            rules={
                              submitting
                                ? { required: false, pattern: null }
                                : {
                                    required: true,
                                    pattern: /^[0-9]+$/,
                                  }
                            }
                            value={question.displayPosition}
                            submitting={false}
                            customOnChange={(val: string) => {
                              if (!parseInt(val)) {
                                return;
                              }
                              let tempForm = { ...form };
                              let tempQuestions = tempForm.questions;
                              let tempQuestion: CustomizableFormQuestion =
                                tempQuestions[index];

                              let updatedQuestion: CustomizableFormQuestion = {
                                ...tempQuestion,
                                displayPosition: parseInt(val),
                              };

                              tempQuestions[index] = {
                                ...updatedQuestion,
                              };
                              tempForm = {
                                ...tempForm,
                                questions: tempQuestions,
                              };

                              setForm(_.cloneDeep(tempForm));
                              reset({ index: -1, form: { ...tempForm } });
                            }}
                          />
                        </Box>
                        <Box className="w-4" />
                        <Box className="w-[200px]">
                          <MyEditableTextField
                            editable={false}
                            editing={editingQuestionNo[index]}
                            setEditing={() => {}}
                            name={`form.questions.${index}.required`}
                            displayName="Required"
                            control={control}
                            errors={errors}
                            rules={
                              submitting
                                ? { required: false }
                                : {
                                    required: true,
                                  }
                            }
                            value={question.required}
                            options={["True", "False"]}
                            submitting={false}
                            clearable={false}
                            customOnChange={(val: string) => {
                              let tempForm = { ...form };
                              let tempQuestions = tempForm.questions;
                              let tempQuestion: CustomizableFormQuestion =
                                tempQuestions[index];

                              let updatedQuestion: CustomizableFormQuestion = {
                                ...tempQuestion,
                                required:
                                  val.toLowerCase() == "true" ? true : false,
                              };

                              tempQuestions[index] = {
                                ...updatedQuestion,
                              };
                              tempForm = {
                                ...tempForm,
                                questions: tempQuestions,
                              };

                              setForm(_.cloneDeep(tempForm));
                              reset({ index: -1, form: { ...tempForm } });
                            }}
                          />
                        </Box>
                      </Box>
                      <Box className="flex flex-row">
                        <Box className="w-[200px]">
                          <MyEditableTextField
                            editable={false}
                            editing={editingQuestionNo[index]}
                            setEditing={() => {}}
                            name={`form.questions.${index}.answerType`}
                            displayName="Answer Type"
                            control={control}
                            errors={errors}
                            rules={
                              submitting
                                ? { required: true }
                                : {
                                    required: true,
                                  }
                            }
                            value={question.answerType}
                            options={[
                              "FREE_TEXT",
                              "YES_NO",
                              "DROPDOWN_LIST_SINGLE_SELECTION",
                              "DROPDOWN_LIST_MULTIPLE_SELECTION",
                              "CHECKBOX",
                            ]}
                            submitting={false}
                            clearable={false}
                            customOnChange={(val: string) => {
                              let tempForm = { ...form };
                              let tempQuestions = tempForm.questions;
                              let tempQuestion: CustomizableFormQuestion =
                                tempQuestions[index];

                              let updatedQuestion: CustomizableFormQuestion = {
                                ...tempQuestion,
                                answerType: val,
                              };

                              tempQuestions[index] = {
                                ...updatedQuestion,
                              };
                              tempForm = {
                                ...tempForm,
                                questions: tempQuestions,
                              };

                              setForm(_.cloneDeep(tempForm));
                              reset({ index: -1, form: { ...tempForm } });
                            }}
                          />
                        </Box>
                        <Box className="w-4" />
                        <Box>
                          {question.answerValues != null &&
                          (question.answerType ==
                            "DROPDOWN_LIST_SINGLE_SELECTION" ||
                            question.answerType ==
                              "DROPDOWN_LIST_MULTIPLE_SELECTION") ? (
                            <>
                              <MyText size="md">Answer Options</MyText>
                              <Box className="flex flex-row">
                                <Box className="flex flex-row overflow-auto break-keep scrollbar-hide h-fit w-[200px] bg-slate-100 rounded-lg">
                                  {question.answerValues.map(
                                    (answerValue: any, ind: number) => {
                                      return (
                                        <Box
                                          key={question.id + " " + ind}
                                          className="pr-2"
                                        >
                                          <Box className="relative p-1">
                                            <Box className="py-1 px-2 bg-slate-200 rounded-md">
                                              <MyText key={ind}>
                                                {answerValue}
                                              </MyText>
                                            </Box>
                                            {editingQuestionNo[index] && (
                                              <Box className="absolute top-[-7px] right-0">
                                                <IconButton
                                                  style={{
                                                    padding: 0,
                                                    margin: 0,
                                                    color: "red",
                                                  }}
                                                  edge="end"
                                                  onClick={() => {
                                                    let tempForm = { ...form };
                                                    let tempQuestions =
                                                      tempForm.questions;
                                                    let tempQuestion =
                                                      tempQuestions[index];
                                                    let tempQuestionValues =
                                                      tempQuestion.answerValues;

                                                    if (
                                                      tempQuestionValues != null
                                                    ) {
                                                      let updatedQuestionValues =
                                                        tempQuestionValues.filter(
                                                          (
                                                            _,
                                                            itemIndex: number
                                                          ) => itemIndex != ind
                                                        );

                                                      tempQuestion = {
                                                        ...tempQuestion,
                                                        answerValues:
                                                          updatedQuestionValues,
                                                      };

                                                      tempQuestions[index] = {
                                                        ...tempQuestion,
                                                      };
                                                      tempForm = {
                                                        ...tempForm,
                                                        questions:
                                                          tempQuestions,
                                                      };

                                                      setForm(
                                                        _.cloneDeep(tempForm)
                                                      );
                                                      reset({
                                                        index: -1,
                                                        form: { ...tempForm },
                                                      });
                                                    }
                                                  }}
                                                >
                                                  <CloseRoundedIcon
                                                    style={{
                                                      height: 12,
                                                      width: 12,
                                                    }}
                                                  />
                                                </IconButton>
                                              </Box>
                                            )}
                                          </Box>
                                        </Box>
                                      );
                                    }
                                  )}
                                </Box>
                                <Box className="w-4" />
                                <Box className="w-[200px] flex flex-row">
                                  {editingQuestionNo[index] && (
                                    <>
                                      <MyRefTextField
                                        ref={addQuestionValueRefs![index]}
                                      />
                                      <Box className="pl-2 w-fit">
                                        <MyTextButton
                                          onClick={() => {
                                            console.log(
                                              addQuestionValueRefs![index]
                                                .current.value
                                            );

                                            if (
                                              addQuestionValueRefs![index]
                                                .current.value == "" ||
                                              addQuestionValueRefs![index]
                                                .current.value == null ||
                                              addQuestionValueRefs![index]
                                                .current.value == undefined
                                            ) {
                                              const tempArr = Array.from(
                                                addQuestionValueErrors!
                                              );
                                              tempArr[index] = true;

                                              setAddQuestionValueErrors(
                                                tempArr
                                              );
                                            } else {
                                              const tempArr = Array.from(
                                                addQuestionValueErrors!
                                              );
                                              tempArr[index] = false;

                                              setAddQuestionValueErrors(
                                                tempArr
                                              );

                                              // add to form and reset data here
                                              // and reset the addQuestionValue[index] value as well

                                              let tempForm = { ...form };
                                              let tempQuestions =
                                                tempForm.questions;
                                              let tempQuestion =
                                                tempQuestions[index];
                                              let tempQuestionValues =
                                                tempQuestion.answerValues;

                                              if (tempQuestionValues != null) {
                                                tempQuestionValues.push(
                                                  addQuestionValueRefs![index]
                                                    .current.value
                                                );

                                                tempQuestion = {
                                                  ...tempQuestion,
                                                  answerValues:
                                                    tempQuestionValues,
                                                };

                                                tempQuestions[index] = {
                                                  ...tempQuestion,
                                                };
                                                tempForm = {
                                                  ...tempForm,
                                                  questions: tempQuestions,
                                                };

                                                setForm(_.cloneDeep(tempForm));
                                                reset({
                                                  index: -1,
                                                  form: { ...tempForm },
                                                });
                                              }

                                              addQuestionValueRefs![
                                                index
                                              ].current.value = "";
                                            }
                                          }}
                                        >
                                          Add option
                                        </MyTextButton>
                                      </Box>
                                    </>
                                  )}
                                </Box>
                              </Box>
                            </>
                          ) : (
                            <></>
                          )}
                        </Box>
                      </Box>
                      <Box className="flex flex-row">
                        <Box className="w-[200px]">
                          <ItemRow
                            title="Created At"
                            value={timestampToDate(question.createdAt)}
                          ></ItemRow>
                        </Box>
                        <Box className="w-4" />
                        {/* <Box className="w-[200px]">
                        <ItemRow
                          title="Updated At"
                          value={timestampToDate(question.updatedAt)}
                        ></ItemRow>
                      </Box> */}
                        {editingQuestionNo[index] && (
                          <Box className="w-fit">
                            <MyBlueButton
                              submitting={submitting![index]}
                              onClick={() => {
                                setValue("index", index);
                                handleSubmit(onSubmit)();
                              }}
                            >
                              Update Question
                            </MyBlueButton>
                          </Box>
                        )}
                      </Box>
                      <div className="w-[650px] pb-6">
                        <Divider />
                      </div>
                    </div>
                  );
                }
              )}
              <Box className="w-fit pb-8 pt-4">
                <MyBlueButton
                  submitting={addingQuestion}
                  onClick={() => {
                    setAddingQuestion(true);
                    const q = [
                      {
                        answerType: "DROPDOWN_LIST_MULTIPLE_SELECTION",
                        answerValues: ["string"],
                        displayPosition: 0,
                        questionName: "string",
                        questionText: "string",
                        required: true,
                      },
                    ];
                    dispatch(
                      addQuestion({ id: form.questionSetId, question: q })
                    ).then((quest: any) => {
                      if (quest.payload) {
                        // update origirnalForm, form, data, all useState lists
                        if (originalForm != null) {
                          let tempOForm: CustomizableForm = { ...originalForm };
                          let tempOQuestions = tempOForm.questions;
                          tempOQuestions!.push(quest.payload);
                          tempOForm = {
                            ...tempOForm,
                            questions: tempOQuestions,
                          };

                          setOriginalForm(_.cloneDeep(tempOForm));
                        }

                        if (form != null) {
                          let tempForm = { ...form };
                          let tempQuestions = tempForm.questions;
                          console.log(
                            "created question return:",
                            quest.payload
                          );
                          tempQuestions.push(quest.payload);
                          tempForm = { ...tempForm, questions: tempQuestions };
                          console.log("index:", getValues("index"));
                          reset({
                            index: getValues("index"),
                            form: { ...tempForm },
                          });

                          setForm(_.cloneDeep(tempForm));
                        }

                        if (editingQuestionNo != null) {
                          let tempEditingQuestionNo = editingQuestionNo;
                          tempEditingQuestionNo.push(false);

                          setEditingQuestionNo(tempEditingQuestionNo);
                        }

                        if (addQuestionValueRefs != null) {
                          let tempAddQuestionValueRefs = addQuestionValueRefs;
                          tempAddQuestionValueRefs.push(React.createRef());
                          setAddQuestionValueRefs(tempAddQuestionValueRefs);
                        }

                        if (submitting != null) {
                          let tempSubmitting = submitting;
                          tempSubmitting.push(false);
                          setSubmitting(tempSubmitting);
                        }

                        if (addQuestionValueErrors != null) {
                          let tempAddQuestionValueErrors =
                            addQuestionValueErrors;
                          tempAddQuestionValueErrors.push(false);
                          setAddQuestionValueErrors(tempAddQuestionValueErrors);
                        }

                        setAddingQuestion(false);
                      }
                    });
                  }}
                >
                  Add new question
                </MyBlueButton>
              </Box>
            </div>
          </>
        )
      )}
    </Suspense>
  );
};

export default FormSettings;
