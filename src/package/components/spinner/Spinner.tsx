import styles from "./Spinner.module.css";

interface SpinnerProps {
  size?: number;
}

const Spinner = ({ size }: SpinnerProps) => {
  return (
    <div
      className={styles.root}
      style={
        size
          ? ({ "--spinner-size": `${size}px` } as React.CSSProperties)
          : undefined
      }
    />
  );
};

export default Spinner;
