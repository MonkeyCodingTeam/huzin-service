export const setFixedValue = (value: number, fractionDigits: number) =>
  `${value ? value.toFixed(fractionDigits).toLocaleString() : '-'}`;
