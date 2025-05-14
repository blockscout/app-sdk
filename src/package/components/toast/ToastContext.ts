import { createContext } from "react";

type ToastStatus = "success" | "error" | "pending";

export type ToastOptions = {
  title: string;
  content: React.ReactNode;
  status: ToastStatus;
  onClose?: () => void;
};

export type ToastContextType = {
  open: (options: ToastOptions) => string;
  close: (id: string) => void;
  update: (id: string, options: Partial<ToastOptions>) => void;
};

export const ToastContext = createContext<ToastContextType | null>(null);
