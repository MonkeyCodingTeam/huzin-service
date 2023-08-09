import css from './InvoiceItem.module.scss';
import { PrimeIcons } from 'primereact/api';
import { Invoice } from '@entities/invoice';
import { FC, MouseEvent } from 'react';
import { Button } from 'primereact/button';
import { confirmPopup } from 'primereact/confirmpopup';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';
import { InputText } from 'primereact/inputtext';
import { Field, Form, Formik } from 'formik';
import { DateTime } from 'luxon';

interface InvoiceItemProps {
  id: number;
  invoice: Invoice;
  sortable?: boolean;
  onPaid?: (invoice: Invoice) => void;
  onVkPaid?: (invoice: Invoice, vkNumber: Invoice['vk_number']) => void;
  onDelete?: (invoice: Invoice) => void;
}

export const InvoiceItem: FC<InvoiceItemProps> = ({
  invoice,
  onPaid,
  onDelete,
  onVkPaid,
  id,
  sortable = false,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, index } = useSortable({
    id: id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const confirmRemove = (e: MouseEvent<HTMLButtonElement>) => {
    if (onDelete) {
      confirmPopup({
        target: e.currentTarget,
        message: 'Хотите удалить счёт?',
        accept: () => onDelete(invoice),
        acceptLabel: 'Да',
        rejectLabel: 'Отмена',
      });
    }
  };

  const paidConfirm = (event: MouseEvent<HTMLButtonElement>) => {
    if (onPaid) {
      confirmPopup({
        target: event.currentTarget,
        message: 'Счёт оплачен?',
        acceptLabel: 'Да',
        rejectLabel: 'Нет',
        accept: () => onPaid(invoice),
      });
    }
  };

  const tools = () => {
    const { vk_paid_at, paid_at } = invoice;

    if (vk_paid_at) {
      const date = DateTime.fromSQL(paid_at || vk_paid_at).toFormat('dd.LL.yy HH:mm');

      return (
        <span>
          Оплачен: <b>{date}</b>
        </span>
      );
    }

    if (paid_at) {
      return (
        <Formik
          onSubmit={(values) => {
            if (onVkPaid) {
              onVkPaid(invoice, +values.vk_number);
            }
          }}
          initialValues={{ vk_number: invoice.vk_number || '' }}
        >
          <Form
            className={classNames('p-inputgroup', {
              'p-disabled': !invoice.paid_at,
            })}
            style={{ justifyContent: 'center' }}
          >
            <Field
              as={InputText}
              name='vk_number'
              style={{ maxWidth: '8rem' }}
              placeholder='Счёт вк'
            />
            <Button label='Оплатить' severity='success' type='submit' />
          </Form>
        </Formik>
      );
    }

    return (
      <>
        <Button
          type='button'
          icon={PrimeIcons.TRASH}
          area-label='Удалить'
          severity='danger'
          text
          onClick={(event) => confirmRemove(event)}
        />
        <Button
          type='button'
          label='Оплачен'
          area-label='Оплачен'
          severity='success'
          onClick={(event) => paidConfirm(event)}
        />
      </>
    );
  };

  return (
    <div className={css.invoice} ref={setNodeRef} style={style}>
      {sortable && <span style={{ color: 'var(--secondary-color)' }}>{invoice.order + 1}</span>}
      <div className={css.invoice__block}>
        <div className={css.invoice__block__info}>
          <div className={css.invoice__block__info__number}>
            <span>{`№ ${invoice.number}`}</span>
          </div>
          <span>{invoice.entrepreneur}</span>
          <span>Сумма: {invoice.sum}</span>
          {invoice.description && (
            <span className={css.invoice__block__info__description} title={invoice.description}>
              {invoice.description}
            </span>
          )}
        </div>
        <div className={css.invoice__block__info__tools}>{tools()}</div>
      </div>
      {sortable && (
        <Button
          className={css.invoice__block__title__drag}
          text
          icon={PrimeIcons.ARROWS_V}
          style={{ color: 'var(--primary-color)' }}
          {...attributes}
          {...listeners}
        />
      )}
    </div>
  );
};
