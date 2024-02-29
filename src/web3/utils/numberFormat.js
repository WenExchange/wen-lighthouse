export const abbreviateNumberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 3,
  notation: "compact",
  compactDisplay: "short"
});

export const getAbbreviateNumberFormat = ({
  maximumFractionDigits = 3,
  notation = "compact",
  compactDisplay = "short"
}) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
    notation,
    compactDisplay
  });
};
