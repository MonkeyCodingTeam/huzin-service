import { Typography } from 'antd';
import { ChangeEvent, useState } from 'react';
import { Client, ClientUpdateReq, useUpdateClientMutation } from '@entities/client';
import { User } from '@entities/user';
import { useToggleWatcherMutation } from '@features/budgetCuts';
import { SearchInput } from '@shared/ui';
import { Transition } from '@shared/ui/Transition';
import { BudgetCutsEditModal, BudgetCutsTable, BudgetCutsUserSelect } from '@widgets/budgetCuts';
import css from './BudgetCutsPage.module.scss';

const { Text } = Typography;

const BudgetCutsPage = () => {
  const [toggle, { isLoading: toggleIsLoading }] = useToggleWatcherMutation();
  const [update, { isLoading: updateIsLoading }] = useUpdateClientMutation();
  const [keyword, setKeyword] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();
  const [editedClient, setEditedClient] = useState<Client>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const handleSelect = (userId: number | undefined) => {
    setSelectedUserId(userId);
  };

  const handleWatch = (client: Client, user: User) => {
    toggle({ clientId: client.id, userId: user.id });
  };

  const handleEdit = (client: Client) => {
    setEditedClient(client);
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditedClient(undefined);
  };

  const handleModalSubmit = (payload: ClientUpdateReq) => {
    update(payload);
    handleModalCancel();
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
          handleWatch={handleWatch}
          isUpdating={toggleIsLoading || updateIsLoading}
        />
      </section>
      <BudgetCutsEditModal
        editedClient={editedClient}
        open={isModalOpen}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
      />
    </Transition>
  );
};

export default BudgetCutsPage;
