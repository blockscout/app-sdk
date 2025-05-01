import { Tooltip as ArkTooltip } from "@ark-ui/react/tooltip";
import style from "./Tooltip.module.css";

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
        <ArkTooltip.Content className={style.content}>
          <ArkTooltip.Arrow>
            <ArkTooltip.ArrowTip />
          </ArkTooltip.Arrow>
          {content}
        </ArkTooltip.Content>
      </ArkTooltip.Positioner>
    </ArkTooltip.Root>
  );
};

export default Tooltip;
