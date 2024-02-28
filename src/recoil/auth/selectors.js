import { selector, selectorFamily } from "recoil";
import { discordState, earlyUserState, twitterState, userState } from "./atoms";

export const userValueSelector = selectorFamily({
  key: "userValueSelector",
  get:
    ({ key }) =>
    ({ get }) => {
      const _userState = get(userState);
      return _userState[key];
    },
  set:
    ({ key }) =>
    ({ get, set }, newValue) => {
      const oldValue = get(userValueSelector({ key }));
      if (oldValue === newValue) return;
      set(userState, (prev) => ({ ...prev, [key]: newValue }));
    }
});
