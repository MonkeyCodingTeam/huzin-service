import '@app/styles/index.scss';
import { ScrollTop } from 'primereact/scrolltop';
import { AppRouter } from '@app/providers/RouterProvider';
import { Helmet } from 'react-helmet-async';
import { Header } from '@widgets';

export function App() {
  return (
    <>
      <Helmet titleTemplate={`${__APP_TITLE__} | %s`} defaultTitle={__APP_TITLE__}>
        <meta charSet='utf-8' />
      </Helmet>
      <ScrollTop />
      <Header>
        <AppRouter />
      </Header>
    </>
  );
}
