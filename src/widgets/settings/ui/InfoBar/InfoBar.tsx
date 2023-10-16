import { Typography } from 'antd';
import { useSelector } from 'react-redux';
import telegram_active from '@shared/assets/telegram-active.svg';
import telegram from '@shared/assets/telegram.svg';
import css from './InfoBar.module.scss';

const { Title, Text } = Typography;
const VK_URL = 'https://vk.com/ads?act=office&union_id=';

const handleOnClick = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    console.log(text, 'copied');
  });
};

export const InfoBar = () => {
  const client = useSelector((state: RootState) => state.selectedClient);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div>
          <Title
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

      <div className={css.infoBar__section}>
        <img
          className={css.infoBar__image}
          src={client.has_telegram ? telegram_active : telegram}
          alt='telegram icon'
          title='Телеграм подключен'
        />
        <div className={css.infoBar__element}>
          <Text>
            Telegram Бот:
            <Text
              className={css.infoBar__copyText}
              onClick={() => handleOnClick('huzin_notify_bot')}
            >
              huzin_notify_bot
            </Text>
          </Text>
          <Text>
            Добавление бота:
            <Text
              className={css.infoBar__copyText}
              onClick={() => handleOnClick(`/register ${client.id}`)}
            >
              /register {client.id}
            </Text>
          </Text>
          <Text>
            Удаление бота:
            <Text
              className={css.infoBar__copyText}
              onClick={() => handleOnClick(`/forget ${client.id}`)}
            >
              /forget {client.id}
            </Text>
          </Text>
        </div>
      </div>
    </div>
  );
};
