export default function toDollarFormat(
  amount: number | string | null | undefined
) {
  if (amount == null) {
    return "";
  } else {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    return typeof amount == "string"
      ? formatter.format(parseFloat(amount))
      : formatter.format(amount);
  }
}
