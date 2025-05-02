import GradientAvatar from "gradient-avatar";
import style from "./AddressIcon.module.css";

interface Props {
  hash: string;
}

const AddressIcon = ({ hash }: Props) => {
  const svg = GradientAvatar(hash, 20, "circle");
  return (
    <div className={style.root} dangerouslySetInnerHTML={{ __html: svg }} />
  );
};

export default AddressIcon;
