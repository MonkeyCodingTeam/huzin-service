import { InputNumber, Modal, Tooltip, Typography } from 'antd';
import { FC, useEffect, useState } from 'react';
import { Client, useUpdateClientMutation } from '@entities/client';
import css from './BudgetCutsEditModal.module.scss';

const { Text } = Typography;

interface Props {
  editedClient?: Client;
  cancelEdit: (client: undefined) => void;
}

const initPayload = {
  id: 0,
  month_plan: 0,
  critical_balance: 0,
  budget_adjustment: 0,
};

export const BudgetCutsEditModal: FC<Props> = ({ editedClient, cancelEdit }) => {
  const [update, { isLoading, error }] = useUpdateClientMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payload, setPayload] = useState(initPayload);

  const handleCancel = () => {
    cancelEdit(undefined);
    setIsModalOpen(false);
    setPayload(initPayload);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    update(payload);
    cancelEdit(undefined);
    setPayload(initPayload);
  };

  const handleChange = (value: number | null, fieldName: string) => {
    setPayload({ ...payload, [fieldName]: value ? value : 0 });
  };

  useEffect(() => {
    if (editedClient) {
      setPayload({
        id: editedClient.id,
        month_plan: editedClient.month_plan,
        critical_balance: editedClient.critical_balance,
        budget_adjustment: editedClient.budget_adjustment,
      });
      setIsModalOpen(true);
    }
  }, [editedClient]);

  console.log(editedClient);
  console.log(payload, isLoading, error);

  return (
    <Modal title={editedClient?.name} open={isModalOpen} onCancel={handleCancel} onOk={handleOk}>
      <div className={css.modalBody}>
        <div className={css.modalBody__content}>
          <Text className={css.modalBody__text}>План на месяц</Text>
          <Tooltip placement='topLeft' title={'Введите плановую сумму расходов'}>
            <InputNumber
              className={css.modalBody__input}
              onChange={(value) => handleChange(value, 'month_plan')}
              value={payload.month_plan}
              placeholder={'Введите плановую сумму расходов'}
              controls={false}
            />
          </Tooltip>
        </div>
        <div className={css.modalBody__content}>
          <Text className={css.modalBody__text}>Критический остаток</Text>
          <Tooltip placement='topLeft' title={'Введите критический остаток'}>
            <InputNumber
              onChange={(value) => handleChange(value, 'critical_balance')}
              className={css.modalBody__input}
              value={payload.critical_balance}
              placeholder={'Введите критический остаток'}
              controls={false}
            />
          </Tooltip>
        </div>
        <div className={css.modalBody__content}>
          <Text className={css.modalBody__text}>Корректировка бюджета</Text>
          <Tooltip placement='topLeft' title={'Введите корректировку +/-'}>
            <InputNumber
              className={css.modalBody__input}
              onChange={(value) => handleChange(value, 'budget_adjustment')}
              value={payload.budget_adjustment}
              placeholder={'Введите корректировку'}
              controls={false}
            />
          </Tooltip>
        </div>
      </div>
    </Modal>
  );
};
