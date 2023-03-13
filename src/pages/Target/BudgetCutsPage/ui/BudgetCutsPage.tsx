import { useCallback, useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import css from './BudgetCutsPage.module.scss';
import { InputText } from 'primereact/inputtext';
import { DateTime } from 'luxon';
import { TargetAPI } from '@shared/lib/api';
import { Dropdown } from 'primereact/dropdown';
import { Link } from '@shared/ui/Link';
import { FilterMatchMode } from 'primereact/api';
import { TableSkeleton } from '@shared/ui/Skeletons';
import { ContextMenu } from 'primereact/contextmenu';
import { EditClientModal } from '@pages/Target/BudgetCutsPage/ui/EditClientModal';
import { Client } from '@shared/lib/api/target/types';
import { FormikValues } from 'formik';
import { Toast } from 'primereact/toast';

const BudgetCutsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClients] = useState<Client>();
  const [editClient, setEditClients] = useState<Client>();
  const [user, setUser] = useState<Client>();
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<
    Record<string, { value: string; matchMode: FilterMatchMode }>
  >({
    global: { value: '', matchMode: FilterMatchMode.CONTAINS },
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const contextMenu = useRef<ContextMenu>(null);
  const toast = useRef(null);

  const dateTime = DateTime.now();
  const daysInMonth = dateTime.daysInMonth;
  const monthday = dateTime.day;
  const weekday = dateTime.weekday;

  const menuModel = [
    {
      label: 'Редактировать',
      icon: 'pi pi-fw pi-pencil',
      command: () => {
        setEditClients(selectedClient);
        setEditModalVisible(true);
      },
    },
    {
      label: 'Открыть в РК',
      icon: 'pi pi-fw pi-eye',
      command: () => {
        redirectToVK(selectedClient);
      },
    },
  ];

  const getClients = () => {
    TargetAPI.getClients().then((res) => {
      setClients(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    getClients();
  }, []);

  const redirectToVK = (client?: Client) => {
    if (!window) {
      return;
    }
    // @ts-ignore
    window.open(`https://vk.com/ads?act=office&union_id=${client.id}`, '_blank').focus();
  };

  const handleSubmit = useCallback(
    (values: FormikValues) => {
      if (editClient) {
        TargetAPI.updateClient(editClient.id, values).then(() => {
          getClients();
          setEditModalVisible(false);
          // @ts-ignore
          toast.current!.show({
            severity: 'success',
            detail: 'Сохранено!',
            life: 3000,
          });
        });
      }
    },
    [editClient],
  );

  const header = (
    <div className={css.table__header}>
      <div className={css.table__header_left}>
        <span>Последнее обновление: {dateTime.toFormat('d.LL HH:mm')}</span>
        <InputText
          className={css.table__header_search}
          type='text'
          onChange={(e) => {
            const value = e.target.value;
            const _filters = { ...filters };

            _filters['global'].value = value;

            setFilters(_filters);
          }}
          placeholder='Поиск...'
        />
      </div>
      <label title='Выбрать проекты, привязанные к сотруднику' className={css.table__header_right}>
        Сотрудник:
        <Dropdown
          value={user}
          className={css.table__header_employee}
          onChange={(e) => setUser(e.value)}
          options={clients}
          optionLabel='name'
          placeholder='Не выбран'
        />
      </label>
    </div>
  );

  const nameBodyTemplate = (client: Client) => {
    return (
      <Link target='_blank' href={`https://vk.com/ads?act=office&union_id=${client.id}`}>
        {client.name}
      </Link>
    );
  };

  const balanceBodyTemplate = (client: Client) => {
    return (
      <span>
        {client.balance.toLocaleString()} / {client.critical_balance.toLocaleString()}
      </span>
    );
  };
  const daySpentBodyTemplate = (client: Client) => {
    const daySpentPlan = Math.trunc(client.month_plan / daysInMonth);
    return (
      <span>
        {client.day_spent === null ? 0 : client.day_spent.toLocaleString()} /{' '}
        {daySpentPlan.toLocaleString()}
      </span>
    );
  };
  const daySpentAlert = (client: Client) => {
    const daySpentPlan = Math.trunc(client.month_plan / daysInMonth);
    const difference = Math.abs(daySpentPlan - client.day_spent) / daySpentPlan;
    return getAlertBackground(difference);
  };

  const weekSpentBodyTemplate = (client: Client) => {
    const weekSpentPlan = Math.trunc((client.month_plan / daysInMonth) * weekday);
    return (
      <span>
        {client.week_spent === null ? 0 : client.week_spent.toLocaleString()} /{' '}
        {weekSpentPlan.toLocaleString()}
      </span>
    );
  };
  const weekSpentAlert = (client: Client) => {
    const weekSpentPlan = Math.trunc((client.month_plan / daysInMonth) * weekday);
    const difference = Math.abs(weekSpentPlan - client.week_spent) / weekSpentPlan;
    return getAlertBackground(difference, { low: 0.15, middle: 0.3, height: 0.5 });
  };

  const monthSpentBodyTemplate = (client: Client) => {
    const monthSpentPlan = Math.trunc((client.month_plan / daysInMonth) * monthday);
    return (
      <span>
        {client.month_spent === null ? 0 : client.month_spent.toLocaleString()} /{' '}
        {monthSpentPlan.toLocaleString()}
      </span>
    );
  };
  const monthSpentAlert = (client: Client) => {
    const monthSpentPlan = Math.trunc((client.month_plan / daysInMonth) * monthday);
    const difference = Math.abs(monthSpentPlan - client.month_spent) / monthSpentPlan;
    return getAlertBackground(difference, { low: 0.07, middle: 0.13, height: 0.2 });
  };

  const needSpentBodyTemplate = (client: Client) => {
    const monthSpentPlan = Math.trunc((client.month_plan / daysInMonth) * monthday);
    if (monthSpentPlan < client.month_spent) {
      return '-';
    }
    const daySpentPlan = Math.trunc(client.month_plan / daysInMonth);
    const dayDifference = daysInMonth - monthday;
    const differencePlan = monthSpentPlan - client.month_spent;
    const required = dayDifference ? Math.trunc(differencePlan / dayDifference) : 0;

    return <span>{(daySpentPlan + required).toLocaleString()}</span>;
  };

  const needRequestBodyTemplate = (client: Client) => {
    const need = client.month_plan - client.month_spent - client.balance;
    return <span>{need > 0 ? need.toLocaleString() : '-'}</span>;
  };

  return (
    <div className={css.container}>
      {loading ? (
        <TableSkeleton rows={10} />
      ) : (
        <>
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
            scrollHeight='calc(100vh - 150px)'
            className={css.table}
            tableStyle={{
              borderCollapse: 'separate',
              alignItems: 'center',
            }}
            size='small'
            value={clients}
            showGridlines
            rows={clients?.length || 10}
            key='id'
            filters={filters}
            globalFilterFields={['name']}
            header={header}
            onContextMenu={(e) => contextMenu.current?.show(e.originalEvent)}
            contextMenuSelection={selectedClient}
            onContextMenuSelectionChange={(e) => setSelectedClients(e.value as Client)}
          >
            <Column body={nameBodyTemplate} header='Проект' style={{ maxWidth: '4rem' }} />
            <Column body={balanceBodyTemplate} header='Баланс' />
            <Column
              bodyClassName={daySpentAlert}
              body={daySpentBodyTemplate}
              header='Траты: день'
            />
            <Column
              bodyClassName={weekSpentAlert}
              body={weekSpentBodyTemplate}
              header='Траты: неделя'
            />
            <Column
              bodyClassName={monthSpentAlert}
              body={monthSpentBodyTemplate}
              header='Траты: месяц'
            />
            <Column field='month_plan' header='План' />
            <Column body={needSpentBodyTemplate} header='Докрут в день' />
            <Column body={needRequestBodyTemplate} header='Зачислить' />
          </DataTable>
        </>
      )}
    </div>
  );
};

type alertLevel = { low: number; middle: number; height: number };
const getAlertBackground = (
  difference: number,
  level: alertLevel = { low: 0.2, middle: 0.5, height: 0.7 },
) => {
  if (level.height < difference) {
    return css.alertBackground_danger;
  }
  if (level.middle < difference) {
    return css.alertBackground_warning;
  }
  if (level.low < difference) {
    return css.alertBackground_lowWarning;
  }
  return '';
};

export default BudgetCutsPage;
