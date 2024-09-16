import { Moment } from "moment";

const momentToPSTString = (date: Moment, start: boolean) => {
  if (start) {
    const startOfDay =
      date.startOf("day").format("YYYY-MM-DDTHH:mm:ss.SSSSSS") + "-08:00";
    return startOfDay;
  } else {
    const endOfDay =
      date.endOf("day").format("YYYY-MM-DDTHH:mm:ss.SSSSSS") + "-08:00";
    return endOfDay;
  }
};

export { momentToPSTString };
