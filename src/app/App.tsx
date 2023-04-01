import '@app/styles/index.scss';
import { Header } from '@widgets/Header';
import { locale } from 'primereact/api';
import { ScrollTop } from 'primereact/scrolltop';
import { AppRouter } from '@app/providers/RouterProvider';
import { Helmet } from 'react-helmet';
import css from './styles/App.module.scss';

export function App() {
  locale('en');

  return (
    <>
      <Helmet titleTemplate={`${__APP_TITLE__} | %s`} defaultTitle={__APP_TITLE__}>
        <meta charSet='utf-8' />
      </Helmet>
      <ScrollTop />
      <Header />
      <div className={css.container}>
        <AppRouter />
      </div>
    </>
  );
}
