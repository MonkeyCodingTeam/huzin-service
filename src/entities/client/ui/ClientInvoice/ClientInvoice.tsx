import { HistoryOutlined } from '@ant-design/icons';
import { Button, Flex, Typography } from 'antd';
import React, { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ClientInvoiceType } from '@entities/client';
import { AddButton } from '@shared/ui';
import css from './ClientInvoice.module.scss';

const { Text } = Typography;

interface Props {
  clientInvoiceData: ClientInvoiceType;
  children: ReactNode;
  onAddClick: () => void;
  onHistoryClick: () => void;
}

const baseURL = '/client-settings/';

export const ClientInvoice: FC<Props> = ({
  clientInvoiceData,

  children,
  onAddClick,
  onHistoryClick,
}) => {
  return (
    <div className={css.clientInvoice}>
      <Link to={baseURL + clientInvoiceData.id} className={css.clientInvoice__title}>
        {clientInvoiceData.name}
      </Link>
      <Flex justify={'space-between'}>
        <Flex vertical>
          <div>
            <Text className={css.clientInvoice__text}>Организация: </Text>
            <Text>
              {clientInvoiceData.entrepreneur ? clientInvoiceData.entrepreneur : 'Не указана'}
            </Text>
          </div>
          <div>
            <Text className={css.clientInvoice__text}>Бюджет: </Text>
            <Text>{clientInvoiceData.month_plan.toLocaleString()}</Text>
          </div>
          <div>
            <Text className={css.clientInvoice__text}>Сумма оплаты: </Text>
            <Text>
              {clientInvoiceData.basic_payment
                ? clientInvoiceData.basic_payment.toLocaleString()
                : 'Не задана'}
            </Text>
          </div>
        </Flex>
        <Flex gap={16} align={'center'}>
          <Button
            type='dashed'
            key={'invoice-history'}
            style={{ alignItems: 'center' }}
            onClick={onHistoryClick}
          >
            <HistoryOutlined />
            История
          </Button>

          <AddButton onClick={onAddClick} />
        </Flex>
      </Flex>
      {children}
    </div>
  );
};
