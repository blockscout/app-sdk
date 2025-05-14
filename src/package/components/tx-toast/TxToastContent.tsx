import styles from "./TxToastContent.module.css";
import Token from "../token/Token";
import Address from "../address/Address";
import type { Transaction } from "package/api/types/tx";
import type { AddressParam } from "package/api/types/address";

interface TxToastContentProps {
  txData: Transaction;
}

function getAddressHash(addr: string | AddressParam | null): string {
  if (!addr) return "";
  if (typeof addr === "string") return addr;
  if (
    typeof addr === "object" &&
    "hash" in addr &&
    typeof addr.hash === "string"
  )
    return addr.hash;
  return "";
}

const TxToastContent = ({ txData }: TxToastContentProps) => {
  return (
    <div className={styles.root}>
      <div>
        <span className={styles.amount}>{txData.value}</span>
        <span className={styles.token}>
          <Token
            hash={getAddressHash(txData.to)}
            symbol={txData.method || "TOKEN"}
            icon={undefined}
          />
        </span>
      </div>
      <span className={styles.addressLabel}>to address</span>
      <span className={styles.address}>
        <Address hash={getAddressHash(txData.to)} />
      </span>
    </div>
  );
};

export default TxToastContent;
