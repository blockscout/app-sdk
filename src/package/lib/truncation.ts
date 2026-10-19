// SPDX-License-Identifier: LicenseRef-Blockscout

export const truncateAddress = (address: string) => {
  return address.slice(0, 4) + "..." + address.slice(-4);
};
