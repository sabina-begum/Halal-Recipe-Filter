import { createContext, useContext } from "react";

export interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast(): ToastContextType | null {
  return useContext(ToastContext);
}

export { ToastContext };
