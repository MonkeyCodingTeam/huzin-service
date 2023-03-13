import gif from '@shared/assets/gifs/wait_page_illustration.gif';
import css from './StubPage.module.scss';

const StubPage = () => {
  return (
    <div className={css.container}>
      <img src={gif} width={600} alt='Wait animation' />
      <span className={css.title}>Скоро здесь появится что-то классное!</span>
    </div>
  );
};

export default StubPage;
