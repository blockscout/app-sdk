import styles from "./Address.module.css";
import Link from "../link/Link";
import { truncateAddress } from "package/lib/truncation";
import AddressIcon from "./AddressIcon";
import Tooltip from "../tooltip/Tooltip";
import { APP_CONFIG } from "package/config";
interface Props {
  hash: string;
  explorerUrl: string;
}

const Address = ({ hash, explorerUrl }: Props) => {
  return (
    <Link
      href={`${explorerUrl}${APP_CONFIG.URLS.ADDRESS(hash)}`}
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
