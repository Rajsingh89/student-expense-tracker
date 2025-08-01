export const getCurrencySymbol = (currency: string): string => {
  const symbols: { [key: string]: string } = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    CAD: "$",
    AUD: "$"
  };
  return symbols[currency] || "₹";
};

export const formatCurrency = (amount: number, currency: string): string => {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toFixed(2)}`;
};