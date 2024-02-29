import React from "react";

export default function useBooleanValueConstants(booleanValue, isCallSuccess) {
  const value = React.useMemo(
    () => (booleanValue === true ? true : false),
    [booleanValue]
  );

  const isValid = React.useMemo(
    () => typeof booleanValue === "boolean" && isCallSuccess,
    [booleanValue, isCallSuccess]
  );

  return {
    value,
    isValid
  };
}
