import { HistoryOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Typography } from 'antd';
import { FC } from 'react';
import { InvData, InvoiceChildList } from '@entities/invoice';
import { ClientInvoice } from '@entities/invoice/model/invoice';
import css from '@entities/invoice/ui/InvoiceList/InvoiceList.module.scss';

const { Text } = Typography;

interface Props {
  invoice: ClientInvoice;
}

export const Invoice: FC<Props> = ({ invoice }) => {
  return (
    <>
      <Flex justify={'space-between'} style={{ padding: '0 16px' }}>
        <Flex vertical>
          <div>
            <Text className={css.invoiceList__text}>Организация: </Text>
            <Text>{invoice.entrepreneur ? invoice.entrepreneur : 'Не указана'}</Text>
          </div>
          <div>
            <Text className={css.invoiceList__text}>Бюджет: </Text>
            <Text>{invoice.month_plan.toLocaleString()}</Text>
          </div>
          <div>
            <Text className={css.invoiceList__text}>Сумма оплаты: </Text>
            <Text>
              {invoice.basic_payment ? invoice.basic_payment.toLocaleString() : 'Не задана'}
            </Text>
          </div>
        </Flex>
        <Flex gap={16} align={'center'}>
          <Button type='dashed' key={'invoice-history'} style={{ alignItems: 'center' }}>
            <HistoryOutlined />
            История
          </Button>

          <Button type='primary' key={'invoice-add'} style={{ alignItems: 'center' }}>
            <PlusOutlined />
            Добавить
          </Button>
        </Flex>
      </Flex>
      <InvoiceChildList invoices={InvData} />
    </>
  );
};
