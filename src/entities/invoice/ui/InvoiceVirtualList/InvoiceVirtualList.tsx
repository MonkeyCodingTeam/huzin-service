import { useVirtualizer } from '@tanstack/react-virtual';
import { Flex } from 'antd';
import { FC, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Invoice, useGetClientsWithInvoiceQuery } from '@entities/invoice';
import css from '@entities/invoice/ui/InvoiceList/InvoiceList.module.scss';

interface Props {
  filterValue: string;
}

const baseURL = '/client-settings/';

export const InvoiceVirtualList: FC<Props> = ({ filterValue }) => {
  const { data: clientsData = [] } = useGetClientsWithInvoiceQuery({
    with: ['invoices'],
  });

  const filteredData = useMemo(() => {
    const data = clientsData.filter((client) =>
      client.searchField.toLowerCase().includes(filterValue),
    );
    console.log(data);
    return data;
  }, [clientsData, filterValue]);

  const parentRef = useRef<HTMLDivElement>(null);
  const count = filteredData.length;

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 455,
    overscan: 10,
  });
  const items = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className='List'
      style={{
        height: `100vh`,
        width: 'inherit',
        overflowY: 'auto',
        contain: 'strict',
      }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${items[0]?.start ?? 0}px)`,
          }}
        >
          {items.map((virtualRow) => (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              className={virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
            >
              <Flex gap={8} vertical>
                <Link
                  style={{ padding: '0 16px' }}
                  to={baseURL + filteredData[virtualRow.index].id}
                  className={css.invoiceList__title}
                >
                  {filteredData[virtualRow.index].name}
                </Link>
                <Invoice invoice={filteredData[virtualRow.index]} />
              </Flex>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
