import { Typography } from 'antd';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import css from './ClientInfo.module.scss';

const { Title, Text } = Typography;
const VK_URL = 'https://vk.com/ads?act=office&union_id=';

interface Props {
  children?: ReactNode;
}

export const ClientInfo = ({ children }: Props) => {
  const client = useSelector((state: RootState) => state.selectedClient);
  return (
    <div className={css.clientInfo}>
      <div className={css.clientInfo__container}>
        <div>
          <Title
            className={css.clientInfo__title}
            level={4}
            style={{ margin: 0 }}
            onClick={() => window.open(VK_URL + client.id, '_blank')}
          >
            {client.name}
          </Title>
          <Text>id: {client.id}</Text>
        </div>
        <Text>Ссылка на отчет</Text>
      </div>
      {children}
    </div>
  );
};
