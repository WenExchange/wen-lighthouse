import { atom } from "recoil";

export const layoutState = atom({
  key: "layoutState",
  default: {
    isOpenNavigator: false,
    width: 0,
    navigatorWidth: 240
  }
});
