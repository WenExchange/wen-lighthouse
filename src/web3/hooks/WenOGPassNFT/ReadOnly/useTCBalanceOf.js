import React from "react";
import { ethers } from "ethers";
import TestCollectionContract from "../../../contracts/TestCollectionContract";
import { ContractCallState } from "../../../constants";
import useConstantProperties from "../../helpers/useConstantProperties";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { BN, isBNPositive } from "../../../utils/DanyBN";
import DannyWalletConnector from "../../../wallet/DannyWalletConnector";

dayjs.extend(duration);

export default function useTCBalanceOf() {
  const { ethersProvider } = DannyWalletConnector.useContainer();

  /** nftBalance */
  const [nftBalance, setNFTBalance] = React.useState(null);
  const [nftBalanceState, setNFTBalanceState] = React.useState(
    ContractCallState.NEW
  );
  const { isCallSuccess, isCallError, isLoading } =
    useConstantProperties(nftBalanceState);

  const fetch = async (address) => {
    try {
      setNFTBalanceState(ContractCallState.FETCHING);
      let _nftBalance = await TestCollectionContract(ethersProvider).balanceOf(
        address,
        {
          from: address
        }
      );

      setNFTBalanceState(ContractCallState.SUCCESS);
      setNFTBalance(_nftBalance);
      return _nftBalance;
    } catch (error) {
      console.error(error.message);
      setNFTBalanceState(ContractCallState.ERROR);
      setNFTBalance(null);
    }
  };

  const displayNFTBalance = React.useMemo(() => {
    if (isLoading || !isCallSuccess) return "-";
    if (nftBalance === null) return "-";
    return nftBalance;
  }, [nftBalance, isLoading, isCallSuccess]);

  return {
    nftBalance,
    isLoadingNFTBalance: isLoading,
    isCallSuccessNFTBalance: isCallSuccess,
    displayNFTBalance,
    fetchNFTBalance: fetch
  };
}
