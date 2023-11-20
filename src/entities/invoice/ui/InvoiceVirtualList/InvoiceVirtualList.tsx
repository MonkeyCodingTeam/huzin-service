import { useVirtualizer } from '@tanstack/react-virtual';
import { FC, useRef } from 'react';

interface Props {
  filterValue: string;
}

export const InvoiceVirtualList: FC<Props> = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const count = 10;

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 455,
    overscan: 2,
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
              {/*  TODO добавить элементы */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
