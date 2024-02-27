import React from "react";
import { ethers } from "ethers";
import TestCollectionContract from "../../../contracts/TestCollectionContract";
import { ContractCallState } from "../../../constants";
import useConstantProperties from "../../helpers/useConstantProperties";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { BN, isBNPositive } from "../../../utils/DanyBN";
import DannyWalletConnector from "../../../wallet/DannyWalletConnector";
import { useRecoilState } from "recoil";
import { userTokenIdsState } from "../../../../recoil/collection/atoms";
import useTCConstants from "./useTCConstants";

dayjs.extend(duration);

export default function useTCUserTokenIds() {
  const { ethersProvider, address } = DannyWalletConnector.useContainer();

  const {
    nftBalance,
    displayNFTBalance,
    fetchNFTBalance,
    tokenIds,
    fetchTokenIds
  } = useTCConstants();

  /** tokenIds */
  const [userTokenIdsState, setUserTokenIdsState] = React.useState(
    ContractCallState.NEW
  );
  const { isCallSuccess, isCallError, isLoading } =
    useConstantProperties(userTokenIdsState);

  const fetch = async () => {
    try {
      setUserTokenIdsState(ContractCallState.FETCHING);
      let nftBalance = await fetchNFTBalance(address);
      if (nftBalance > 10) nftBalance = 10;
      const tokenIds = await fetchTokenIds(nftBalance, address);
      setUserTokenIdsState(ContractCallState.SUCCESS);
      return tokenIds;
    } catch (error) {
      console.error(error.message);
      setUserTokenIdsState(ContractCallState.ERROR);
    }
  };

  return {
    tokenIds,
    isLoadingUserTokenIds: isLoading,
    isCallSuccessUserTokenIds: isCallSuccess,
    displayNFTBalance,

    fetchUserTokenIds: fetch
  };
}
