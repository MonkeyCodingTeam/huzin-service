import { Typography } from 'antd';
import { ChangeEvent, useState } from 'react';
import { Client } from '@entities/client';
import { User } from '@entities/user';
import { useToggleWatcherMutation } from '@features/budgetCuts';
import { SearchInput } from '@shared/ui';
import { Transition } from '@shared/ui/Transition';
import { BudgetCutsEditModal, BudgetCutsUserSelect } from '@widgets/budgetCuts';
import { BudgetCutsTable } from '@widgets/budgetCuts/BudgetCutsTable/ui/BudgetCutsTable/BudgetCutsTable';
import css from './BudgetCutsPage.module.scss';

const { Text } = Typography;

const BudgetCutsPage = () => {
  const [toggle] = useToggleWatcherMutation();
  const [keyword, setKeyword] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [editedClient, setEditedClient] = useState<Client>();

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const handleSelect = (userId: number) => {
    setSelectedUserId(userId);
  };

  const handleWatch = (client: Client, user: User) => {
    toggle({ clientId: client.id, userId: user.id });
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
          <BudgetCutsUserSelect onSelect={handleSelect} />
        </div>
      </section>
      <BudgetCutsEditModal editedClient={editedClient} cancelEdit={setEditedClient} />
      <section className={css.budgetCutsPage__table}>
        <BudgetCutsTable
          selectedUser={selectedUserId}
          clientSearch={keyword}
          handleEdit={setEditedClient}
          handleWatch={handleWatch}
        />
      </section>
    </Transition>
  );
};

export default BudgetCutsPage;
