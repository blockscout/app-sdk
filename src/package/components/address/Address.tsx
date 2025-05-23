import styled from "styled-components";
import Link from "../link/Link";
import { truncateAddress } from "package/lib/truncation";
import Tooltip from "../tooltip/Tooltip";
import { APP_CONFIG } from "package/config";

const AddressLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
`;

interface Props {
  hash: string;
  explorerUrl: string;
}

const Address = ({ hash, explorerUrl }: Props) => {
  return (
    <AddressLink href={`${explorerUrl}${APP_CONFIG.URLS.ADDRESS(hash)}`}>
      <Tooltip content={hash}>
        <span>{truncateAddress(hash)}</span>
      </Tooltip>
    </AddressLink>
  );
};

export default Address;
