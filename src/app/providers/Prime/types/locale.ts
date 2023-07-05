export type LocaleLangType = 'ru';

export interface LocaleType {
  locale: LocaleLangType;
  options: {
    firstDayOfWeek: number;
    dayNames: string[];
    dayNamesShort: string[];
    dayNamesMin: string[];
    monthNames: string[];
    monthNamesShort: string[];
    today: string;
    clear: string;
  };
}
