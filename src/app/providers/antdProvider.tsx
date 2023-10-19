import { App, ConfigProvider, Empty } from 'antd';
import { ConfigProviderProps } from 'antd/es/config-provider';
import ru from 'antd/locale/ru_RU';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { FC } from 'react';

dayjs.locale('ru');

const customizeRenderEmpty = () => (
  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'Нет данных'}></Empty>
);

export const AntdProvider: FC<ConfigProviderProps> = (props) => {
  const { children, ...rest } = props;
  return (
    <ConfigProvider locale={ru} renderEmpty={customizeRenderEmpty} {...rest}>
      <App message={{ maxCount: 1 }}>{children}</App>
    </ConfigProvider>
  );
};
