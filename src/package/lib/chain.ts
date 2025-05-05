export type CurrencyUnit = "wei" | "gwei" | "ether";

// FIXME: support custom currency symbol
export const currencyUnits: Record<CurrencyUnit, string> = {
  wei: "wei",
  gwei: "Gwei",
  ether: "ETH",
};
