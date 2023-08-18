import { Select, Space } from 'antd';
import { Link } from 'react-router-dom';
import { Logo } from '@shared/ui';

export const HeaderAppCategory = () => {
  return (
    <Space align='center' style={{ verticalAlign: 'middle' }} size={0}>
      <Link to='/'>
        <Logo />
      </Link>
      <Select
        size='large'
        defaultValue='target'
        style={{ width: '8rem', fontWeight: 600 }}
        bordered={false}
        options={[
          { value: 'target', label: 'Target' },
          { value: 'content', label: 'Content' },
          { value: 'admin', label: 'Admin' },
        ]}
      />
    </Space>
  );
};
