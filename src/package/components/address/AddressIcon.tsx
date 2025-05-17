import styled from "styled-components";
import GradientAvatar from "gradient-avatar";

const IconContainer = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
`;

interface Props {
  hash: string;
}

const AddressIcon = ({ hash }: Props) => {
  const svg = GradientAvatar(hash, 20, "circle");
  return <IconContainer dangerouslySetInnerHTML={{ __html: svg }} />;
};

export default AddressIcon;
