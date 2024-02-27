import React, { useContext } from "react";
import { isProduction } from "../../utils/constants";
import { useConnectWallet, useSetChain, useWallets } from "@web3-onboard/react";
import { ethers } from "ethers";
import { CHAINS, AnkrRPCProvider, RPC_URL } from "../constants";
import useDanyDidMount from "../../hooks/helper/useDanyDidMount";
import { useRecoilState, useRecoilValue } from "recoil";
import { walletState } from "../../recoil/auth/atoms";
import { createContainer } from "unstated-next";
import { enqueueSnackbar } from "notistack";

const useDannyWalletConnector = () => {
  const [recoilWallet, setRecoilWallet] = useRecoilState(walletState);
  const [
    {
      wallet, // the wallet that has been connected or null if not yet connected
      connecting // boolean indicating if connection is in progress
    },
    connect, // function to call to initiate user to connect wallet
    disconnect, // function to call with wallet<DisconnectOptions> to disconnect wallet
    updateBalances, // function to be called with an optional array of wallet addresses connected through Onboard to update balance or empty/no params to update all connected wallets
    setWalletModules, // function to be called with an array of wallet modules to conditionally allow connection of wallet types i.e. setWalletModules([ledger, trezor, injected])
    setPrimaryWallet // function that can set the primary wallet and/or primary account within that wallet. The wallet that is set needs to be passed in for the first parameter and if you would like to set the primary account, the address of that account also needs to be passed in
  ] = useConnectWallet();
  const [
    {
      chains, // the list of chains that web3-onboard was initialized with
      connectedChain, // the current chain the user's wallet is connected to
      settingChain // boolean indicating if the chain is in the process of being set
    },
    setChain // function to call to initiate user to switch chains in their wallet
  ] = useSetChain();

  const [ethersProvider, setProvider] = React.useState(null);
  const connectedWallets = useWallets();

  /** Auto Connect */
  useDanyDidMount(() => {
    if (!recoilWallet) return;
    if (!recoilWallet?.label) return;
    connectWallet({ autoSelect: recoilWallet.label });
  }, []);

  useDanyDidMount(() => {
    if (wallet?.provider) {
      setProvider(new ethers.BrowserProvider(wallet.provider, "any"));
    } else {
      setProvider(AnkrRPCProvider);
    }
    if (wallet?.label) {
      setRecoilWallet({
        ...recoilWallet,
        label: wallet.label
      });
    }
  }, [wallet]);

  /** Wallet Actions */
  const connectWallet = (connectInfo = null) => {
    connect(connectInfo)
      .then((connectionInfo) => {
        if (!Array.isArray(connectionInfo))
          throw new Error("invalid connectionInfo");
        if (connectionInfo.length <= 0)
          throw new Error("invalid connectionInfo length");

        setRecoilWallet({
          ...recoilWallet,
          label: connectionInfo[0].label
        });
        return setChain({
          chainId: CHAINS[isProduction ? "ETHEREUM" : "SEPOLIA"].id
          // chainId: CHAINS["ETHEREUM"].id
        });
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const setValidChain = async () => {
    try {
      await setChain({
        chainId: CHAINS[isProduction ? "ETHEREUM" : "SEPOLIA"].id
        // chainId: CHAINS["ETHEREUM"].id
      });
    } catch (error) {}
  };

  const disconnectWallet = React.useCallback(async () => {
    try {
      await disconnect({ label: wallet?.label });
      setRecoilWallet({});
    } catch (e) {
      console.log(e);
    }
  }, [wallet]);

  const checkAndConnectWallet = () => {
    if (!isWalletConnected) {
      connectWallet();
    }
    return isWalletConnected;
  };

  const checkChainAndAlert = () => {
    if (!isValidChain) {
      enqueueSnackbar("Wrong Network", {
        variant: "error"
      });
    }
    return isValidChain;
  };

  const getSignerContract = async (address, abi) => {
    if (!signer) return null;

    try {
      const contract = new ethers.Contract(address, abi, await signer);
      return contract;
    } catch (error) {
      return null;
    }
  };

  const getUnsignedContract = (address, abi, provider = AnkrRPCProvider) => {
    try {
      return new ethers.Contract(address, abi, provider);
    } catch (error) {
      return null;
    }
  };

  /** Wallet Values */
  const address = React.useMemo(() => {
    return wallet?.accounts[0]?.address;
  }, [wallet]);

  const balacne = React.useMemo(() => {
    return wallet?.accounts[0]?.balance;
  }, [wallet]);

  /** Validations */
  const isWalletConnected = React.useMemo(() => {
    return wallet ? true : false;
  }, wallet);

  const isValidChain = React.useMemo(() => {
    try {
      const chainInfo = CHAINS[isProduction ? "ETHEREUM" : "SEPOLIA"];

      return connectedChain?.id === chainInfo.id;
    } catch (error) {
      return false;
    }
  }, [connectedChain]);

  /** Transaction */
  const signer = React.useMemo(() => {
    try {
      if (ethersProvider instanceof ethers.BrowserProvider) {
        return ethersProvider.getSigner();
      } else {
        return null;
      }
      // return ethersProvider ? ethersProvider.getSigner() : null;
    } catch (error) {
      return null;
    }
  }, [ethersProvider, wallet]);

  const signMessage = async (message) => {
    if (!signer) return null;
    try {
      const _signer = await signer;
      const result = await _signer.signMessage(message);
      return result;
    } catch (error) {
      throw error;
    }
  };

  return {
    wallet,
    connecting,
    connectWallet,
    disconnectWallet,
    checkAndConnectWallet,
    signMessage,
    getSignerContract,
    getUnsignedContract,
    setValidChain,

    address,
    balacne,

    connectedWallets,

    ethersProvider,
    signer,
    isWalletConnected,
    isValidChain,
    checkChainAndAlert
  };
};

let Connector = createContainer(useDannyWalletConnector);

export default Connector;
