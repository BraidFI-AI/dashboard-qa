import { enqueueSnackbar } from "notistack";

async function getTextFromFile(file: File, errorString: string) {
  try {
    const text = await file.text();

    return text;
  } catch (error) {
    console.log(errorString, error);
    enqueueSnackbar(`${errorString} ${error}`, {
      variant: "error",
      persist: true,
    });
    console.log(error);
    return null;
  }
}

export { getTextFromFile };
