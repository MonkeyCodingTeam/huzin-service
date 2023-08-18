import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Layout, Menu, type MenuProps } from 'antd';
import { type FC, type ReactNode } from 'react';
import { HeaderAppCategory } from '@shared/ui';
import css from './LayoutMenu.module.scss';

const { Sider, Header, Footer, Content } = Layout;

const items: MenuProps['items'] = [
  {
    label: 'Navigation One',
    key: 'mail',
    icon: <MailOutlined rev={undefined} />,
  },
  {
    label: 'Navigation Two',
    key: 'app',
    icon: <AppstoreOutlined rev={undefined} />,
    disabled: true,
  },
  {
    label: 'Navigation Three - Submenu',
    key: 'SubMenu',
    icon: <SettingOutlined rev={undefined} />,
  },
  {
    label: (
      <a href='https://ant.design' target='_blank' rel='noopener noreferrer'>
        Navigation Four - Link
      </a>
    ),
    key: 'alipay',
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
              <Menu theme='light' mode='inline' defaultSelectedKeys={['4']} items={items} />
            </Content>
            <Footer style={{ alignItems: 'end' }}>{profileBlock}</Footer>
          </Layout>
        </Sider>
      </Layout>
    </>
  );
};
