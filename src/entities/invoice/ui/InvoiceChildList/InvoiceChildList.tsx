import { DeleteOutlined } from '@ant-design/icons';
import { Button, Flex, Input, List, Space, Tooltip, Typography } from 'antd';
import React, { FC } from 'react';
import { InvoiceType } from '@entities/invoice';
import css from './InvoiceChildList.module.scss';

interface Props {
  invoices: InvoiceType[];
}

const { Text } = Typography;

// TODO мемезация
export const InvoiceChildList: FC<Props> = ({ invoices }) => {
  return (
    <List
      itemLayout='horizontal'
      // TODO добавить пропс данных
      dataSource={invoices}
      renderItem={(invoice) => {
        const sum = invoice.sum.toLocaleString();
        const isLongSum = sum.length > 9;
        const sumElement = `${sum.slice(0, 8)}...`;

        const isPaid = invoice.paid_at;

        return (
          <List.Item>
            <div className={css.invoiceChildList}>
              <Flex gap={16} align={'center'}>
                <Text className={css.invoiceChildList__title}>
                  №<Text className={css.invoiceChildList__text}>{invoice.number}</Text>
                </Text>
                <Text className={css.invoiceChildList__title}>
                  ИНН:<Text className={css.invoiceChildList__text}> {invoice.inn}</Text>
                </Text>
                <Text className={css.invoiceChildList__title}>
                  Организация:
                  <Text className={css.invoiceChildList__text}> {invoice.entrepreneur}</Text>
                </Text>
              </Flex>
              <Flex gap={8} align={'center'}>
                <Text className={css.invoiceChildList__title}>Сумма: </Text>
                {isLongSum ? (
                  <Tooltip title={sum}>{sumElement}</Tooltip>
                ) : (
                  <Text className={css.invoiceChildList__sum}>{sum}</Text>
                )}

                {/*TODO добавить пропс экшенов*/}
                {isPaid ? (
                  <Space.Compact block style={{ maxWidth: '202px' }}>
                    <Input style={{ width: '100%' }} placeholder='Счёт ВК' />
                    <Button type={'primary'} ghost>
                      Оплатить
                    </Button>
                  </Space.Compact>
                ) : (
                  <Flex gap={8} style={{ maxWidth: '202px' }}>
                    <Button type={'primary'} ghost>
                      Подтвердить оплату
                    </Button>
                    <Button danger icon={<DeleteOutlined />} />
                  </Flex>
                )}
              </Flex>
            </div>
          </List.Item>
        );
      }}
    />
  );
};
//
