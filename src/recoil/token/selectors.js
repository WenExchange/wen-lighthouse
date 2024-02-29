import { selector, selectorFamily } from "recoil";
import { ContractCallState } from "../../web3/constants";
import { ethBalanceCallState } from "./atoms";

export const isLoadingETHBalanceSelector = selector({
  key: "isLoadingETHBalanceSelector",
  get: ({ get }) => {
    const ethBalanceCall = get(ethBalanceCallState);
    return ethBalanceCall === ContractCallState.FETCHING;
  }
});

export const isCallSuccessETHBalanceSelector = selector({
  key: "isCallSuccessETHBalanceSelector",
  get: ({ get }) => {
    const ethBalanceCall = get(ethBalanceCallState);
    return ethBalanceCall === ContractCallState.SUCCESS;
  }
});

export const isCallErrorETHBalanceSelector = selector({
  key: "isCallErrorETHBalanceSelector",
  get: ({ get }) => {
    const ethBalanceCall = get(ethBalanceCallState);
    return ethBalanceCall === ContractCallState.ERROR;
  }
});
