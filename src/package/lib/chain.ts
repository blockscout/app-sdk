// SPDX-License-Identifier: LicenseRef-Blockscout

export type CurrencyUnit = "wei" | "gwei" | "ether";

export const defaultCurrencyUnits: Record<CurrencyUnit, string> = {
  wei: "wei",
  gwei: "Gwei",
  ether: "ETH",
};
