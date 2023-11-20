import { Flex, List } from 'antd';
import React, { FC, useMemo } from 'react';
import { ClientInvoice, ClientInvoiceType, useGetClientsWithQuery } from '@entities/client';
import { InvData, Invoice } from '@entities/invoice';
import { InvoiceConfirmButton, InvoiceSendToVKButton } from '@features/invoice';
import { DeleteButton } from '@shared/ui';

interface Props {
  filterValue: string;
  handleAddClick: (ClientInvoice: ClientInvoiceType) => void;
}

export const ClientInvoiceList: FC<Props> = ({ filterValue, handleAddClick }) => {
  const { data = [], isLoading: ClientsIsLoading } = useGetClientsWithQuery({
    with: ['invoices'],
  });

  const filteredData = useMemo(() => {
    return data.filter((item) => item.searchField.toLowerCase().includes(filterValue));
  }, [data, filterValue]);

  return (
    <List
      dataSource={filteredData.slice(0, 3)}
      loading={ClientsIsLoading}
      renderItem={(clientInvoice) => (
        <List.Item>
          <ClientInvoice
            clientInvoiceData={clientInvoice}
            onHistoryClick={() => {
              console.log(clientInvoice.id);
            }}
            onAddClick={() => {
              handleAddClick(clientInvoice);
            }}
          >
            <Flex vertical gap={8} justify={'center'} style={{ marginTop: '8px' }}>
              {InvData.map((invoice) => (
                <Invoice invoice={invoice} key={invoice.id}>
                  {invoice.paid_at ? (
                    <InvoiceSendToVKButton invoiceId={invoice.id} />
                  ) : (
                    <Flex gap={8} style={{ maxWidth: '202px' }}>
                      <InvoiceConfirmButton clientId={clientInvoice.id} invoiceId={invoice.id} />
                      <DeleteButton
                        title='Удаление счёта'
                        description='Счёт будет удален'
                        okText='Продолжить'
                        cancelText='Отмена'
                        onConfirm={() => {
                          console.log(clientInvoice.id);
                        }}
                      />
                    </Flex>
                  )}
                </Invoice>
              ))}
            </Flex>
          </ClientInvoice>
        </List.Item>
      )}
    />
  );
};
