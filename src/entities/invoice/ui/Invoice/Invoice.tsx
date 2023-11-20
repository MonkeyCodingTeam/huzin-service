import { Flex, Tooltip, Typography } from 'antd';
import React, { FC, ReactNode } from 'react';
import { InvoiceType } from '@entities/invoice';
import css from './Invoice.module.scss';

interface Props {
  invoice: InvoiceType;
  children: ReactNode;
}

const { Text } = Typography;

export const Invoice: FC<Props> = ({ invoice, children }) => {
  const sum = invoice.sum.toLocaleString();
  const isLongSum = sum.length > 9;
  const sumElement = `${sum.slice(0, 8)}...`;

  return (
    <div className={css.invoice}>
      <Flex gap={16} align={'center'}>
        <Text className={css.invoice__title}>
          №<Text className={css.invoice__text}>{invoice.number}</Text>
        </Text>
        <Text className={css.invoice__title}>
          ИНН:<Text className={css.invoice__text}> {invoice.inn}</Text>
        </Text>
        <Text className={css.invoice__title}>
          Организация:
          <Text className={css.invoice__text}> {invoice.entrepreneur}</Text>
        </Text>
      </Flex>
      <Flex gap={8} align={'center'}>
        <Text className={css.invoice__title}>Сумма: </Text>
        {isLongSum ? (
          <Tooltip title={sum}>{sumElement}</Tooltip>
        ) : (
          <Text className={css.invoice__sum}>{sum}</Text>
        )}

        {children}
      </Flex>
    </div>
  );
};
