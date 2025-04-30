export interface ToastProps {
  message?: string;
}

export const Toast = ({ message }: ToastProps) => {
  return <div>{message || "I am a toast"}</div>;
};
