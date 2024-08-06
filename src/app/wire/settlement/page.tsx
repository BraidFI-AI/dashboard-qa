"use client";

import Box from "@mui/material/Box";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyText from "@/core/components/Text/Text";
import MyControlledDatePicker from "@/core/components/DateTimePicker/MyControlledDateTimePicker";
import moment, { Moment } from "moment";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect } from "react";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import { useAppDispatch } from "@/redux/store/store";
// import { fetchProductIdsList } from "@/redux/slices/ProductSlice";
import RequireRole from "@/core/components/RequireRole";
import { ADMIN_ROUTE } from "@/core/constants";
import { enqueueSnackbar } from "notistack";
import ErrorPage from "@/core/components/error_page";
import { WireSettlementHistory } from "@/core/api/ApiTypes";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";

import {
  approveWireSettlement,
  downloadWireFile,
  fetchWireSettlementHistory,
  setInitialWireState,
  setWireEndDate,
  setWireProductId,
  setWireProductName,
  setWireStartDate,
} from "@/redux/slices/wire_settlement_slice";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import Tooltip from "@mui/material/Tooltip";
import MyTable from "@/core/components/Table/MyTable";
import { GridCellParams, MuiEvent } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { momentToUTCString } from "@/core/utils/dateTimeUtil";

const WireSettlement = () => {
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [productIdsList, setProductIdsList] = useState<
    "loading" | string | { id: string; name: string }[]
  >("loading");
  const [productId, setProductId] = useState<number | null>(null);

  const wireHistory: "initial" | "loading" | string | WireSettlementHistory[] =
    useSelector((state: any) => state.wireSettlement.wireSettlementHistory);

  const [expandTable, toggleExpandTable] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(true);

  const [approving, setApproving] = useState<string[]>([]);

  const updateApprovingArr = (filename: string, status: boolean) => {
    if (status) {
      const tempArr = [...approving];
      tempArr.push(filename);
      setApproving(tempArr);
    } else {
      const tempArr = [...approving];
      const uArr = tempArr.filter((fname: string) => fname != filename);
      setApproving(uArr);
    }
  };

  useEffect(() => {
    dispatch(setInitialWireState());
  }, [dispatch]);

  // useEffect(() => {
  //   if (refresh) {
  //     dispatch(fetchProductIdsList()).then((data: any) => {
  //       setProductIdsList(data.payload);
  //       if (data.payload?.length > 0) {
  //         setProductId(data.payload[0]?.id);
  //         dispatch(setWireProductId(data.payload[0]?.id));
  //         dispatch(setWireProductName(data.payload[0]?.name));
  //       }
  //     });
  //     setRefresh(false);
  //   }
  // }, [dispatch, wireHistory, refresh]);

  const {
    formState: { errors },
    control,
    handleSubmit,
    getValues,
  } = useForm<{
    productId: number;
    startDate: Moment;
    endDate: Moment;
  }>();
  const onSubmit: SubmitHandler<{
    productId: number;
    startDate: Moment;
    endDate: Moment;
  }> = (data: { productId: number; startDate: Moment; endDate: Moment }) => {
    // if (productId == null) {
    //   enqueueSnackbar("Select a product first", { variant: "error" });
    //   return;
    // }
    // data.productId = productId;
    setSubmitting(true);

    console.log("data:", data);

    dispatch(fetchWireSettlementHistory(data)).then((files: any) => {
      setSubmitting(false);
    });
  };

  return (
    <Box className="flex flex-col h-full">
      {!expandTable && (
        <form onSubmit={handleSubmit(onSubmit)} className="pb-6">
          <Box className="flex flex-row">
            {/* <Box>
              <MyText>Product</MyText>
              {productIdsList == "loading" ? (
                <CircularProgress size="25px" />
              ) : typeof productIdsList == "string" ? (
                <ErrorPage
                  error={productIdsList}
                  recoveryButtonOnClick={() => {
                    dispatch(fetchProductIdsList()).then((data: any) => {
                      setProductIdsList(data.payload);
                      if (data.payload?.length > 0) {
                        setProductId(data.payload[0]?.id);
                        dispatch(setWireProductId(data.payload[0]?.id));
                        dispatch(setWireProductName(data.payload[0]?.name));
                      }
                    });
                  }}
                  recoveryButtonTitle="Retry"
                />
              ) : (
                <MyControlledAutocomplete
                  // clearable={false}
                  value={`${productIdsList[0].id} - ${productIdsList[0].name}`}
                  displayName="Product ID"
                  name={"productId"}
                  control={control}
                  errors={errors}
                  rules={{ required: true }}
                  options={productIdsList?.map((prd) => {
                    return `${prd.id} - ${prd.name}`;
                  })}
                  customOnChange={(val: string) => {
                    const id = val?.split(" - ")[0];
                    const name = val?.split(" - ")[1];
                    if (id) {
                      setProductId(parseInt(id));
                      dispatch(setWireProductId(id));
                      dispatch(setWireProductName(name));
                    }
                  }}
                />
              )}
            </Box>
            <div className="w-4"></div> */}
            <Box>
              <MyText>Start Date</MyText>
              <MyControlledDatePicker
                name="startDate"
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
                      // const now = moment();
                      // dateObject.setHours(0, 0, 0, 0);
                      // today.setHours(0, 0, 0, 0);
                      // if (dateObject > today) {
                      //   return "Date cannot be greater the today's date";
                      // }
                    }
                    return true;
                  },
                }}
                customOnChange={(val: any) => {
                  dispatch(setWireStartDate(momentToUTCString(val, true)));
                }}
                value=""
              ></MyControlledDatePicker>
            </Box>
            <div className="w-4"></div>
            <Box>
              <MyText>End Date</MyText>
              <MyControlledDatePicker
                name="endDate"
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
                      // const now = moment();
                      // // dateObject.setHours(0, 0, 0, 0);
                      // // today.setHours(0, 0, 0, 0);
                      // const startDate = moment(
                      //   getValues("startDate").toString()
                      // )
                      // if (dateObject < startDate && dateObject != startDate) {
                      //   return "End date cannot be before start date";
                      // }
                      // if (dateObject > today) {
                      //   return "Date cannot be greater the today's date";
                      // }
                    }
                    return true;
                  },
                }}
                customOnChange={(val: any) => {
                  dispatch(setWireEndDate(momentToUTCString(val, false)));
                }}
                value=""
              ></MyControlledDatePicker>
            </Box>
          </Box>
          <div className="w-32 pt-4 h-16">
            <MyBlueButton type="submit" submitting={submitting}>
              Get History
            </MyBlueButton>
          </div>
        </form>
      )}
      {wireHistory == "initial" ? (
        <MyText>Please select dates</MyText>
      ) : wireHistory == "loading" ? (
        <MyCircularProgressIndicator />
      ) : typeof wireHistory == "string" ? (
        <ErrorPage
          error={wireHistory}
          recoveryButtonOnClick={() => {
            handleSubmit(onSubmit)();
          }}
          recoveryButtonTitle="Retry"
        />
      ) : wireHistory.length == 0 ? (
        <MyText>No data found matching criteria</MyText>
      ) : (
        <div className="h-full">
          <MyTable
            customId={(row: WireSettlementHistory) => row.filename}
            expand={expandTable}
            toggleExpand={() => {
              toggleExpandTable(expandTable ? false : true);
            }}
            handleRowClick={() => {}}
            handleCellClick={(
              params: GridCellParams,
              event: MuiEvent<React.MouseEvent>
            ) => {
              if (params.field == "status" || params.field == "file") {
                event.stopPropagation();
              }
            }}
            columns={[
              {
                field: "filename",
                headerName: "File Name",
                flex: 1,
                minWidth: 140,
              },
              {
                field: "createdAt",
                headerName: "Created",
                flex: 1,
                minWidth: 120,
                valueFormatter: (params: any) => {
                  return `${moment(params.value * 1000).year()}-${(
                    moment(params.value * 1000).month() + 1
                  )
                    .toString()
                    .padStart(2, "0")}-${moment(params.value * 1000)
                    .date()
                    .toString()
                    .padStart(2, "0")} ${moment(params.value * 1000)
                    .hour()
                    .toString()
                    .padStart(2, "0")}:${moment(params.value * 1000)
                    .minute()
                    .toString()
                    .padStart(2, "0")}`;
                },
                valueGetter: (params: any) => params.row.createdAt,
              },
              {
                field: "updatedAt",
                headerName: "Updated",
                flex: 1,
                minWidth: 120,
                valueFormatter: (params: any) => {
                  return `${moment(params.value * 1000).year()}-${(
                    moment(params.value * 1000).month() + 1
                  )
                    .toString()
                    .padStart(2, "0")}-${moment(params.value * 1000)
                    .date()
                    .toString()
                    .padStart(2, "0")} ${moment(params.value * 1000)
                    .hour()
                    .toString()
                    .padStart(2, "0")}:${moment(params.value * 1000)
                    .minute()
                    .toString()
                    .padStart(2, "0")}`;
                },
                valueGetter: (params: any) => params.row.updatedAt,
              },
              {
                field: "transactionCount",
                headerName: "Transaction Count",
                flex: 1,
                minWidth: 120,
              },
              {
                field: "status",
                headerName: "Status",
                flex: 1,
                minWidth: 120,
                renderCell: (params: any) =>
                  params.row.status == "SUBMITTED" ? (
                    <Tooltip title="Approve Settlement" placement="right">
                      <div className="flex justify-center">
                        <MyBlueButton
                          submitting={approving.includes(params.row.filename)}
                          onClick={() => {
                            if (params != null) {
                              updateApprovingArr(params.row.filename, true);
                              dispatch(
                                approveWireSettlement(params.row.filename)
                              ).then((d: any) => {
                                updateApprovingArr(params.row.filename, false);
                                console.log(d.payload);
                                if (typeof d.payload != "string") {
                                  enqueueSnackbar("Settlement approved", {
                                    variant: "success",
                                  });
                                } else {
                                  enqueueSnackbar(d.payload, {
                                    variant: "error",
                                    persist: true,
                                  });
                                }
                              });
                            }
                          }}
                        >
                          Approve
                        </MyBlueButton>
                      </div>
                    </Tooltip>
                  ) : (
                    <div>
                      {params.row?.status
                        ? params.row?.status?.[0] +
                          params?.row?.status?.slice(1)?.toLowerCase()
                        : "NaN"}
                    </div>
                  ),
              },
              {
                field: "file",
                headerName: "FedWire File",
                flex: 1,
                minWidth: 82,
                renderCell: (params: any) => (
                  <Tooltip
                    title="Download Wire Setllment File"
                    placement="right"
                  >
                    <div className="flex justify-center">
                      <MyBlueButton
                        onClick={() => {
                          if (params != null) {
                            dispatch(
                              downloadWireFile(params.row.filename)
                            ).then((d: any) => {
                              if (!d.payload || d.payload != "downloaded") {
                                enqueueSnackbar(d.payload, {
                                  variant: "error",
                                  persist: true,
                                });
                              }
                            });
                          }
                        }}
                      >
                        <CloudDownloadOutlinedIcon />
                      </MyBlueButton>
                    </div>
                  </Tooltip>
                ),
              },
            ]}
            rows={wireHistory}
            sortModel={[{ field: "createdAt", sort: "desc" }]}
          />
        </div>
      )}
    </Box>
  );
};

export default RequireRole(WireSettlement, ADMIN_ROUTE);
