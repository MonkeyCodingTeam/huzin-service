export const setArrayToOptionsFormat = <T extends object, V extends keyof T, L extends keyof T>(
  array: T[],
  valueField: V,
  labelField: L,
) => {
  return array.map((value) => {
    return {
      value: value[valueField],
      label: value[labelField],
    };
  });
};
