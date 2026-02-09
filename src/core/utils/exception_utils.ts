import { AxiosError } from "axios";

interface Error {
  error: string;
  message: string;
  status: number;
}

interface WireTransactionError {
  accountBalance: any;
  paymentId: string;
  status: string;
  transactionStatus: string;
  transactionProcessingStatus: string;
  message: string;
  error: string;
  counterpartyId: any;
  postDate: any;
}

interface UnprocessableEntityError {
  status: number;
  message: string;
  error: string;
}

function isError(obj: any): obj is Error {
  return (
    typeof obj.error === "string" &&
    typeof obj.message === "string" &&
    typeof obj.status === "number"
  );
}

function isWireTransactionError(obj: any): obj is WireTransactionError {
  return (
    typeof obj.error === "string" &&
    typeof obj.message === "string" &&
    typeof obj.status === "string" &&
    typeof obj.transactionStatus === "string" &&
    typeof obj.transactionProcessingStatus === "string" &&
    obj.paymentId !== undefined
  );
}

function isUnprocessableEntityError(obj: any): obj is UnprocessableEntityError {
  return (
    typeof obj.status === "number" &&
    obj.status === 422 &&
    typeof obj.message === "string" &&
    typeof obj.error === "string"
  );
}

export const generateErrorMessage = (e: AxiosError): string => {
  let errorMessage: string = "";

  if (e.response && e.response.data) {
    if (isUnprocessableEntityError(e.response.data)) {
      errorMessage = (e.response.data as UnprocessableEntityError).error;
    } else if (isError(e.response.data)) {
      if ((e.response.data as Error).status == 404) {
        errorMessage = "Not found";
      } else {
        errorMessage = (e.response.data as Error).error;
      }
    } else if (isWireTransactionError(e.response.data)) {
      errorMessage = (e.response.data as WireTransactionError).error;
    } else {
      errorMessage = e.message;
    }
  } else {
    errorMessage = e.message;
  }
  return errorMessage;
};
