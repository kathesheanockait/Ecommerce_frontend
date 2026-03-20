import { useState, type ReactNode } from "react";
import { SnackbarContext, type SnackbarType } from "./SnackbarContext";

import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import ErrorRounded from "@mui/icons-material/ErrorRounded";
import WarningRounded from "@mui/icons-material/WarningRounded";
import InfoRounded from "@mui/icons-material/InfoRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";

const config: Record<
  SnackbarType,
  { icon: React.ElementType; bg: string; border: string; iconColor: string; progress: string; label: string }
> = {
  success: {
    icon: CheckCircleRounded,
    bg: "linear-gradient(135deg, #0d2e1f 0%, #0a2418 100%)",
    border: "#00e676",
    iconColor: "#00e676",
    progress: "linear-gradient(90deg, #00e676, #69f0ae)",
    label: "Success",
  },
  error: {
    icon: ErrorRounded,
    bg: "linear-gradient(135deg, #2e0d0d 0%, #240a0a 100%)",
    border: "#ff1744",
    iconColor: "#ff1744",
    progress: "linear-gradient(90deg, #ff1744, #ff6b6b)",
    label: "Error",
  },
  warning: {
    icon: WarningRounded,
    bg: "linear-gradient(135deg, #2e1f0d 0%, #24190a 100%)",
    border: "#ff9100",
    iconColor: "#ff9100",
    progress: "linear-gradient(90deg, #ff9100, #ffd740)",
    label: "Warning",
  },
  info: {
    icon: InfoRounded,
    bg: "linear-gradient(135deg, #0d1a2e 0%, #0a1424 100%)",
    border: "#2979ff",
    iconColor: "#2979ff",
    progress: "linear-gradient(90deg, #2979ff, #40c4ff)",
    label: "Info",
  },
};

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<SnackbarType>("success");

  const showSnackbar = (msg: string, snackType: SnackbarType = "success") => {
    setOpen(false);
    setTimeout(() => {
      setMessage(msg);
      setType(snackType);
      setOpen(true);
    }, 100);
  };

  const c = config[type];
  const Icon = c.icon;

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ top: "24px !important", right: "24px !important" }}
      >
        <Box
          sx={{
            minWidth: 320,
            maxWidth: 420,
            background: c.bg,
            border: `1px solid ${c.border}`,
            borderLeft: `4px solid ${c.border}`,
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${c.border}22`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, p: "14px 16px 10px" }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: `${c.iconColor}18`,
                border: `1px solid ${c.iconColor}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon sx={{ color: c.iconColor, fontSize: 20 }} />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: c.iconColor, fontSize: "11px", fontWeight: 700 }}>
                {c.label}
              </Typography>
              <Typography sx={{ color: "#e8e8f0", fontSize: "14px" }}>
                {message}
              </Typography>
            </Box>

            <IconButton onClick={() => setOpen(false)} size="small">
              <CloseRounded sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};