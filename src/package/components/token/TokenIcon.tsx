import styled from "styled-components";
import TokenIconPlaceholder from "package/assets/icons/token_icon_placeholder.svg";

const Image = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 100%;
`;

const Placeholder = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 8px;
  background-color: #e2e8f0;

  svg {
    width: 20px;
    height: 20px;
  }
`;

interface Props {
  src?: string;
}

const TokenIcon = ({ src }: Props) => {
  if (src) {
    return <Image src={src} alt="Token icon" />;
  }

  return (
    <Placeholder>
      <TokenIconPlaceholder />
    </Placeholder>
  );
};

export default TokenIcon;
