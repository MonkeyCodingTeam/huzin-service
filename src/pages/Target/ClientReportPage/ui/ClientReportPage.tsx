import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { CompanyTemplate } from '@shared/lib/api/target/types';
import { setCookie } from '@shared/lib/util';
import { Client, ClientsStatisticResponse, GetStatisticByCompaniesProps } from '@entities/client';
import { GuestAPI } from '@shared/lib/api/target/guest';
import { GuestStatsTable } from '@pages/Target/ClientReportPage/ui/GuestStatsTable';
import { TableSkeleton } from '@shared/ui';
import css from './ClientReportPage.module.scss';
import type { RadioChangeEvent } from 'antd';
import { Radio, Typography } from 'antd';
import { DateTime } from 'luxon';

interface ClientReportParams extends Record<string, string> {
  clientId: string;
  token: string;
}

const monthCount = 6;

const ClientReportPage = () => {
  const { Title } = Typography;

  const { clientId = '', token = '' } = useParams<ClientReportParams>();
  const [companyTemplates, setCompanyTemplates] = useState<CompanyTemplate[]>();
  const [stats, setStats] = useState<ClientsStatisticResponse[]>([]);
  const [client, setClient] = useState<Client>();
  const [loading, setLoading] = useState({
    client: true,
    stats: true,
    templates: true,
  });

  const [isStatsLoading, setIsStatsLoading] = useState(false);

  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const navigate = useNavigate();

  const statsPayload: GetStatisticByCompaniesProps = (() => {
    if (period === 'week') {
      return {
        date_from: DateTime.now().minus({ week: 4 }),
        date_to: DateTime.now().minus({ week: 1 }),
        period: 'week',
      };
    }
    return {
      date_from: DateTime.now().minus({ month: monthCount - 1 }),
      date_to: DateTime.now(),
      period: 'month',
    };
  })();

  const handleRadioChange = (e: RadioChangeEvent) => {
    setPeriod(e.target.value);
  };

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
      })
      .finally(() => {
        setLoading((prevState) => {
          prevState.client = false;
          return prevState;
        });
      });

    GuestAPI.getCompanyTemplates(+clientId)
      .then((res) => {
        setCompanyTemplates(res.data);
      })
      .finally(() => {
        setLoading((prevState) => {
          prevState.templates = false;
          return prevState;
        });
      });
  }, []);

  useEffect(() => {
    setIsStatsLoading(true);
    GuestAPI.getCompanyStats(+clientId, statsPayload)
      .then(({ data }) => {
        setStats(data);
      })
      .finally(() => {
        setIsStatsLoading(false);
        setLoading((prevState) => {
          prevState.stats = false;
          return prevState;
        });
      });
  }, [period]);

  if (!client || loading.stats || loading.client || loading.templates) {
    return <TableSkeleton />;
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

      <div>
        <Title level={5}>Отчет по:</Title>
        <Radio.Group onChange={handleRadioChange} defaultValue={period}>
          <Radio.Button value='week'>Неделям</Radio.Button>
          <Radio.Button value='month'>Месяцам</Radio.Button>
          {/*<Radio.Button value="year" disabled>Годовой отчет</Radio.Button>*/}
        </Radio.Group>
      </div>

      {isStatsLoading ? (
        <TableSkeleton />
      ) : (
        <>
          <div className={css.container__card}>
            <p className={css.container__card__title}>Общая статистика</p>
            <GuestStatsTable client={client} stats={stats} statsPayload={statsPayload} />
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
              <GuestStatsTable
                client={client}
                companyTemplate={template}
                stats={stats}
                statsPayload={statsPayload}
              />
            </div>
          ))}

          <div className={css.container__card}>
            <p className={css.container__card__title} title={'Другие компании'}>
              Другие компании
            </p>
            <GuestStatsTable
              client={client}
              withoutTemplate={true}
              stats={stats}
              statsPayload={statsPayload}
            />
          </div>
        </>
      )}
    </div>
  );
};
export default ClientReportPage;
