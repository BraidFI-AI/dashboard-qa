export function toPercentage(num: number | null | undefined) {
  if (!num) {
    return "0.00%";
  }
  return (num * 100).toFixed(2) + "%";
}

export function enumTextToReadableText(text: string) {
  if (text == null) {
    return "";
  }
  return text
    .toLowerCase()
    .replaceAll("_", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
