import { Invoice } from '@entities/invoice';

export const getInvoiceText = (invoice: Invoice) => {
  return `Счёт № ${invoice.number}
Сумма ${invoice.budget.toLocaleString()}
${invoice.client.entrepreneur} 
ИНН ${invoice.inn}`;
};

export const isInvoiceFullFilled = (invoice: Invoice) => {
  return invoice.inn && invoice.client.entrepreneur && invoice.number;
};
