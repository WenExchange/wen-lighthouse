import React from "react";
import { enqueueSnackbar } from "notistack";

export default function useDannySnackbar() {
  const showSuccess = (text) => {
    enqueueSnackbar(text, {
      variant: "success"
    });
  };

  const showFail = (text) => {
    enqueueSnackbar(text, {
      variant: "error"
    });
  };

  const showInfo = (text) => {
    enqueueSnackbar(text, {
      variant: "info"
    });
  };
  const showWarning = (text) => {
    enqueueSnackbar(text, {
      variant: "warning"
    });
  };

  return { showSuccess, showFail, showInfo, showWarning };
}
