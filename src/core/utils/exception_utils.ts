import { AxiosError } from "axios";

interface Error {
  error: string;
  message: string;
  status: number;
}

function isError(obj: any): obj is Error {
  return (
    typeof obj.error === "string" &&
    typeof obj.message === "string" &&
    typeof obj.status === "number"
  );
}

export const generateErrorMessage = (e: AxiosError): string => {
  let errorMessage: string = "";

  if (e.response && isError(e.response.data)) {
    if ((e.response.data as Error).status == 404) {
      errorMessage = "Not found";
    } else {
      errorMessage = (e.response.data as Error).error;
    }
  } else {
    errorMessage = e.message;
  }
  return errorMessage;
};
