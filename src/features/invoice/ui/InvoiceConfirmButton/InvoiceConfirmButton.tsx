import { Button, Popconfirm } from 'antd';
import React, { FC } from 'react';
import { ClientInvoiceType } from '@entities/client';
import { InvoiceType } from '@entities/invoice';

interface Props {
  clientId: ClientInvoiceType['id'];
  invoiceId: InvoiceType['id'];
}

export const InvoiceConfirmButton: FC<Props> = ({ clientId, invoiceId }) => {
  const onClick = () => {
    console.log(clientId, invoiceId);
  };
  return (
    <Popconfirm
      title='Подтверждение оплаты'
      description='Счёт будет оплачен'
      onConfirm={onClick}
      okText='Продолжить'
      cancelText='Отмена'
    >
      <Button type={'primary'} ghost>
        Подтвердить оплату
      </Button>
    </Popconfirm>
  );
};
