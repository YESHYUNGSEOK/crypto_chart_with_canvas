export function matchDecimal(matchTo: number, target: number) {
  const firstDecimalLength = (matchTo.toString().split(".")[1] || "").length;
  return Number(target.toFixed(firstDecimalLength));
}
