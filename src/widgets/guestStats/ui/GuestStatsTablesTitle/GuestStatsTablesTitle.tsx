import { Flex, Spin, Typography } from 'antd';
import { FC } from 'react';
import css from './GuestStatsTablesTitle.module.scss';

const { Text } = Typography;

interface Props {
  marginBottom?: string;
  isLoading?: boolean;
  title: string;
}

export const GuestStatsTablesTitle: FC<Props> = ({ marginBottom, isLoading, title }) => {
  return (
    <Flex justify={'space-between'} align={'center'}>
      <Text
        strong
        className={css.guestTableTitle}
        style={{ marginBottom: marginBottom ? `${marginBottom}` : 0 }}
      >
        {title}
      </Text>
      {isLoading && <Spin />}
    </Flex>
  );
};
