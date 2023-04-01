import gif from '@shared/assets/gifs/wait_page_illustration.gif';
import css from './StubPage.module.scss';
import { Transition } from '@widgets';

const StubPage = () => {
  return (
    <Transition className={css.container}>
      <img src={gif} width={600} alt='Wait animation' />
      <span className={css.title}>Скоро здесь появится что-то классное!</span>
    </Transition>
  );
};

export default StubPage;
