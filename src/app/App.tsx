import '@app/styles/index.scss';
import { ScrollTop } from 'primereact/scrolltop';
import { AppRouter } from '@app/providers/RouterProvider';
import { Helmet } from 'react-helmet';
import { axiosInstance } from '@shared/lib/axios';

export function App() {
  axiosInstance.get(`${__APP_API_URL__}/api/user`).then((res) => {
    console.log(res);
  });

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
