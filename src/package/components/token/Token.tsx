import styled from "styled-components";
import { APP_CONFIG } from "package/config";
import Link from "../link/Link";
import TokenIcon from "./TokenIcon";

const TokenLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
`;

const Symbol = styled.span`
  font-weight: 600;
`;

interface Props {
  hash: string;
  symbol?: string;
  icon?: string | null;
  explorerUrl: string;
}

const Token = ({ hash, symbol, icon, explorerUrl }: Props) => {
  return (
    <TokenLink href={`${explorerUrl}${APP_CONFIG.URLS.TOKEN(hash)}`}>
      <TokenIcon src={icon || undefined} />
      <Symbol>{symbol || "Unnamed token"}</Symbol>
    </TokenLink>
  );
};

export default Token;
