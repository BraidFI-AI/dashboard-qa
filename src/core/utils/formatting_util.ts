export default function toPercentage(num: number | null | undefined) {
  if (!num) {
    return "0.00%";
  }
  return (num * 100).toFixed(2) + "%";
}
