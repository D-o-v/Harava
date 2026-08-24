export function formatMoney(value: unknown, currency?: string, maximumFractionDigits = 2) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";
  if (!currency) return new Intl.NumberFormat(undefined, { maximumFractionDigits }).format(amount);
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits,
  }).format(amount);
}

export function currencyPrefix(currency?: string) {
  return currency ? `${currency} ` : "";
}
