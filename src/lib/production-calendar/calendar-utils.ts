export function parseCalendarMonthParam(monthParam: string | undefined): { year: number; month: number } {
  const today = new Date();
  if (!monthParam || !/^\d{4}-\d{2}$/.test(monthParam)) {
    return { year: today.getFullYear(), month: today.getMonth() + 1 };
  }
  const [y, m] = monthParam.split("-").map(Number);
  if (!y || m < 1 || m > 12) {
    return { year: today.getFullYear(), month: today.getMonth() + 1 };
  }
  return { year: y, month: m };
}

export function monthParamFromParts(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function adjacentMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const d = new Date(year, month - 1 + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}
