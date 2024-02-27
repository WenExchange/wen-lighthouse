import React from "react";
import { ethers } from "ethers";
import TestCollectionContract from "../../../contracts/TestCollectionContract";
import { ContractCallState } from "../../../constants";
import useConstantProperties from "../../helpers/useConstantProperties";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import DannyWalletConnector from "../../../wallet/DannyWalletConnector";
import WenExchange from "../../../contracts/WenExchangeContract/WenExchange";

dayjs.extend(duration);

export default function useIsApprovedForAll() {
  const { ethersProvider, address } = DannyWalletConnector.useContainer();
  /** isApprovedForAll */
  const [isApprovedForAll, setIsApprovedForAll] = React.useState(null);
  const [isApprovedForAllState, setIsApprovedForAllState] = React.useState(
    ContractCallState.NEW
  );
  const { isCallSuccess, isCallError, isLoading } = useConstantProperties(
    isApprovedForAllState
  );

  const fetch = async () => {
    try {
      setIsApprovedForAllState(ContractCallState.FETCHING);
      let isApprovedForAll = await TestCollectionContract(
        ethersProvider
      ).isApprovedForAll(address, WenExchange.address, {
        from: address
      });

      setIsApprovedForAllState(ContractCallState.SUCCESS);
      setIsApprovedForAll(isApprovedForAll);
    } catch (error) {
      console.error(error.message);
      setIsApprovedForAllState(ContractCallState.ERROR);
      setIsApprovedForAll(null);
    }
  };

  return {
    isApprovedForAll,

    isLoadingIsApprovedForAll: isLoading,
    isCallSuccessIsApprovedForAll: isCallSuccess,

    fetchIsApprovedForAll: fetch
  };
}
