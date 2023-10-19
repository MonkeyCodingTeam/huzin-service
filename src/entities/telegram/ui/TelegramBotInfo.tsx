import { App, Badge, Tooltip, Typography } from 'antd';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { TelegramIcon } from '@shared/ui/Icons/TelegramIcon';
import css from './TelegramBotInfo.module.scss';

const { Text } = Typography;

export const TelegramBotInfo = () => {
  const { message } = App.useApp();
  const client = useSelector((state: RootState) => state.selectedClient);

  const handleOnClick = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.info(`Текст: ${text} скопирован`);
    });
  };

  return (
    <div className={css.telegram}>
      <Tooltip
        title={client.has_telegram ? 'Бот подключен' : 'Бот не подключен'}
        placement='bottomLeft'
      >
        <div className={css.telegram__imageContainer}>
          <TelegramIcon
            className={classNames(css.telegram__icon, {
              [css.telegram__icon_active]: client.has_telegram,
            })}
          />
          <div className={css.telegram__status}>
            <Badge status={client.has_telegram ? 'success' : 'warning'} />
            <Text>Бот</Text>
          </div>
        </div>
      </Tooltip>

      <div className={css.telegram__container}>
        <div className={css.telegram__element}>
          <Text>Telegram Бот:</Text>
          <Text
            className={classNames(css.telegram__text, css.telegram__copyText)}
            onClick={() => handleOnClick('huzin_notify_bot')}
          >
            huzin_notify_bot
          </Text>
        </div>

        <div className={css.telegram__element}>
          <Text>Добавление бота:</Text>
          <Text
            className={classNames(css.telegram__text, css.telegram__copyText)}
            onClick={() => handleOnClick(`/register ${client.id}`)}
          >
            /register {client.id}
          </Text>
        </div>

        <div className={css.telegram__element}>
          <Text>Удаление бота:</Text>
          <Text
            className={classNames(css.telegram__text, css.telegram__copyText)}
            onClick={() => handleOnClick(`/forget ${client.id}`)}
          >
            /forget {client.id}
          </Text>
        </div>
      </div>
    </div>
  );
};
