import { ConfigProvider, Empty } from 'antd';
import { ConfigProviderProps } from 'antd/es/config-provider';
import { FC } from 'react';

const customizeRenderEmpty = () => (
  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'Нет данных'}></Empty>
);

export const AntdProvider: FC<ConfigProviderProps> = (props) => {
  const { children, ...rest } = props;
  return (
    <ConfigProvider renderEmpty={customizeRenderEmpty} {...rest}>
      {children}
    </ConfigProvider>
  );
};
