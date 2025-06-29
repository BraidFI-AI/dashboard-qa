import moment, { Moment } from "moment";

const momentToTimeZoneString = (date: Moment, start: boolean) => {
  if (start) {
    const startOfDay = date
      .startOf("day")
      .format("YYYY-MM-DDTHH:mm:ss.SSSSSSZ");
    return startOfDay;
  } else {
    const endOfDay = date.endOf("day").format("YYYY-MM-DDTHH:mm:ss.SSSSSSZ");
    return endOfDay;
  }
};

const momentToUTCString = (date: Moment, start: boolean) => {
  if (start) {
    const startOfDay = date.startOf("day").format("YYYY-MM-DDTHH:mm:ss.SSSSSS");
    return startOfDay + "Z";
  } else {
    const endOfDay = date.endOf("day").format("YYYY-MM-DDTHH:mm:ss.SSSSSS");
    return endOfDay + "Z";
  }
};

const formatUnixTimestamp = (timestamp: any, ms: boolean = false): string => {
  if (!ms) {
    timestamp = timestamp * 1000;
  }

  const date = moment(timestamp).utc();

  const year = date.year();
  const month = (date.month() + 1).toString().padStart(2, "0");
  const day = date.date().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const timestampToDate = (
  date: number | null | undefined,
  ms: boolean = false,
  time: boolean = false,
  format: string = "YYYY-MM-DD"
): string => {
  // Handle null/undefined/NaN values
  if (date == null || isNaN(date)) {
    return "-";
  }

  try {
    // Convert to milliseconds if needed
    const timestamp = ms ? date : date * 1000;

    // Validate timestamp is reasonable (not too far in past/future)
    const now = Date.now();
    const minTimestamp = now - 100 * 365 * 24 * 60 * 60 * 1000; // 100 years ago
    const maxTimestamp = now + 10 * 365 * 24 * 60 * 60 * 1000; // 10 years in future

    if (timestamp < minTimestamp || timestamp > maxTimestamp) {
      console.warn(`Invalid timestamp: ${timestamp}`);
      return "-";
    }

    const momentDate = moment(timestamp);

    // Check if moment date is valid
    if (!momentDate.isValid()) {
      console.warn(`Invalid date from timestamp: ${timestamp}`);
      return "-";
    }

    // Use moment's format method for consistent formatting
    if (time) {
      return momentDate.format("YYYY-MM-DD HH:mm:ss");
    }

    return momentDate.format(format);
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "-";
  }
};

export {
  momentToTimeZoneString,
  formatUnixTimestamp,
  timestampToDate,
  momentToUTCString,
};
