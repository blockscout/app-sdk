import styled from "styled-components";
import { APP_CONFIG } from "package/config";
import Age from "../age/Age";
import Link from "../link/Link";

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  margin-top: 12px;
`;

const Timestamp = styled.span`
  color: #b0b7c3;
  font-size: 13px;
`;

const ExplorerLogo = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 4px;
`;

interface Props {
  timestamp: string | null;
  hash: string;
  explorerLogo?: string;
  cleanExplorerUrl: string;
}

const TxToastFooter = ({
  timestamp,
  hash,
  explorerLogo,
  cleanExplorerUrl,
}: Props) => {
  return (
    <Root>
      <Link href={`${cleanExplorerUrl}${APP_CONFIG.URLS.TRANSACTION(hash)}`}>
        {explorerLogo && (
          <ExplorerLogo src={explorerLogo} alt="Explorer logo" />
        )}
        View on block explorer
      </Link>
      {timestamp && (
        <Timestamp>
          <Age timestamp={timestamp} />
        </Timestamp>
      )}
    </Root>
  );
};

export default TxToastFooter;
