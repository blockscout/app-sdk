import styled from "styled-components";
import { Tooltip as ArkTooltip } from "@ark-ui/react/tooltip";

const StyledContent = styled(ArkTooltip.Content)`
  --background: #2d3748;
  --color: #fff;
  --arrow-size: 6px;
  --arrow-background: var(--background);

  &[data-scope="tooltip"][data-part="content"] {
    background: var(--background);
    color: var(--color);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
  }
`;

interface Props extends ArkTooltip.RootProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

const Tooltip = ({
  children,
  content,
  openDelay = 100,
  closeDelay = 100,
  ...rest
}: Props) => {
  const positioning = {
    ...rest.positioning,
    overflowPadding: 4,
    offset: {
      mainAxis: 4,
      ...rest.positioning?.offset,
    },
  };

  return (
    <ArkTooltip.Root
      openDelay={openDelay}
      closeDelay={closeDelay}
      {...rest}
      positioning={positioning}
    >
      <ArkTooltip.Trigger asChild>{children}</ArkTooltip.Trigger>
      <ArkTooltip.Positioner>
        <StyledContent>
          <ArkTooltip.Arrow>
            <ArkTooltip.ArrowTip />
          </ArkTooltip.Arrow>
          {content}
        </StyledContent>
      </ArkTooltip.Positioner>
    </ArkTooltip.Root>
  );
};

export default Tooltip;
