import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import { useSelector } from 'react-redux';
import { useDeleteGroupMutation } from '@features/group';

export const GroupDelete = () => {
  const client = useSelector((state: RootState) => state.selectedClient);
  const [deleteGroup] = useDeleteGroupMutation();
  return (
    <Popconfirm
      title='Удаление группы'
      description='Вы уверены что хотите удалить группу?'
      okText='Да'
      cancelText='Нет'
      placement='bottomRight'
      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
      onConfirm={() => {
        deleteGroup(client);
      }}
    >
      <Button type='text' danger icon={<DeleteOutlined />} />
    </Popconfirm>
  );
};
