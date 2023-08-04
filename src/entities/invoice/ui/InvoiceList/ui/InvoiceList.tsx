import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Invoice, InvoiceAPI } from '@entities/invoice';
import { InvoiceItem } from '@entities/invoice/ui/InvoiceList/ui/InvoiceItem';
import { FC, useState } from 'react';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';

interface InvoiceListProps {
  invoices: Invoice[];
}

export const InvoiceList: FC<InvoiceListProps> = ({ invoices }) => {
  const [invoicesState, setInvoicesState] = useState<Invoice[]>(
    invoices.sort((a, b) => a.order - b.order),
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDrugEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setInvoicesState((prevState) => {
        const oldInvoice = invoicesState.find((invoice) => invoice.id === active.id);
        const newInvoice = invoicesState.find((invoice) => invoice.id === over?.id);

        if (!oldInvoice || !newInvoice) return prevState;

        const oldIndex = prevState.indexOf(oldInvoice);
        const newIndex = prevState.indexOf(newInvoice);

        const invoices = arrayMove(prevState, oldIndex, newIndex);
        const invoiceIds = invoices.reduce<Invoice['id'][]>((prev, current) => {
          prev.push(current.id);
          return prev;
        }, []);

        InvoiceAPI.reorder(invoiceIds).then(() => {
          console.log(active, over);
        });

        return invoices;
      });
    }
  };

  return (
    <>
      <DndContext
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDrugEnd}
      >
        <SortableContext items={invoicesState}>
          {invoicesState.map((invoice) => (
            <InvoiceItem
              key={invoice.id}
              id={invoice.id}
              invoice={invoice}
              onPaid={function (): void {
                throw new Error('Function not implemented.');
              }}
              onDelete={function (): void {
                throw new Error('Function not implemented.');
              }}
            />
          ))}
        </SortableContext>
      </DndContext>
    </>
  );
};
