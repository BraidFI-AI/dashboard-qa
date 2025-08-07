export function replaceEmptyStringsWithNull(obj: any) {
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value === "") {
        result[key] = null;
      } else if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        result[key] = replaceEmptyStringsWithNull(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
  return obj;
}

export function cleanObject(obj: any) {
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    const cleaned: any = {};

    for (const [key, value] of Object.entries(obj)) {
      if (value === "") {
        cleaned[key] = null;
      } else if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        const nested = cleanObject(value);
        cleaned[key] = nested;
      } else {
        cleaned[key] = value;
      }
    }

    // Re-check values after processing sub-objects
    const allNull = Object.values(cleaned).every((v) => v === null);
    return allNull ? null : cleaned;
  }

  // Leave arrays and primitives untouched
  return obj;
}
