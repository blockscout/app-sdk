import TokenIconPlaceholder from "package/assets/icons/token_icon_placeholder.svg";
import styles from "./TokenIcon.module.css";

interface Props {
  src?: string;
}

const TokenIcon = ({ src }: Props) => {
  if (src) {
    return <img className={styles.image} src={src} alt="Token icon" />;
  }

  return (
    <div className={styles.placeholder}>
      <TokenIconPlaceholder />
    </div>
  );
};

export default TokenIcon;
