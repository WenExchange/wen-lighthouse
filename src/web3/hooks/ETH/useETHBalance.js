import React from "react";
import { ethers } from "ethers";

import useConstantProperties from "../helpers/useConstantProperties";
import { ContractCallState } from "../../constants";
import useNumericTokenConstants from "../helpers/useNumericTokenConstants";
import DannyWalletConnector from "../../wallet/DannyWalletConnector";
import { useRecoilState, useResetRecoilState } from "recoil";
import {
  ethBalanceState,
  ethBalanceCallState
} from "../../../recoil/token/atoms";

export default function useETHBalance() {
  const {
    connectWallet,
    disconnectWallet,

    address,
    ethersProvider,
    isValidChain,
    checkChainAndAlert,
    isWalletConnected,
    checkAndConnectWallet
  } = DannyWalletConnector.useContainer();

  /** balance */
  const [weiETHBalance, setWeiETHBalance] = React.useState(0);
  const [ethBalance, setETHBalance] = useRecoilState(ethBalanceState);
  const [balanceCallState, setBalanceCallState] =
    useRecoilState(ethBalanceCallState);

  const fetch = async () => {
    try {
      if (!isValidChain) throw new Error("invalid chain");

      setBalanceCallState(ContractCallState.FETCHING);
      let balance = await ethersProvider.getBalance(address);
      setBalanceCallState(ContractCallState.SUCCESS);
      setWeiETHBalance(balance);
      setETHBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error(error.message);
      setBalanceCallState(ContractCallState.ERROR);
      setETHBalance(0);
      setWeiETHBalance(0);
    }
  };

  const { isCallSuccess, isLoading } = useConstantProperties(balanceCallState);
  const {
    bn,
    isValid,
    isPositive,
    numbered,
    stringed,
    display,
    displayNumberFormat
  } = useNumericTokenConstants(ethBalance, isCallSuccess);
  return {
    ethBalance,
    weiETHBalance,
    ethBalanceCallState,
    isLoadingETHBalance: isLoading,
    isCallSuccessETHBalance: isCallSuccess,

    stringed,
    ethBalanceBN: bn,
    isValidETHBalance: isValid,
    isPositiveETHBalance: isPositive,
    numberedETHBalance: numbered,
    displayETHBalance: display,
    displayNumberFormatETHBalance: displayNumberFormat,

    fetchETHBalance: fetch
  };
}
