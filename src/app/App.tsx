import '@app/styles/index.scss';
import { Header } from '@widgets/Header';
import { locale } from 'primereact/api';
import { ScrollTop } from 'primereact/scrolltop';
import { AppRouter } from '@app/providers/RouterProvider';

export function App() {
  locale('en');

  return (
    <>
      <Header />
      <ScrollTop />
      <AppRouter />
    </>
  );
}
