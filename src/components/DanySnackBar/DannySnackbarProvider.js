import React from "react";
import { SnackbarProvider } from "notistack";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";
// import { ExportSnackBar, durationTime } from "./ExportSnackBar";

const DannySnackbarProvider = ({ children }) => {
  return (
    <SnackbarProvider
      maxSnack={4}
      anchorOrigin={
        isMobile
          ? { vertical: "bottom", horizontal: "center" }
          : {
              vertical: "top",
              horizontal: "right"
            }
      }
      autoHideDuration={4000}
      disableWindowBlurListener={true}
      // Components={{
      //   export: ExportSnackBar
      // }}
    >
      {children}
    </SnackbarProvider>
  );
};

export default DannySnackbarProvider;
