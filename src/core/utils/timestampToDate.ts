import moment from "moment";

export default function timestampToDate(
  date: number | null,
  ms: boolean = false
): string {
  let ret: string = "-";
  if (date) {
    if (!ms) {
      date = date * 1000;
    }

    const strDate = moment(date);

    const day = strDate.date();
    const month = strDate.month() + 1;
    const year = strDate.year();

    ret = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
  }

  return ret;
}
