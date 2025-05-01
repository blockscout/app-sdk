import Age from "../age/Age";
import Link from "../link/Link";
import style from "./TxToastFooter.module.css";

interface Props {
  timestamp: number;
  hash: string;
}

const TxToastFooter = ({ timestamp, hash }: Props) => {
  return (
    <div className={style.root}>
      <Link href={`https://eth.blockscout.com/tx/${hash}`} external>
        View on block explorer
      </Link>
      <Age timestamp={timestamp} />
    </div>
  );
};

export default TxToastFooter;
