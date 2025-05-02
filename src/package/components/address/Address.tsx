import styles from "./Address.module.css";
import Link from "../link/Link";
import { truncateAddress } from "package/lib/truncation";
import AddressIcon from "./AddressIcon";
import Tooltip from "../tooltip/Tooltip";

interface Props {
  hash: string;
}

const Address = ({ hash }: Props) => {
  return (
    <Link
      href={`https://eth.blockscout.com/address/${hash}`}
      noIcon
      className={styles.root}
    >
      <AddressIcon hash={hash} />
      <Tooltip content={hash}>
        <span>{truncateAddress(hash)}</span>
      </Tooltip>
    </Link>
  );
};

export default Address;
