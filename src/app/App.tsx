import '@app/styles/index.scss';
import { ScrollTop } from 'primereact/scrolltop';
import { AppRouter } from '@app/providers/RouterProvider';
import { Helmet } from 'react-helmet-async';
import { Header } from '@widgets';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@shared/lib/redux';
import { AuthThunk } from '@processes/auth';
import { Loader } from '@shared/ui';
import { ru } from 'yup-locales';
import { setLocale } from 'yup';

export function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  setLocale(ru);

  useEffect(() => {
    dispatch(AuthThunk.getUser()).finally(() => setLoading(false));
  }, [dispatch]);

  return loading ? (
    <Loader />
  ) : (
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
