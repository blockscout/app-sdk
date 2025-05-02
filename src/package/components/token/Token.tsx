import Link from "../link/Link";
import styles from "./Token.module.css";
import TokenIcon from "./TokenIcon";

interface Props {
  hash: string;
  symbol: string;
  icon?: string;
}

const Token = ({ hash, symbol, icon }: Props) => {
  return (
    <Link
      className={styles.root}
      noIcon
      href={`https://eth.blockscout.com/token/${hash}`}
    >
      <TokenIcon src={icon} />
      <span className={styles.symbol}>{symbol}</span>
    </Link>
  );
};

export default Token;
