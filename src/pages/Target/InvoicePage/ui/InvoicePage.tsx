import { Typography } from 'antd';
import { ChangeEvent, useState } from 'react';
import { ClientInvoiceType } from '@entities/client';
import { InvoiceAddModal } from '@features/invoice';
import { SearchInput } from '@shared/ui';
import { Transition } from '@shared/ui/Transition';
import { ClientInvoiceList } from '@widgets/invoice';
import css from './InvoicePage.module.scss';

const { Text } = Typography;

const InvoicePage = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [clientInvoice, setClientInvoice] = useState<ClientInvoiceType>();

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const handleCancel = () => {
    setClientInvoice(undefined);
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
        <ClientInvoiceList filterValue={keyword} handleAddClick={setClientInvoice} />
      </section>

      <InvoiceAddModal clientInvoice={clientInvoice} onCancel={handleCancel} />
    </Transition>
  );
};

export default InvoicePage;
