import css from './AlertBackground.module.scss';

type alertLevel = { low: number; middle: number; height: number };
export const index = (
  difference: number,
  level: alertLevel = { low: 0.2, middle: 0.5, height: 0.7 },
) => {
  if (level.height < difference) {
    return css.alertBackground_danger;
  }
  if (level.middle < difference) {
    return css.alertBackground_warning;
  }
  if (level.low < difference) {
    return css.alertBackground_lowWarning;
  }
  return '';
};
