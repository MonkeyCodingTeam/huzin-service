import { Flex, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { ClientStatsReq, useLazyGetGuestClientQuery } from '@entities/client';
import { PeriodRadio } from '@features/client';
import { setCookie } from '@shared/lib';
import { Transition } from '@shared/ui/Transition';
import { GuestStatsTables } from '@widgets/guestStats';
import css from './GuestStatsPage.module.scss';

const { Text } = Typography;

const GuestStatsPage = () => {
  const { clientId = '', token = '' } = useParams();
  const [getClient, { data: client }] = useLazyGetGuestClientQuery();
  const [period, setPeriod] = useState<ClientStatsReq['period']>('week');

  useEffect(() => {
    if (!clientId || !token) return;
    setCookie('guest_client', clientId);
    setCookie('guest_token', token);
    getClient({ clientId: +clientId });
  }, [clientId]);

  return (
    <Transition className={css.guestStatsPage}>
      <section className={css.guestStatsPage__options}>
        <Flex gap={6}>
          <Text strong className={css.guestStatsPage__text}>
            Клиент:
          </Text>
          <Text className={css.guestStatsPage__text}>{client?.name}</Text>
        </Flex>
        <Flex gap={6}>
          <Text strong className={css.guestStatsPage__text}>
            Баланс:
          </Text>
          <Text className={css.guestStatsPage__text}>
            {client?.balance.toLocaleString()} / {client?.critical_balance.toLocaleString()}
          </Text>
        </Flex>
      </section>
      <section className={css.guestStatsPage__options} style={{ position: 'relative' }}>
        <Flex gap={6}>
          <Text strong className={css.guestStatsPage__text}>
            Период:
          </Text>
          <PeriodRadio onPeriodChange={setPeriod} period={period} />
        </Flex>
      </section>
      <section id={'tables'}>
        <GuestStatsTables client={client} period={period} />
      </section>
    </Transition>
  );
};

export default GuestStatsPage;
