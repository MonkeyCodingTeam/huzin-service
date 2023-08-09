import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Invoice, InvoiceItem } from '@entities/invoice';
import { FC } from 'react';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';

interface InvoiceListProps {
  invoices: Invoice[];
  onDragEnd: (event: DragEndEvent) => void;
  onDelete: (invoice: Invoice) => void;
  onPaid: (invoice: Invoice) => void;
  onVkPaid: (invoice: Invoice, vk_number: Invoice['vk_number']) => void;
}

export const InvoiceList: FC<InvoiceListProps> = ({
  invoices,
  onPaid,
  onDelete,
  onVkPaid,
  onDragEnd,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <>
      <DndContext
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={invoices}>
          {invoices.map((invoice) => (
            <InvoiceItem
              key={invoice.id}
              id={invoice.id}
              invoice={invoice}
              onPaid={onPaid}
              onDelete={onDelete}
              onVkPaid={onVkPaid}
              sortable
            />
          ))}
        </SortableContext>
      </DndContext>
    </>
  );
};
