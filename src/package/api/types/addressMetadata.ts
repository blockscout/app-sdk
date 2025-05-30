export type AddressMetadataTagType =
  | "name"
  | "generic"
  | "classifier"
  | "information"
  | "note"
  | "protocol";

// Response model from Metadata microservice API
export interface AddressMetadataTag {
  slug: string;
  name: string;
  tagType: AddressMetadataTagType;
  ordinal: number;
  meta: string | null;
}

// Response model from Blockscout API with parsed meta field
export interface AddressMetadataTagApi
  extends Omit<AddressMetadataTag, "meta"> {
  meta: {
    textColor?: string;
    bgColor?: string;
    tagIcon?: string;
    tagUrl?: string;
    tooltipIcon?: string;
    tooltipTitle?: string;
    tooltipDescription?: string;
    tooltipUrl?: string;
    appID?: string;
    appMarketplaceURL?: string;
    appLogoURL?: string;
    appActionButtonText?: string;
    warpcastHandle?: string;
    data?: string;
    alertBgColor?: string;
    alertTextColor?: string;
    alertStatus?: string;
  } | null;
}
