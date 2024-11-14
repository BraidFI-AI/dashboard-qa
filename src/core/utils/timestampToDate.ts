import moment from "moment";

export function formatUnixTimestamp(
  timestamp: any,
  ms: boolean = false
): string {
  if (!ms) {
    // timestamp = timestamp * 1000;
  }

  const date = moment(timestamp).utc();

  const year = date.year();
  const month = (date.month() + 1).toString().padStart(2, "0");
  const day = date.date().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function timestampToDate(
  date: number | null,
  ms: boolean = false,
  time: boolean = false
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

    if (time) {
      const hours = strDate.hours();
      const minutes = strDate.minutes();
      const seconds = strDate.seconds();

      ret += ` ${hours}:${minutes}:${seconds}`;
    }
  }

  return ret;
}
