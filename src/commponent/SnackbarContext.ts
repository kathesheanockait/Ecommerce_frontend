import { createContext } from "react";

export type SnackbarType = "success" | "error" | "warning" | "info";

export interface SnackbarContextType {
  showSnackbar: (message: string, type?: SnackbarType) => void;
}

export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);