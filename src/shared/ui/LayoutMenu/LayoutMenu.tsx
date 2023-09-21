import {
  DollarOutlined,
  MonitorOutlined,
  ProjectOutlined,
  SettingOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import { Layout, Menu, type MenuProps } from 'antd';
import { type FC, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { HeaderAppCategory } from '@shared/ui';
import css from './LayoutMenu.module.scss';

const { Sider, Header, Footer, Content } = Layout;

const items: MenuProps['items'] = [
  {
    label: <Link to='/client-stats'>Клиенты</Link>,
    key: 'clients',
    icon: <ProjectOutlined rev={undefined} />,
  },
  {
    label: <Link to='/senler-stats'>Senler</Link>,
    key: 'senler',
    icon: <SolutionOutlined rev={undefined} />,
  },
  {
    label: 'Открут',
    key: 'budget',
    icon: <MonitorOutlined rev={undefined} />,
  },
  {
    label: 'Счета',
    key: 'invoice',
    icon: <DollarOutlined rev={undefined} />,
  },
  {
    label: 'Настройки',
    key: 'settings',
    icon: <SettingOutlined rev={undefined} />,
  },
];

interface Props {
  profileBlock?: ReactNode;
}

export const LayoutMenu: FC<Props> = ({ profileBlock }) => {
  return (
    <>
      <Header className={css.menu__desktop}>
        <HeaderAppCategory />
        <Menu style={{ width: '100%' }} theme='light' mode='horizontal' items={items} />
        {profileBlock}
      </Header>
      <Layout className={css.menu__mobile}>
        <Sider
          className={css.menu__mobile__aside}
          breakpoint='lg'
          collapsedWidth='0'
          reverseArrow={true}
        >
          <Layout>
            <Header style={{ backgroundColor: 'white' }}>
              <HeaderAppCategory />
            </Header>
            <Content>
              <Menu theme='light' mode='inline' items={items} />
            </Content>
            <Footer style={{ alignItems: 'end' }}>{profileBlock}</Footer>
          </Layout>
        </Sider>
      </Layout>
    </>
  );
};
