import { Dialog } from 'primereact/dialog';
import { Client } from '@entities/client';
import { FC, useEffect, useState } from 'react';
import { Invoice } from '@entities/invoice/types';
import { InvoiceAPI, InvoiceItem } from '@entities/invoice';

interface InvoiceArchiveDialogProps {
  isOpen: boolean;
  onHide: () => void;
  client?: Client;
}

export const InvoiceArchiveDialog: FC<InvoiceArchiveDialogProps> = ({ client, isOpen, onHide }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    if (!client || !isOpen) return;

    InvoiceAPI.archive(client.id).then(({ data }) => {
      setInvoices(data);
    });
  }, [client, isOpen]);

  return (
    <Dialog visible={isOpen} onHide={onHide}>
      {!invoices.length && <span>Нет оплаченных счетов</span>}
      {invoices.map((invoice) => (
        <InvoiceItem key={invoice.id} id={invoice.id} invoice={invoice} />
      ))}
    </Dialog>
  );
};
