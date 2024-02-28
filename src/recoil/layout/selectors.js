import { selector, selectorFamily } from "recoil";
import { isOpenNavigatorState, layoutState } from "./atoms";

export const layoutValueSelector = selectorFamily({
  key: "layoutValueSelector",
  get:
    ({ key }) =>
    ({ get }) => {
      const _layoutState = get(layoutState);
      return _layoutState[key];
    },
  set:
    ({ key }) =>
    ({ get, set }, newValue) => {
      const oldValue = get(layoutValueSelector({ key }));
      if (oldValue === newValue) return;
      set(layoutState, (prev) => ({ ...prev, [key]: newValue }));
    }
});

export const isGDXLargeSelector = selector({
  key: "isGDXLargeSelector",
  get: ({ get }) => {
    const layoutWidth = get(layoutValueSelector({ key: "width" }));
    return layoutWidth > 2000;
  }
});

export const isGDLargeSelector = selector({
  key: "isGDLargeSelector",
  get: ({ get }) => {
    const layoutWidth = get(layoutValueSelector({ key: "width" }));
    return layoutWidth > 1200;
  }
});

export const isGTMediumResponsiveSelector = selector({
  key: "isGTMediumResponsiveSelector",
  get: ({ get }) => {
    const layoutWidth = get(layoutValueSelector({ key: "width" }));
    return layoutWidth > 900;
  }
});

export const isGTSmallResponsiveSelector = selector({
  key: "isGTSmallResponsiveSelector",
  get: ({ get }) => {
    const layoutWidth = get(layoutValueSelector({ key: "width" }));
    return layoutWidth > 600;
  }
});
