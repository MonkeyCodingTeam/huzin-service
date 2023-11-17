import { HistoryOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Flex, List, Typography } from 'antd';
import { FC, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { InvData, InvoiceChildList, useGetClientsWithInvoiceQuery } from '@entities/invoice';
import css from './InvoiceList.module.scss';

interface Props {
  filterValue: string;
}

const { Text } = Typography;
const baseURL = '/client-settings/';

export const InvoiceList: FC<Props> = ({ filterValue }) => {
  // const { data: invoiceData = [], isLoading: invoiceIsLoading } = useGetInvoiceQuery(null);
  const { data: clientsData = [], isLoading: ClientsIsLoading } = useGetClientsWithInvoiceQuery({
    with: ['invoices'],
  });

  const filteredData = useMemo(() => {
    const data = clientsData.filter((client) =>
      client.searchField.toLowerCase().includes(filterValue),
    );
    console.log(data);
    return data;
  }, [clientsData, filterValue]);

  return (
    <List
      dataSource={filteredData}
      loading={ClientsIsLoading}
      renderItem={(client) => (
        <List.Item>
          <List.Item.Meta
            title={
              <Link to={baseURL + client.id} className={css.invoiceList__title}>
                {client.name}
              </Link>
            }
            description={
              <>
                <Flex justify={'space-between'}>
                  <Flex vertical>
                    <div>
                      <Text className={css.invoiceList__text}>Организация: </Text>
                      <Text>{client.entrepreneur ? client.entrepreneur : 'Не указана'}</Text>
                    </div>
                    <div>
                      <Text className={css.invoiceList__text}>Бюджет: </Text>
                      <Text>{client.month_plan.toLocaleString()}</Text>
                    </div>
                    <div>
                      <Text className={css.invoiceList__text}>Сумма оплаты: </Text>
                      <Text>
                        {client.basic_payment ? client.basic_payment.toLocaleString() : 'Не задана'}
                      </Text>
                    </div>
                  </Flex>

                  {/*TODO заменить на пропсы*/}
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
            }
          />
        </List.Item>
      )}
    />
  );
};
