import styles from "./TxToastContent.module.css";
import Token from "../token/Token";
import Address from "../address/Address";

const TxToastContent = () => {
  return (
    <div className={styles.root}>
      <span>Send 120</span>
      <Token
        hash="0xdAC17F958D2ee523a2206206994597C13D831ec7"
        symbol="USDT"
        icon="https://assets.coingecko.com/coins/images/325/small/Tether.png?1696501661"
      />
      <span>to address</span>
      <Address hash="0xa8FCe579a11E551635b9c9CB915BEcd873C51254" />
    </div>
  );
};

export default TxToastContent;
