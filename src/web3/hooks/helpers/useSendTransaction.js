/* global BigInt */
import React from "react";
import { calculateGasMargin } from "../../utils/calculateGasMargin";
import DannyWalletConnector from "../../wallet/DannyWalletConnector";
import { ethers } from "ethers";

import useDannySnackbar from "../../../hooks/useDannySnackbar";

export const TransactionState = {
  NEW: "NEW",
  FEEING: "FEEING",
  SIGNING: "SIGNING",
  CONFIRMING: "CONFIRMING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  DENIED: "DENIED"
};

export default function useSendTransaction(trxName = null, contract) {
  const {
    connectWallet,
    disconnectWallet,
    signer,

    address,
    ethersProvider,

    isWalletConnected
  } = DannyWalletConnector.useContainer();

  const { showSuccess, showFail, showInfo, showWarning } = useDannySnackbar();

  const [state, setState] = React.useState(TransactionState.NEW);
  const [txHash, setTxHash] = React.useState("");
  const [txReceipt, setTxReceipt] = React.useState(null);

  const sendTransaction = async (transactionData, callback) => {
    if (!signer) {
      connectWallet();
      return;
    }

    resetStates();
    try {
      const txNoGasLimit = {
        to: transactionData.to,
        value: transactionData.valueToSend
          ? BigInt(transactionData.valueToSend)
          : null,
        data: transactionData.data
      };
      setState(TransactionState.FEEING);
      // showSnackbar.info(
      //   `Calculating ${trxName ? `${trxName} ` : ""}transaction fee`
      // );
      let estimateGas = await contract[trxName].estimateGas(txNoGasLimit);
      const gasLimit = calculateGasMargin(estimateGas);
      const tx = { ...txNoGasLimit, gasLimit }; // TODO test this works when firing off tx

      setState(TransactionState.SIGNING);
      showInfo(`Signing ${trxName ? `${trxName} ` : ""}transaction`);
      const res = await signer.sendTransaction(tx);
      setState(TransactionState.CONFIRMING);
      setTxHash(res.hash);
      showInfo(
        `Comfirming ${trxName ? `${trxName} ` : ""}transaction`,
        res.hash
      );
      const txReceipt = await res.wait();
      setTxReceipt(txReceipt);

      //tx was mined successfully
      if (txReceipt.status === 1) {
        setState(TransactionState.SUCCESS);
        showSuccess(
          `Suceess ${trxName ? `${trxName} ` : ""}transaction`,
          res.hash
        );
        if (typeof callback === "function") callback();
      } else {
        resetStates();

        setState(TransactionState.FAILED);
        showFail(`Failed ${trxName ? `${trxName} ` : ""}transaction`, res.hash);
      }
    } catch (e) {
      console.log("Transaction Error", e);
      setState(TransactionState.DENIED);
      showFail(`Denied ${trxName ? `${trxName} ` : ""}transaction`);
      resetStates();
      throw e;
    }
  };

  const resetStates = () => {
    setState(TransactionState.NEW);
    setTxHash("");
    setTxReceipt(null);
  };

  const isLoading = React.useMemo(() => {
    return (
      state === TransactionState.FEEING ||
      state === TransactionState.SIGNING ||
      state === TransactionState.CONFIRMING
    );
  }, [state]);

  return {
    state,
    txHash,
    txReceipt,
    isLoading,
    sendTransaction
  };
}
