import { Moment } from "moment";

const momentToUTCString = (date: Moment, start: boolean, addOne?: boolean) => {
  const month: string =
    date.month() + 1 > 9
      ? (date.month() + 1).toString()
      : `0${date.month() + 1}`;

  let addition = addOne != null && addOne == true ? 1 : 0;

  const day: string =
    date.date() + addition > 9
      ? (date.date() + addition).toString()
      : `0${date.date() + addition}`;

  const time: string = start ? "T00:00:00.000Z" : "T23:59:59.000Z";

  const utc = date.year().toString() + "-" + month + "-" + day + time;

  return utc;
};

export { momentToUTCString };
