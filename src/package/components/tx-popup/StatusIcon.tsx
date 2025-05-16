import IconSuccess from "package/assets/icons/success.svg";
import IconError from "package/assets/icons/status_error.svg";
import IconArrowDown from "package/assets/icons/arrow_down.svg";
import IconArrowNE from "package/assets/icons/arrow_n_e.svg";
import Spinner from "../spinner/Spinner";
import { Transaction } from "package/api/types/tx";

interface StatusIconProps {
  status: "pending" | "success" | "error";
  tx: Transaction;
  searchAddress?: string;
}

const StatusIcon = ({ status, tx, searchAddress }: StatusIconProps) => {
  if (status === "pending") {
    return <Spinner size={20} />;
  }

  if (status === "error") {
    // @ts-expect-error SVG component props not properly typed
    return <IconError width={20} height={20} />;
  }

  if (status === "success" && searchAddress) {
    const isTransfer =
      tx.transaction_types?.includes("coin_transfer") ||
      tx.transaction_types?.includes("token_transfer");
    if (isTransfer) {
      if (tx.to?.hash === searchAddress) {
        // @ts-expect-error SVG component props not properly typed
        return <IconArrowDown width={16} height={16} />;
      }
      if (tx.from?.hash === searchAddress) {
        // @ts-expect-error SVG component props not properly typed
        return <IconArrowNE width={20} height={20} />;
      }
    }
  }

  // @ts-expect-error SVG component props not properly typed
  return <IconSuccess width={20} height={20} />;
};

export default StatusIcon;
