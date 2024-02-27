import BigNumber from "bignumber.js";

BigNumber.config({
  // DECIMAL_PLACES: 4,
  ROUNDING_MODE: BigNumber.ROUND_DOWN, // 1
  EXPONENTIAL_AT: [-1e9, 1e9]
});

export const BN = (value) => {
  const bn = new BigNumber(value);
  return bn;
};

export const convertToETH = (bn) => {
  const unit = BN("1e+18");
  return bn.div(unit);
};

export const convertToSixDecimalSEI = (bn) => {
  const unit = BN("1e+6");
  return bn.div(unit);
};

export const convertToWei = (bn) => {
  return bn.multipliedBy("1e+18");
};

export const convertToSixDecimalWei = (bn) => {
  return bn.multipliedBy("1e+6");
};

export const isBNPositive = (bn) => {
  return !bn.isNaN() && !bn.isZero() && bn.isPositive();
};

export const BN_FORMAT = {
  prefix: "",
  decimalSeparator: ".",
  groupSeparator: ",",
  groupSize: 3,
  suffix: ""
};
