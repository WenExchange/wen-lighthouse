import React from "react";
import { BN, convertToETH, isBNPositive, BN_FORMAT } from "../../utils/DanyBN";

export default function useTrxFeeConstants(gasUnit, gasPrice, isCallSuccess) {
  const txFeeBN = React.useMemo(
    () => BN(gasPrice * gasUnit),
    [gasUnit, gasPrice]
  );
  const isValid = React.useMemo(
    () => isCallSuccess && !txFeeBN.isNaN(),
    [isCallSuccess, txFeeBN]
  );
  const isPositive = React.useMemo(
    () => isValid && isBNPositive(txFeeBN),
    [isValid, txFeeBN]
  );

  const display = React.useMemo(() => {
    if (!isPositive) return "-";
    return convertToETH(txFeeBN).decimalPlaces(4).toString();
  }, [isPositive, txFeeBN]);

  return {
    txFeeBN,
    isValid,
    isPositive,
    display
  };
}
