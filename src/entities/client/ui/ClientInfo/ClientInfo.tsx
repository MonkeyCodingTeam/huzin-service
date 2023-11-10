import { Badge, Tooltip, Typography } from 'antd';
import { FC, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import css from './ClientInfo.module.scss';

const { Title, Text } = Typography;
const VK_URL = 'https://vk.com/ads?act=office&union_id=';

interface Props {
  children?: ReactNode;
}

export const ClientInfo: FC<Props> = ({ children }) => {
  const client = useSelector((state: RootState) => state.selectedClient);

  return (
    <div className={css.clientInfo}>
      <div className={css.clientInfo__container}>
        <Title className={css.clientInfo__title} level={4} style={{ margin: 0 }}>
          <a href={VK_URL + client.id} target='_blank' rel='noreferrer'>
            {client.name}
          </a>
        </Title>

        {!client.entrepreneur ? (
          <Tooltip placement='rightBottom' title={'Необходимо перейти в РК и указать организацию'}>
            <Badge status={'error'} text={'Организация отсутствует'} />
          </Tooltip>
        ) : (
          <Text>Организация: {client.entrepreneur}</Text>
        )}

        <Text>
          <a href={`/guest-stats/${client.id}/${client.token}`} target='_blank' rel='noreferrer'>
            Ссылка на отчет
          </a>
        </Text>
      </div>
      {children}
      <Text className={css.clientInfo__secondaryText} type='secondary'>
        id: {client.id}
      </Text>
    </div>
  );
};
