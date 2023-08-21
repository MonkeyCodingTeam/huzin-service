import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { CompanyTemplate } from '@shared/lib/api/target/types';
import { setCookie } from '@shared/lib/util';
import { Client, ClientsStatisticResponse } from '@entities/client';
import { GuestAPI } from '@shared/lib/api/target/guest';
import { GuestStatsTable } from '@pages/Target/ClientReportPage/ui/GuestStatsTable';
import { Loader } from '@shared/ui';
import css from './ClientReportPage.module.scss';
import { DateTime } from 'luxon';

interface ClientReportParams extends Record<string, string> {
  clientId: string;
  token: string;
}

const monthCount = 6;

const ClientReportPage = () => {
  const { clientId = '', token = '' } = useParams<ClientReportParams>();
  const [companyTemplates, setCompanyTemplates] = useState<CompanyTemplate[]>();
  const [stats, setStats] = useState<ClientsStatisticResponse[]>([]);
  const [client, setClient] = useState<Client>();
  const navigate = useNavigate();

  useEffect(() => {
    setCookie('guest_client', clientId);
    setCookie('guest_token', token);

    GuestAPI.getClient(+clientId)
      .then((res) => {
        setClient(res.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate('/');
        }
      });

    GuestAPI.getCompanyStats(+clientId, {
      date_from: DateTime.now().minus({ month: monthCount - 1 }),
      date_to: DateTime.now(),
      period: 'month',
    }).then(({ data }) => {
      setStats(data);
    });

    GuestAPI.getCompanyTemlpates(+clientId).then((res) => {
      setCompanyTemplates(res.data);
    });
  }, []);

  if (!client) {
    return <Loader />;
  }

  return (
    <div className={css.container}>
      <div className={css.container__header}>
        <div className={css.container__header__info}>
          <p>{client?.name}</p>
          <p>
            Баланс: <b>{client.balance}₽</b>
          </p>
          <p>
            Критический остаток: <b>{client.critical_balance}₽</b>
          </p>
        </div>
      </div>
      <div className={css.container__card}>
        <p className={css.container__card__title}>Общая статистика</p>
        <GuestStatsTable client={client} stats={stats} />
      </div>
      <h1>Рекламные компании:</h1>
      {companyTemplates?.map((template) => (
        <div key={template.id} className={css.container__card}>
          <p
            className={css.container__card__title}
            title={template.tags.reduce((prev, tag) => (prev += `${tag.tag}\n`), '')}
          >
            {template.name}
          </p>
          <GuestStatsTable client={client} companyTemplate={template} stats={stats} />
        </div>
      ))}

      <div className={css.container__card}>
        <p className={css.container__card__title} title={'Другие компании'}>
          Другие компании
        </p>
        <GuestStatsTable client={client} companyTemplate={null} stats={stats} />
      </div>
    </div>
  );
};
export default ClientReportPage;
