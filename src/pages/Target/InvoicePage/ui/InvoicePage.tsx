import { Typography } from 'antd';
import { ChangeEvent, useState } from 'react';
import { InvoiceList } from '@entities/invoice';
import { SearchInput } from '@shared/ui';
import { Transition } from '@shared/ui/Transition';
import css from './InvoicePage.module.scss';

const { Text } = Typography;

const InvoicePage = () => {
  const [keyword, setKeyword] = useState<string>('');

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  return (
    <Transition className={css.invoicePage}>
      <section className={css.invoicePage__options}>
        <div className={css.invoicePage__option}>
          <Text className={css.invoicePage__text}>Поиск:</Text>
          <SearchInput
            handleValueChange={handleValueChange}
            placeholder={'Введите наименование клиента или организации'}
          />
        </div>
      </section>

      <section className={css.invoicePage__content}>
        <InvoiceList filterValue={keyword} />
      </section>
    </Transition>
  );
};

export default InvoicePage;
