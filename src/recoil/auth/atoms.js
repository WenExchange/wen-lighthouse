import { recoilPersist } from "recoil-persist";
import { atom } from "recoil";

const { persistAtom } = recoilPersist();

export const userState = atom({
  key: "userState",
  default: {
    wallet: null,
    discord: {
      auth: null
    }
  },
  effects_UNSTABLE: [persistAtom]
});

export const walletState = atom({
  key: "walletState",
  default: {},
  effects_UNSTABLE: [persistAtom]
});
