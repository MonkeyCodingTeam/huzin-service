import { Typography } from 'antd';
import { ChangeEvent, useState } from 'react';
import { Client } from '@entities/client';
import { SearchInput } from '@shared/ui';
import { Transition } from '@shared/ui/Transition';
import { BudgetCutsEditModal, BudgetCutsTable, BudgetCutsUserSelect } from '@widgets/budgetCuts';
import css from './BudgetCutsPage.module.scss';

const { Text } = Typography;

const BudgetCutsPage = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();
  const [client, setClient] = useState<Client>();

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const handleSelect = (userId: number | undefined) => {
    setSelectedUserId(userId);
  };

  const handleEdit = (client: Client) => {
    setClient(client);
  };

  const handleCancel = () => {
    setClient(undefined);
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
      <section className={css.budgetCutsPage__table}>
        <BudgetCutsTable
          selectedUser={selectedUserId}
          clientSearch={keyword}
          handleEdit={handleEdit}
        />
      </section>
      <BudgetCutsEditModal client={client} onCancel={handleCancel} />
    </Transition>
  );
};

export default BudgetCutsPage;
