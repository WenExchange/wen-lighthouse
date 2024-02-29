import React, { useContext } from "react";
import { Web3OnboardProvider, init } from "@web3-onboard/react";
import injectedModule, { ProviderLabel } from "@web3-onboard/injected-wallets";
import coinbaseWalletModule from "@web3-onboard/coinbase";
import metamaskSDK from "@web3-onboard/metamask";
import walletConnectModule from "@web3-onboard/walletconnect";
import DannyWalletConnector from "./DannyWalletConnector";
import ledgerModule from "@web3-onboard/ledger";
import trezorModule from "@web3-onboard/trezor";
import walletLinkModule from "@web3-onboard/walletlink";
import dcentModule from "@web3-onboard/dcent";
import bitgetWalletModule from "@web3-onboard/bitget";
import phantomModule from "@web3-onboard/phantom";

// import Connector from "./Connector";

import CONSTANTS, { isProduction } from "../../utils/constants";
import { CHAINS, ONBOARD_RESOURCES } from "../constants";

const DannyOnboardProvider = ({ children }) => {
  const injected = injectedModule({
    filter: {
      // allow only on non android mobile
      // [ProviderLabel.Detected]: ["desktop"]
    },
    // displayUnavailable: true,
    sort: (wallets) => {
      const metaMask = wallets.find(
        ({ label }) => label === ProviderLabel.MetaMask
      );
      const coinbase = wallets.find(
        ({ label }) => label === ProviderLabel.Coinbase
      );
      return (
        [
          metaMask,
          coinbase,
          ...wallets.filter(
            ({ label }) =>
              label !== ProviderLabel.MetaMask &&
              label !== ProviderLabel.Coinbase
          )
        ]
          // remove undefined values
          .filter((wallet) => wallet)
      );
    }
  });

  const wcInitOptions = {
    /**
     * Project ID associated with [WalletConnect account](https://cloud.walletconnect.com)
     */
    projectId: "06d9c0a402065cf845d0b03a81c908ae",
    /**
     * Chains required to be supported by all wallets connecting to your DApp
     */
    requiredChains: [1],
    /**
     * Chains required to be supported by all wallets connecting to your DApp
     */
    optionalChains: [168587773],
    /**
     * Defaults to `appMetadata.explore` that is supplied to the web3-onboard init
     * Strongly recommended to provide atleast one URL as it is required by some wallets (i.e. MetaMask)
     * To connect with WalletConnect
     */
    dappUrl: "https://wen.exchange"
  };

  const ledger = ledgerModule({
    /**
     * Project ID associated with [WalletConnect account](https://cloud.walletconnect.com)
     */
    projectId: "06d9c0a402065cf845d0b03a81c908ae",
    /**
     * Chains required to be supported by all wallets connecting to your DApp
     */
    requiredChains: [1],
    optionalChains: [168587773]
  });
  const trezor = trezorModule({
    email: "wenexchange0@gmail.com",
    appUrl: CONSTANTS.URL.APP
  });

  const walletLink = walletLinkModule({ darkMode: true });
  const dcent = dcentModule();
  const bitgetWallet = bitgetWalletModule();
  const phantom = phantomModule();

  const walletConnect = walletConnectModule(wcInitOptions);

  const coinbaseWalletSdk = coinbaseWalletModule({ darkMode: true });
  // const walletConnect = walletConnectModule({
  //   qrcodeModalOptions: {
  //     mobileLinks: ["coinbase", "metamask"]
  //   },
  //   connectFirstChainId: true
  // });
  const metamaskSDKWallet = metamaskSDK({
    options: {
      extensionOnly: false,
      dappMetadata: {
        name: "Wen Exchange"
      }
    }
  });
  const wallets = [
    injected,
    metamaskSDKWallet,
    coinbaseWalletSdk,
    // walletConnect
    ledger,
    trezor,
    walletLink,
    dcent,
    bitgetWallet,
    phantom
  ];

  const chains = [CHAINS[isProduction ? "ETHEREUM" : "SEPOLIA"]];
  // const chains = [CHAINS["ETHEREUM"]];

  const appMetadata = {
    name: "Wen Exchange",
    icon: ONBOARD_RESOURCES.ICON,
    logo: ONBOARD_RESOURCES.LOGO,
    description: ONBOARD_RESOURCES.DESCRIPTION,
    gettingStartedGuide: ONBOARD_RESOURCES.GUIDE,
    explore: ONBOARD_RESOURCES.EXPLORE,
    // agreement: {
    //   version: '1.0.0',
    //   termsUrl: 'https://www.blocknative.com/terms-conditions',
    //   privacyUrl: 'https://www.blocknative.com/privacy-policy'
    // },
    recommendedInjectedWallets: [
      { name: "MetaMask", url: "https://metamask.io" },
      { name: "Coinbase", url: "https://wallet.coinbase.com/" }
    ]
  };

  const accountCenter = {
    desktop: {
      position: "topRight",
      enabled: false,
      minimal: false
    },
    mobile: {
      position: "topRight",
      enabled: false,
      minimal: true
    }
  };

  const notify = {
    desktop: {
      enabled: true,
      transactionHandler: (transaction) => {},
      position: "bottomLeft"
    },
    mobile: {
      enabled: true,
      transactionHandler: (transaction) => {},
      position: "topRight"
    }
  };

  const customTheme = {
    "--w3o-background-color": "#181818",
    "--w3o-foreground-color": "#181818",
    "--w3o-text-color": "#ffffff",
    "--w3o-border-color": "#181818",
    "--w3o-action-color": "#fff",
    "--w3o-border-radius": "5px",
    "--w3o-font-family": "RobotoMono"
  };

  const web3Onboard = init({
    theme: customTheme,
    wallets,
    chains,
    appMetadata,
    accountCenter,
    notify
    // disableFontDownload: true
  });

  return (
    <Web3OnboardProvider web3Onboard={web3Onboard}>
      <DannyWalletConnector.Provider>{children}</DannyWalletConnector.Provider>
    </Web3OnboardProvider>
  );
};

export default DannyOnboardProvider;
