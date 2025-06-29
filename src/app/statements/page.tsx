"use client";

import { Product, Program, Statement } from "@/core/api/ApiTypes";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import MyControlledDatePicker from "@/core/components/DateTimePicker/MyControlledDateTimePicker";
import { v4 as uuidv4 } from "uuid";

import ErrorPage from "@/core/components/error_page";
import MyTable from "@/core/components/Table/MyTable";
import ItemRowHorizontal from "@/core/components/Text/ItemRowHorizontal";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import { fetchProductIdsList } from "@/redux/slices/ProductSlice";
import { fetchProgramIdsListWithNames } from "@/redux/slices/ProgramSlice";
import {
  fetchAccountStatement,
  fetchProductStatement,
  fetchProgramStatement,
  fetchRootStatement,
} from "@/redux/slices/statement_slice";
import { useAppDispatch } from "@/redux/store/store";
import moment from "moment";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import { ADMIN_OPS_ROLE, ADMIN_ROLE, StatementType } from "@/core/constants";
import toDollarFormat from "@/core/utils/toDollarFormat";
import { useSelector } from "react-redux";

const StatementsPage = () => {
  const dispatch = useAppDispatch();

  const userType = useSelector((state: any) => state.app.userType);

  const [submitting, setSubmitting] = useState(false);
  const [statementType, setStatementType] = useState(StatementType.root);

  const [statement, setStatement] = useState<
    "initial" | "loading" | string | Statement
  >("initial");

  const [productId, setProductId] = useState<string | null>(null);
  const [productIds, setProductIds] = useState<
    "loading" | string | { id: string; name: string }[]
  >("loading");

  const [programId, setProgramId] = useState<string | null>(null);
  const [programIds, setProgramIds] = useState<
    "loading" | string | { id: string; name: string }[]
  >("loading");

  const [accountId, setAccountId] = useState<string | null>(null);

  const [statementTypes, setStatementTypes] = useState<StatementType[]>([]);

  useEffect(() => {
    dispatch(fetchProgramIdsListWithNames()).then((programs: any) => {
      setProgramIds(programs.payload);
      if (typeof programs.payload != "string") {
        setProgramId(programs.payload?.[0]?.id ?? null);
      }
    });

    dispatch(fetchProductIdsList()).then((products: any) => {
      setProductIds(products.payload);
      if (typeof products.payload != "string") {
        setProductId(products.payload?.[0]?.id ?? null);
      }
    });
  }, [dispatch]);

  const {
    formState: { errors },
    getValues,
    control,
    setValue,
    handleSubmit,
  } = useForm<{ type: string; start: string; end: string }>({
    defaultValues: {
      type: statementType,
      start: "",
      end: "",
    },
  });
  const onSubmit: SubmitHandler<{
    type: string;
    start: string;
    end: string;
  }> = (data: { type: string; start: string; end: string }) => {
    console.log("data:", data);

    setStatement("loading");

    if (data.type == StatementType.root) {
      dispatch(fetchRootStatement({ start: data.start, end: data.end })).then(
        (statement: any) => {
          setStatement(statement.payload);
        }
      );
    } else if (data.type == StatementType.program) {
      if (programId == null) {
        enqueueSnackbar("Program ID is required", { variant: "error" });
        return;
      }
      dispatch(
        fetchProgramStatement({
          start: data.start,
          end: data.end,
          programId: programId,
        })
      ).then((statement: any) => {
        setStatement(statement.payload);
      });
    } else if (data.type == StatementType.product) {
      if (productId == null) {
        enqueueSnackbar("Product ID is required", { variant: "error" });
        return;
      }
      dispatch(
        fetchProductStatement({
          start: data.start,
          end: data.end,
          productId: productId,
        })
      ).then((statement: any) => {
        setStatement(statement.payload);
      });
    } else if (data.type == StatementType.accountNumber) {
      if (accountId == null) {
        enqueueSnackbar("Account ID is required", { variant: "error" });
        return;
      }
      dispatch(
        fetchAccountStatement({
          start: data.start,
          end: data.end,
          accountId: accountId,
        })
      ).then((statement: any) => {
        setStatement(statement.payload.statement);
      });
    } else {
      enqueueSnackbar("Invalid statement type", { variant: "error" });
    }
  };

  useEffect(() => {
    if (userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE) {
      setStatementTypes([
        StatementType.root,
        StatementType.program,
        StatementType.product,
        StatementType.accountNumber,
      ]);
    } else {
      setStatementTypes([StatementType.product, StatementType.accountNumber]);
      setValue("type", StatementType.product);
      setStatementType(StatementType.product);
    }
  }, [userType, setValue]);

  return (
    <div>
      <div className="flex flex-row pb-4">
        <div className="w-[300px] pr-2">
          <MyText>Statement Type</MyText>
          <MyControlledAutocomplete
            name="type"
            displayName="Statement Type"
            control={control}
            clearable={false}
            errors={errors}
            rules={
              submitting
                ? { required: false }
                : {
                    required: true,
                  }
            }
            value={getValues("type")}
            customOnChange={(val: any) => {
              setStatementType(val);
            }}
            options={statementTypes.map((type) => {
              return type;
            })}
          />
        </div>
        {statementType == StatementType.program && (
          <div className="w-[300px]">
            <MyText>{statementType}</MyText>
            {programIds == "loading" ? (
              <MyCircularProgressIndicator />
            ) : typeof programIds == "string" ? (
              <ErrorPage
                error={programIds}
                recoveryButtonOnClick={() => {
                  dispatch(fetchProgramIdsListWithNames()).then(
                    (programs: any) => {
                      setProgramIds(programs.payload);
                      if (typeof programs.payload != "string") {
                        setProgramId(programs.payload?.[0]?.id ?? null);
                      }
                    }
                  );
                }}
                recoveryButtonTitle="Retry"
              />
            ) : (
              <MyControlledAutocomplete
                name="programId"
                displayName="Program"
                control={control}
                clearable={false}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                customOnChange={(val: any) => {
                  const id = val?.split(" - ")[0];
                  if (id) {
                    setProgramId(id);
                  }
                }}
                value={`${programIds?.[0]?.id} - ${programIds?.[0]?.name}`}
                options={programIds.map((prg) => {
                  return `${prg.id} - ${prg.name}`;
                })}
              />
            )}
          </div>
        )}
        {statementType == StatementType.product && (
          <div className="w-[300px]">
            <MyText>{statementType}</MyText>
            {productIds == "loading" ? (
              <MyCircularProgressIndicator />
            ) : typeof productIds == "string" ? (
              <ErrorPage
                error={productIds}
                recoveryButtonOnClick={() => {
                  dispatch(fetchProductIdsList()).then((products: any) => {
                    setProductIds(products.payload);
                    if (typeof products.payload != "string") {
                      setProductId(products.payload?.[0]?.id ?? null);
                    }
                  });
                }}
                recoveryButtonTitle="Retry"
              />
            ) : (
              <MyControlledAutocomplete
                name="productId"
                displayName="Product"
                control={control}
                errors={errors}
                clearable={false}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                customOnChange={(val: any) => {
                  const id = val?.split(" - ")[0];
                  if (id) {
                    setProductId(id);
                  }
                }}
                value={`${productIds?.[0]?.id} - ${productIds?.[0]?.name}`}
                options={productIds.map((prg) => {
                  return `${prg.id} - ${prg.name}`;
                })}
              />
            )}
          </div>
        )}
        {statementType == StatementType.accountNumber && (
          <div className="w-[300px]">
            <MyText>{statementType}</MyText>
            <MyControlledTextField
              name="accountNumber"
              displayName="Account Number"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: true,
                    }
              }
              customOnChange={(val: any) => {
                setAccountId(val);
              }}
              value=""
            />
          </div>
        )}
      </div>
      <div className="flex flex-row items-center pb-4">
        <div className="pr-2">
          <MyText size="sm">Start Date</MyText>
          <MyControlledDatePicker
            name="start"
            displayName="Start Date"
            control={control}
            errors={errors}
            rules={{
              required: true,
              validate: (value: any) => {
                const dateObject = moment(value.toString());
                if (dateObject.toString() === "Invalid Date") {
                  return "Invalid Date";
                } else {
                }
                return true;
              },
            }}
            value={""}
          />
        </div>
        {/* <div className="pr-2">
          <MyText size="sm">Start Time</MyText>
          <MyControlledTimePicker
            name="startTime"
            displayName="Start Time"
            control={control}
            errors={errors}
            rules={{
              required: true,
              validate: (value: any) => {
                const timeObject = moment(value.toString());
                if (timeObject.toString() === "Invalid date") {
                  return "Invalid Time";
                }
                return true;
              },
            }}
            value={"00:00"}
          />
        </div> */}
        <div className="pr-6">
          <div className="invisible">
            <MyText size="sm">{moment().format("z")}</MyText>
          </div>
          <MyText size="sm">{moment().format("z")}</MyText>
        </div>
        <div className="pr-2">
          <MyText size="sm">End Date</MyText>
          <MyControlledDatePicker
            name="end"
            displayName="End Date"
            control={control}
            errors={errors}
            rules={{
              required: true,
              validate: (value: any) => {
                const dateObject = moment(value.toString());
                if (dateObject.toString() === "Invalid Date") {
                  return "Invalid Date";
                } else {
                  const startDate = moment(getValues("start").toString());
                  if (dateObject < startDate && dateObject != startDate) {
                    return "End date cannot be before start date";
                  }
                }
                return true;
              },
            }}
            value={""}
          />
        </div>
        {/* <div className="pr-2">
          <MyText size="sm">End Time</MyText>
          <MyControlledTimePicker
            name="endTime"
            displayName="End Time"
            control={control}
            errors={errors}
            rules={{
              required: true,
              validate: (value: any) => {
                const timeObject = moment(value.toString());
                if (timeObject.toString() === "Invalid date") {
                  return "Invalid Time";
                }
                return true;
              },
            }}
            value={""}
          />
        </div> */}
        <div>
          <div className="invisible">
            <MyText size="sm">{moment().format("z")}</MyText>
          </div>
          <MyText size="sm">{moment().format("z")}</MyText>
        </div>
      </div>
      <div className="w-fit">
        <MyBlueButton
          submitting={submitting}
          onClick={() => {
            handleSubmit(onSubmit)();
          }}
        >
          Get Statement
        </MyBlueButton>
      </div>
      {statement == "loading" ? (
        <MyCircularProgressIndicator />
      ) : statement == "initial" ? (
        <></>
      ) : typeof statement == "string" ? (
        <ErrorPage
          error={statement}
          recoveryButtonOnClick={() => {
            setStatement("initial");
          }}
          recoveryButtonTitle="Retry"
        />
      ) : (
        <>
          <div className="mt-4">
            <MyText size="lg">{`${statementType} Statement`}</MyText>
          </div>
          <div className="mt-4 flex flex-row w-[900px]">
            <ItemRowHorizontal
              title="Account"
              value={statement.accountName ?? ""}
            />
            <div className="pr-2" />
            <ItemRowHorizontal
              title="Product ID"
              value={statement.productId ?? ""}
            />
            <div className="pr-2" />
            <ItemRowHorizontal
              title="Program ID"
              value={statement.programId ?? ""}
            />
          </div>
          <div className="mt-4 flex flex-row w-[500px]">
            <ItemRowHorizontal
              title="Starting"
              value={statement.starting?.replace("T", " ") ?? ""}
            />
            <div className="pr-2" />
            <ItemRowHorizontal
              title="Ending"
              value={statement.ending?.replace("T", " ") ?? ""}
            />
          </div>
          <div className="mt-4 flex flex-row w-[500px]">
            <ItemRowHorizontal
              title="Starting Balance"
              value={toDollarFormat(statement.startingBalance?.toString() ?? 0)}
            />
            <div className="pr-2" />
            <ItemRowHorizontal
              title="Ending Balance"
              value={toDollarFormat(statement.endingBalance?.toString() ?? 0)}
            />
          </div>
          <div className="mt-4" />
          <div style={{ height: "calc(100vh - 470px)" }}>
            <MyTable
              handleRowClick={() => {}}
              customId={(row: any) => uuidv4()}
              columns={[
                {
                  field: "type",
                  headerName: "Transaction Type",
                  flex: 2,
                  minWidth: 220,
                },
                {
                  field: "polarity",
                  headerName: "Direction",
                  flex: 1,
                  minWidth: 120,
                },
                {
                  field: "amount",
                  headerName: "Amount",
                  flex: 1,
                  minWidth: 120,
                  align: "right",
                  display: "flex",
                  renderCell: (params: any) => (
                    <div>{toDollarFormat(params.row.amount)}</div>
                  ),
                  valueGetter: (value: any, row: any) => row.amount,
                },
                {
                  field: "count",
                  headerName: "Count",
                  flex: 1,
                  minWidth: 120,
                },
              ]}
              rows={statement.transactionSummary}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default StatementsPage;
