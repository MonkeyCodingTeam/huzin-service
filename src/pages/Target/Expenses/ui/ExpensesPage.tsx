import { Divider, Typography } from 'antd';
import { ChangeEvent, useState } from 'react';
import { Client, ExpensesTable } from '@entities/client';
import { EditButton, WatchButton } from '@features/client';
import { useAppSelector } from '@shared/lib';
import { SearchInput } from '@shared/ui';
import { Transition } from '@shared/ui/Transition';
import { ExpensesEditModal, ExpensesUserSelect } from 'widgets/expenses';
import css from './ExpensesPage.module.scss';

const { Text } = Typography;

const ExpensesPage = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();
  const [client, setClient] = useState<Client>();
  const user = useAppSelector((state) => state.user);

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const handleSelect = (userId: number | undefined) => {
    setSelectedUserId(userId);
  };

  const handleCancel = () => {
    setClient(undefined);
  };

  const actionsColumn = (client: Client) => {
    return (
      <>
        <EditButton handleEdit={() => setClient(client)} client={client} />
        <Divider type='vertical' style={{ margin: '2px' }} />
        <WatchButton client={client} user={user} />
      </>
    );
  };

  return (
    <Transition className={css.budgetCutsPage}>
      <section className={css.budgetCutsPage__filters}>
        <div className={css.budgetCutsPage__filter}>
          <Text className={css.budgetCutsPage__text}>Клиент:</Text>
          <SearchInput handleValueChange={handleValueChange} />
        </div>
        <div className={css.budgetCutsPage__filter}>
          <Text className={css.budgetCutsPage__text}>Сотрудник:</Text>
          <ExpensesUserSelect onSelect={handleSelect} />
        </div>
      </section>
      <section className={css.budgetCutsPage__table}>
        <ExpensesTable
          selectedUser={selectedUserId}
          clientSearch={keyword}
          actions={actionsColumn}
        />
      </section>
      <ExpensesEditModal client={client} onCancel={handleCancel} />
    </Transition>
  );
};

export default ExpensesPage;
