// SPDX-License-Identifier: LicenseRef-Blockscout

export interface Explorer {
  url: string;
  hostedBy: string;
}

export interface ChainData {
  name: string;
  description: string;
  logo: string;
  ecosystem: string;
  isTestnet: boolean;
  layer: number;
  rollupType: string;
  website: string;
  explorers: Explorer[];
}
