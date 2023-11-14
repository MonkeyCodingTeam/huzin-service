import { Flex, Typography } from 'antd';
import { FC } from 'react';
import css from './GuestStatsTablesTitle.module.scss';

const { Text } = Typography;

interface Props {
  marginBottom?: string;
  title: string;
}

export const GuestStatsTablesTitle: FC<Props> = ({ marginBottom = '0', title }) => {
  return (
    <Flex justify={'space-between'} align={'center'}>
      <Text strong className={css.guestTableTitle} style={{ marginBottom: marginBottom }}>
        {title}
      </Text>
    </Flex>
  );
};
