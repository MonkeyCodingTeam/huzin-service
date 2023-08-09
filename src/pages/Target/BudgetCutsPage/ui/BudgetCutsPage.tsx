import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import css from './BudgetCutsPage.module.scss';
import { DateTime } from 'luxon';
import { Link } from '@shared/ui/Link';
import { FilterMatchMode } from 'primereact/api';
import { ContextMenu } from 'primereact/contextmenu';
import { EditClientModal } from '@pages/Target/BudgetCutsPage/ui/EditClientModal';
import { FormikValues } from 'formik';
import { Toast } from 'primereact/toast';
import { BudgetCutsHeader } from '@pages/Target/BudgetCutsPage/ui/BudgetCutsHeader';
import { index, redirectToVK } from '@shared/lib/util';
import { Client, ClientAPI } from '@entities/client';
import { User, UserAPI } from '@entities/user';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { useAppSelector } from '@shared/lib/redux';
import { MenuItem } from 'primereact/menuitem';
import { Tag } from 'primereact/tag';
import { TableLoader } from '@widgets';

interface SpentPlans {
  day_plan: number;
  day_difference: number;
  weekday_plan: number;
  weekday_difference: number;
  monthday_plan: number;
  monthday_difference: number;
}

type ClientPlans = Client & Partial<SpentPlans>;

const requestInterval = 1000 * 60;

const BudgetCutsPage = () => {
  const [updateDate, setUpdateDate] = useState<DateTime>(DateTime.now());
  const user = useAppSelector((state) => state.user);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [clients, setClients] = useState<ClientPlans[]>([]);
  const [selectedClient, setSelectedClients] = useState<Client>();
  const [editClient, setEditClients] = useState<Client>();
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<
    Record<string, { value: string; matchMode: FilterMatchMode }>
  >({
    global: { value: '', matchMode: FilterMatchMode.CONTAINS },
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const contextMenu = useRef<ContextMenu>(null);
  const toast = useRef<Toast>(null);
  const [menuModel, setMenuModal] = useState<MenuItem[]>([]);

  const dateTime = DateTime.now();
  const daysInMonth = dateTime.daysInMonth;
  const monthday = dateTime.day;
  const weekday = dateTime.weekday;

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
      label: 'Редактировать',
      icon: 'pi pi-fw pi-pencil',
      command: () => {
        setEditClients(client);
        setEditModalVisible(true);
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

  const getClients = () => {
    ClientAPI.getClients({ user_id: selectedUser?.id }).then((res) => {
      setClients(() =>
        res.data.map((client: ClientPlans) => {
          client.day_plan = Math.trunc(client.month_plan / daysInMonth);
          client.weekday_plan = client.day_plan * weekday;
          client.monthday_plan = client.day_plan * monthday;

          client.day_difference = Math.abs(
            client.day_plan && (client.day_plan - client.day_spent) / client.day_plan,
          );
          client.weekday_difference = Math.abs(
            client.weekday_plan && (client.weekday_plan - client.week_spent) / client.weekday_plan,
          );
          client.monthday_difference = Math.abs(
            client.monthday_plan &&
              (client.monthday_plan - client.month_spent) / client.monthday_plan,
          );

          return client;
        }),
      );
      setLoading(false);
    });
  };

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
      setUpdateDate(DateTime.now());
    }, requestInterval);

    return () => {
      clearInterval(interval);
    };
  }, [selectedUser]);

  const handleSubmit = useCallback(
    (values: FormikValues) => {
      if (editClient) {
        ClientAPI.updateClient(editClient.id, values).then(() => {
          getClients();
          setEditModalVisible(false);
          toast.current?.show({
            severity: 'success',
            detail: 'Сохранено!',
            life: 3000,
          });
        });
      }
    },
    [editClient],
  );

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

  const nameBodyTemplate = (client: ClientPlans) => {
    return (
      <Link target='_blank' href={`https://vk.com/ads?act=office&union_id=${client.id}`}>
        {client.name}
      </Link>
    );
  };

  const balanceBodyTemplate = (client: ClientPlans) => {
    return (
      <div className={css.budgetCell}>
        <span>
          {client.balance.toLocaleString()} / {client.critical_balance.toLocaleString()}
        </span>
        {client.zero_days !== 0 && (
          <Tag
            title='Дней без затрат'
            className={css.budgetCell__tag}
            icon='pi pi-exclamation-triangle'
            severity='warning'
            value={`${client.zero_days}`}
            rounded
          />
        )}
      </div>
    );
  };

  const balanceBodyStyle = (client: ClientPlans) => {
    if (client.balance < client.critical_balance) {
      return css.lowBalance;
    }
    if (client.balance < client.critical_balance * 1.4) {
      return css.middleBalance;
    }
    return '';
  };

  const daySpentBodyTemplate = (client: ClientPlans) => {
    return (
      <span>
        {client.day_spent === null ? 0 : client.day_spent.toLocaleString()} /{' '}
        {client.day_plan?.toLocaleString()}
      </span>
    );
  };
  const daySpentAlert = (client: ClientPlans) => {
    const difference = client.monthday_difference === undefined ? 1 : client.monthday_difference;
    return index(difference);
  };

  const weekSpentBodyTemplate = (client: ClientPlans) => {
    return (
      <span>
        {client.week_spent === null ? 0 : client.week_spent.toLocaleString()} /{' '}
        {client.weekday_plan?.toLocaleString()}
      </span>
    );
  };
  const weekSpentAlert = (client: ClientPlans) => {
    const difference = client.weekday_difference === undefined ? 1 : client.weekday_difference;
    return index(difference, { low: 0.15, middle: 0.3, height: 0.5 });
  };

  const monthSpentBodyTemplate = (client: ClientPlans) => {
    return (
      <span>
        {client.month_spent === null ? 0 : client.month_spent.toLocaleString()} /{' '}
        {client.monthday_plan?.toLocaleString()}
      </span>
    );
  };
  const monthSpentAlert = (client: ClientPlans) => {
    const difference = client.monthday_difference === undefined ? 1 : client.monthday_difference;
    return index(difference, { low: 0.07, middle: 0.13, height: 0.2 });
  };

  const needSpentBodyTemplate = (client: ClientPlans) => {
    if (client.monthday_plan && client.monthday_plan < client.month_spent) {
      return '-';
    }
    const dayDifference = daysInMonth - monthday;

    if (dayDifference === 0) {
      return '-';
    }

    if (client.zero_days) {
      return Math.trunc(
        (client.month_plan +
          client.budget_adjustment -
          client.month_spent -
          client.zero_days * (client.day_plan || 0)) /
          dayDifference,
      ).toLocaleString();
    }

    const differencePlan = client.month_plan - client.month_spent;
    const required = Math.trunc(differencePlan / dayDifference);

    return required.toLocaleString();
  };

  const monthPlanBody = (client: ClientPlans) => {
    if (client.budget_adjustment == 0) {
      return client.month_plan.toLocaleString();
    }
    return (
      <div className={css.adjustment}>
        <span className='p-overlay-badge'>{client.month_plan.toLocaleString()}</span>
        <span
          title='Корректировка бюджета'
          style={{
            fontSize: '12px',
            color: client.budget_adjustment > 0 ? 'green' : 'red',
          }}
        >
          {(client.budget_adjustment > 0 ? '+' : '') + client.budget_adjustment.toLocaleString()}
        </span>
      </div>
    );
  };

  const needRequestBodyTemplate = (client: ClientPlans) => {
    const need = client.month_plan - client.month_spent - client.balance;
    return need > 0 ? need.toLocaleString() : '-';
  };

  return (
    <>
      <TableLoader isLoading={loading}>
        <Toast ref={toast} />
        <ContextMenu
          model={menuModel}
          ref={contextMenu}
          onHide={() => setSelectedClients(undefined)}
        />
        <EditClientModal
          client={editClient}
          visible={editModalVisible}
          onHide={() => {
            setEditModalVisible(false);
          }}
          onSubmit={handleSubmit}
        />
        <DataTable
          selectionMode='single'
          sortField='name'
          sortOrder={1}
          scrollable
          scrollHeight='calc(100% - 84px)'
          tableStyle={{
            borderCollapse: 'separate',
            alignItems: 'center',
          }}
          style={{ height: '100%' }}
          size='small'
          value={clients}
          showGridlines
          rows={clients?.length || 10}
          key='id'
          filters={filters}
          globalFilterFields={['name']}
          header={
            <BudgetCutsHeader
              dateTime={updateDate}
              filterChange={handleFilterChange}
              users={users}
              selectedUser={selectedUser}
              onUserChange={handleUserChange}
            />
          }
          onContextMenu={(e) => contextMenu.current?.show(e.originalEvent)}
          contextMenuSelection={selectedClient}
          onContextMenuSelectionChange={(e) => setSelectedClients(e.value as Client)}
        >
          <Column
            body={nameBodyTemplate}
            header='Проект'
            field='name'
            sortable
            className={css.nameColumn}
          />
          <Column
            field='balance'
            sortable
            body={balanceBodyTemplate}
            header='Баланс'
            bodyClassName={balanceBodyStyle}
          />
          <Column
            bodyClassName={daySpentAlert}
            body={daySpentBodyTemplate}
            sortable
            field='day_difference'
            header='Траты: день'
          />
          <Column
            bodyClassName={weekSpentAlert}
            body={weekSpentBodyTemplate}
            sortable
            field='weekday_difference'
            header='Траты: неделя'
          />
          <Column
            bodyClassName={monthSpentAlert}
            body={monthSpentBodyTemplate}
            sortable
            field='monthday_difference'
            header='Траты: месяц'
          />
          <Column field='month_plan' body={monthPlanBody} header='План' />
          <Column body={needSpentBodyTemplate} header='Докрут в день' />
          <Column body={needRequestBodyTemplate} header='Зачислить' />
        </DataTable>
      </TableLoader>
    </>
  );
};

export default BudgetCutsPage;
