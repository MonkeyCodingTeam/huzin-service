import { LocaleLangType, LocaleType } from '@app/providers/Prime/types';

export const getLocale = (locale: LocaleLangType): LocaleType => {
  return locales[locale];
};

const locales: Record<LocaleLangType, LocaleType> = {
  ru: {
    locale: 'ru',
    options: {
      firstDayOfWeek: 0,
      dayNames: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресение'],
      dayNamesShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      dayNamesMin: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      monthNames: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
      ],
      monthNamesShort: [
        'Янв',
        'Фев',
        'Мар',
        'Апр',
        'Май',
        'Июн',
        'Июл',
        'Авг',
        'Сен',
        'Окт',
        'Ноя',
        'Дек',
      ],
      today: 'Сегодня',
      clear: 'Пусто',
    },
  },
};
