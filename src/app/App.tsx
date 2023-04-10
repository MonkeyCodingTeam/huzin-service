import '@app/styles/index.scss';
import { addLocale, locale } from 'primereact/api';
import { ScrollTop } from 'primereact/scrolltop';
import { AppRouter } from '@app/providers/RouterProvider';
import { Helmet } from 'react-helmet';

export function App() {
  addLocale('ru', {
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
  });

  locale('ru');

  return (
    <>
      <Helmet titleTemplate={`${__APP_TITLE__} | %s`} defaultTitle={__APP_TITLE__}>
        <meta charSet='utf-8' />
      </Helmet>
      <ScrollTop />
      <AppRouter />
    </>
  );
}
