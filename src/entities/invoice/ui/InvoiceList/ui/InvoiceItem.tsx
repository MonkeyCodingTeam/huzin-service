import css from './InvoiceItem.module.scss';
import { PrimeIcons } from 'primereact/api';
import { Invoice } from '@entities/invoice';
import { FC, MouseEvent } from 'react';
import { Button } from 'primereact/button';
import { confirmPopup } from 'primereact/confirmpopup';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface InvoiceItemProps {
  id: number;
  invoice: Invoice;
  onPaid: () => void;
  onDelete: () => void;
}

export const InvoiceItem: FC<InvoiceItemProps> = ({ invoice, onPaid, onDelete, id }) => {
  const { attributes, listeners, setNodeRef, transform, transition, newIndex } = useSortable({
    id: id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const confirmRemove = (e: MouseEvent<HTMLButtonElement>) => {
    confirmPopup({
      target: e.currentTarget,
      message: 'Хотите удалить счёт?',
      accept: onDelete,
      acceptLabel: 'Да',
      rejectLabel: 'Отмена',
    });
  };

  const paidConfirm = (event: MouseEvent<HTMLButtonElement>) => {
    confirmPopup({
      target: event.currentTarget,
      message: 'Счёт оплачен?',
      acceptLabel: 'Да',
      rejectLabel: 'Нет',
      icon: 'pi pi-exclamation-triangle',
      accept: onPaid,
    });
  };

  return (
    <div className={css.invoice} ref={setNodeRef} style={style}>
      <Button
        className={css.invoice__block__title__drag}
        text
        icon={PrimeIcons.ARROWS_V}
        style={{ color: 'var(--primary-color)' }}
        {...attributes}
        {...listeners}
      />
      <div className={css.invoice__block}>
        <span className={css.invoice__block__title}>{`№ ${invoice.number}`}</span>
        <span>
          {invoice.entrepreneur} ИНН {invoice.inn}
        </span>
        <span>Сумма: {invoice.sum}</span>
        <div>
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
        </div>
      </div>
    </div>
  );
};
