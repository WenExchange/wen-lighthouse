import { recoilPersist } from "recoil-persist";
import { atom } from "recoil";
import { ContractCallState } from "../../web3/constants";

const { persistAtom } = recoilPersist();

export const ethBalanceState = atom({
  key: "ethBalanceState",
  default: 0
});

export const ethBalanceCallState = atom({
  key: "ethBalanceCallState",
  default: ContractCallState.NEW
});

export const wenETHBalanceState = atom({
  key: "wenETHBalanceState",
  default: 0
});

export const wenETHBalanceCallState = atom({
  key: "wenETHBalanceCallState",
  default: ContractCallState.NEW
});
