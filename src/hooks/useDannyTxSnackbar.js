import React from "react";
import { enqueueSnackbar } from "notistack";
import useDannySnackbar from "./useDannySnackbar";
import { shortenPublicKey } from "../web3/utils/helpers";

export default function useDannyTxSnackbar(methodName) {
  const { showSuccess, showFail, showInfo, showWarning } = useDannySnackbar();
  const showSigningSb = () => {
    showInfo(
      `[1/3] Please confirm the transaction - ${
        methodName ? `${methodName} ` : ""
      }`
    );
  };

  const showConfirmingSb = () => {
    showInfo(
      `[2/3] Confirming your transaction - ${
        methodName ? `${methodName} ` : ""
      }`
    );
  };

  const showSuccessSb = (receipt) => {
    showSuccess(
      `[3/3] Suceess - ${methodName} - TxHash: ${shortenPublicKey(
        receipt.hash
      )}`
    );
  };
  const showFailSb = () => {
    showWarning(`Fails ${methodName ? `${methodName} ` : ""}Transaction`);
  };

  const showInvaliNetworkSb = () => {
    showFail(`Wrong Network`);
  };

  return {
    showSigningSb,
    showConfirmingSb,
    showSuccessSb,
    showFailSb,
    showInvaliNetworkSb,
    ...useDannySnackbar()
  };
}
