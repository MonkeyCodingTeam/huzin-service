import { ChangeEvent, useEffect, useState } from 'react';
import { Client } from '@entities/client';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { AdminAPI } from '@shared/lib/api/admin';
import { BudgetCutsHeader } from '@pages/Target/BudgetCutsPage/ui/BudgetCutsHeader';
import { User, UserAPI } from '@entities/user';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { FilterMatchMode } from 'primereact/api';
import { Badge } from 'primereact/badge';
import { DateTime } from 'luxon';

const ReportPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsFiltered, setClientsFiltered] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [filters, setFilters] = useState<
    Record<string, { value: string; matchMode: FilterMatchMode }>
  >({
    global: { value: '', matchMode: FilterMatchMode.CONTAINS },
  });

  useEffect(() => {
    AdminAPI.getInvoiceReport().then((res) => {
      setClients(res.data);
      setClientsFiltered(res.data);
    });
    UserAPI.getUsers().then((res) => {
      setUsers(res.data);
    });
  }, []);

  const handleUserChange = (e: DropdownChangeEvent) => {
    setSelectedUser(e.value);
    if (!e.value) {
      return setClientsFiltered(clients);
    }
    setClientsFiltered(() =>
      clients.filter((client) => client.users?.find((user) => user.id === e.value.id)),
    );
  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
  };

  const userTemplate = (client: Client) => {
    return (
      <>
        {client.users?.map((user: User) => (
          <p key={user.id}>{user.name}</p>
        ))}
      </>
    );
  };

  const daysInZeroTemplate = (client: Client) => {
    const { zero_balance_at, paid_at } = client;
    if (!zero_balance_at) {
      return <Badge severity='success' value='0 д.' />;
    }
    const zeroAt = DateTime.fromSQL(zero_balance_at);
    const difference = paid_at
      ? zeroAt.diff(DateTime.fromSQL(paid_at), 'days')
      : zeroAt.diffNow('days');
    if (difference.days > 0) {
      const result = +Math.abs(difference.days).toFixed();

      return <Badge severity='danger' value={`${result} д.`} />;
    }
    return <Badge severity='success' value='0 д.' />;
  };

  const daysInLowTemplate = (client: Client) => {
    const { low_balance_at, paid_at } = client;
    if (!low_balance_at) {
      return <Badge severity='success' value='0 д.' />;
    }
    const lowAt = DateTime.fromSQL(low_balance_at);
    const difference = paid_at
      ? lowAt.diff(DateTime.fromSQL(paid_at), 'days')
      : lowAt.diffNow('days');
    if (difference.days > 0) {
      const result = +Math.abs(difference.days).toFixed();

      return <Badge severity='danger' value={`${result} д.`} />;
    }
    return <Badge severity='success' value='0 д.' />;
  };

  return (
    <DataTable
      sortField='name'
      sortOrder={1}
      scrollable
      scrollHeight='calc(100vh - 170px)'
      value={clientsFiltered}
      filters={filters}
      header={
        <BudgetCutsHeader
          filterChange={handleFilterChange}
          users={users}
          selectedUser={selectedUser}
          onUserChange={handleUserChange}
        />
      }
    >
      <Column field='name' header='Клиент' />
      <Column header='Менеджер' body={userTemplate} />
      <Column header='Ноль на счету' body={daysInZeroTemplate} />
      <Column header='Меньше крит. остатка' body={daysInLowTemplate} />
    </DataTable>
  );
};

export default ReportPage;
