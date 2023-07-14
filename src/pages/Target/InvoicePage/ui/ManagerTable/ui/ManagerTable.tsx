import { Client, ClientAPI } from '@entities/client';
import { ChangeEvent, FC, RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { User, UserAPI } from '@entities/user';
import { FilterMatchMode } from 'primereact/api';
import { ContextMenu } from 'primereact/contextmenu';
import { redirectToVK } from '@shared/lib/util';
import { MenuItem } from 'primereact/menuitem';
import { TableLoader } from '@widgets';
import { DataTable } from 'primereact/datatable';
import { BudgetCutsHeader } from '@pages/Target/BudgetCutsPage/ui/BudgetCutsHeader';
import { Column } from 'primereact/column';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { type Toast } from 'primereact/toast';

interface ManagerTableProps {
  user: User;
  toast: RefObject<Toast>;
}

export const ManagerTable: FC<ManagerTableProps> = ({ user, toast }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClients] = useState<Client>();
  const [menuModel, setMenuModal] = useState<MenuItem[]>([]);
  const [filters, setFilters] = useState<
    Record<string, { value: string; matchMode: FilterMatchMode }>
  >({
    global: { value: '', matchMode: FilterMatchMode.CONTAINS },
  });

  const contextMenu = useRef<ContextMenu>(null);

  const getContextMenu = (client?: Client) => [
    {
      label: client?.is_mine ? 'Перестать следить' : 'Следить',
      icon: `pi pi-fw ${client?.is_mine ? 'pi-eye-slash' : 'pi-eye'}`,
      command: () => {
        if (!client) return;

        ClientAPI.toggleWatcher(client, user).then((res) => {
          setClients((prevState) => {
            prevState = prevState.map((item) => {
              return item.id === client.id ? { ...item, is_mine: res.data } : item;
            });

            if (selectedUser?.id) {
              return prevState.filter((client) => client.is_mine);
            }
            return prevState;
          });
          toast.current?.show({
            severity: 'success',
            detail: 'Сохранено!',
            life: 2000,
          });
        });
      },
    },
    {
      label: 'Открыть в РК',
      icon: 'pi pi-fw pi-external-link',
      command: () => {
        redirectToVK(client);
      },
    },
  ];

  useEffect(() => {
    setMenuModal(getContextMenu(selectedClient));
  }, [selectedClient]);

  useEffect(() => {
    UserAPI.getUsers().then((res) => {
      const localUser = localStorage.getItem('selected-user') || 0;
      const selectedUser = res.data.find((item) => item.id === +localUser);
      setSelectedUser(selectedUser);
      setUsers(res.data);
    });
  }, []);

  useEffect(() => {
    getClients();
    const interval = setInterval(() => {
      getClients();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedUser]);

  const getClients = useCallback(() => {
    ClientAPI.getClients({ user_id: selectedUser?.id }).then((res) => {
      setClients(res.data);
      setLoading(false);
    });
  }, [selectedUser]);

  const handleUserChange = (e: DropdownChangeEvent) => {
    setSelectedUser(e.value);
    if (e.value) {
      return localStorage.setItem('selected-user', e.value.id);
    }
    localStorage.removeItem('selected-user');
  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
  };

  const changeAgreed = useCallback((client: Client, agreed?: boolean) => {
    ClientAPI.updateInvoice(client, {
      is_budget_agreed: agreed,
      recommended_budget: client.recommended_budget,
    }).then((res) => {
      setClients((prevState) =>
        prevState.map((client) => (client.id === res.data.id ? res.data : client)),
      );
      if (agreed) {
        toast.current?.show({
          severity: 'success',
          detail: 'Бюджет согласован!',
          summary: client.name,
          life: 2000,
        });
      }
    });
  }, []);

  const changeRecommendedBudget = useCallback(
    (client: Client, event: InputNumberValueChangeEvent) => {
      ClientAPI.updateInvoice(client, {
        recommended_budget: event.value || null,
      }).then((res) => {
        setClients((prevState) =>
          prevState.map((client) => (client.id === res.data.id ? res.data : client)),
        );
        toast.current?.show({
          severity: 'success',
          detail: 'Сохранено!',
          summary: client.name,
          life: 2000,
        });
      });
    },
    [],
  );

  return (
    <TableLoader isLoading={loading}>
      <ContextMenu
        model={menuModel}
        ref={contextMenu}
        onHide={() => setSelectedClients(undefined)}
      />
      <DataTable
        header={
          <BudgetCutsHeader
            filterChange={handleFilterChange}
            users={users}
            selectedUser={selectedUser}
            onUserChange={handleUserChange}
          />
        }
        value={clients}
        size='small'
        scrollable
        scrollHeight='calc(100vh - 120px)'
        selectionMode='single'
        onContextMenu={(e) => contextMenu.current?.show(e.originalEvent)}
        contextMenuSelection={selectedClient}
        onContextMenuSelectionChange={(e) => setSelectedClients(e.value as Client)}
        key='id'
        filters={filters}
        sortField='name'
        sortOrder={1}
        globalFilterFields={['name']}
      >
        <Column field='name' header='Клиент' style={{ maxWidth: '10rem' }} />
        <Column
          field='recommended_budget'
          header='Рекомeндованный бюджет'
          body={(client: Client) => (
            <InputNumber
              value={client.recommended_budget}
              onValueChange={(e) => changeRecommendedBudget(client, e)}
            />
          )}
        />
        <Column
          align='center'
          field='is_budget_agreed'
          header='Согласован'
          body={(client: Client) => (
            <Checkbox
              title={client.recommended_budget ? '' : 'Нужно указать рекомендованный бюджет'}
              disabled={!client.recommended_budget}
              onChange={(e) => changeAgreed(client, e.checked)}
              checked={!!client.is_budget_agreed}
            ></Checkbox>
          )}
        />
      </DataTable>
    </TableLoader>
  );
};
