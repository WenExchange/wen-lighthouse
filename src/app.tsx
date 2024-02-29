import React, { useEffect } from "react";
import { RecoilRoot } from "recoil";
import DannyOnboardProvider from "./web3/wallet/DannyOnboardProvider";
import DannySnackbarProvider from "./components/DanySnackBar/DannySnackbarProvider";

import config from "./config.json";
import Home from "./home";
import { Toaster } from "react-hot-toast";
import { color } from "styles/theme";
import { Hex2Rgba } from "utils/helpers";

const App = () => {
  useEffect(() => {
    document.title = config.name;
  }, []);

  return (
    <RecoilRoot>
      <DannyOnboardProvider>
        <DannySnackbarProvider>
          <Home />
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              style: {
                border: "1px solid " + color.black,
                color: color.white,
                background: Hex2Rgba(color.black, 0.95)
              }
            }}
          />
        </DannySnackbarProvider>
      </DannyOnboardProvider>
    </RecoilRoot>
  );
};

export default App;
