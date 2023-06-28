import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { ClientsStatisticResponse, CompanyTemplate } from '@shared/lib/api/target/types';
import { setCookie } from '@shared/lib/util';
import { Client } from '@entities/client';
import { GuestAPI } from '@shared/lib/api/target/guest';
import { GuestStatsTable } from '@pages/Target/ClientReportPage/ui/GuestStatsTable';
import { Loader } from '@shared/ui';
import css from './ClientReportPage.module.scss';
import { Company } from '@entities/company';
import { DateTime } from 'luxon';
import { groupStatsByPeriod } from '@shared/lib/util/groupStatsByPeriod';

interface ClientReportParams extends Record<string, string> {
  clientId: string;
  token: string;
}

const monthCount = 6;

const ClientReportPage = () => {
  const { clientId = '', token = '' } = useParams<ClientReportParams>();
  const [stats, setStats] = useState<ClientsStatisticResponse>();
  const [companyTemplates, setCompanyTemplates] = useState<CompanyTemplate[]>();
  const [companies, setCompanies] = useState<Company[]>();
  const [client, setClient] = useState<Client>();
  const [isLoading, setIsLoading] = useState(true);
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
      metrics: ['base', 'uniques'],
    })
      .then((res) => {
        setStats(res.data);
      })
      .finally(() => {
        GuestAPI.getCompanies(+clientId)
          .then((res) => {
            setCompanies(res.data);
          })
          .finally(() => {
            setIsLoading(false);
          });
      });

    GuestAPI.getCompanyTemlpates().then((res) => {
      setCompanyTemplates(res.data);
    });
  }, [clientId, token]);

  if (!client) {
    return <Loader />;
  }

  const getCompanyStats = (companyTemplate: CompanyTemplate) => {
    if (!stats) return;

    const companyStats = { ...stats };
    const templatedCompanies = companies?.filter((company) =>
      companyTemplate.tags.some((template) => {
        const regex = new RegExp(`${template.tag}\\W+`);
        return company.name.toLowerCase().match(regex);
      }),
    );

    companyStats.items = companyStats.items.filter((item) =>
      templatedCompanies?.some((company) => company.id === item.id),
    );

    return groupStatsByPeriod(companyStats, 'month');
  };

  return isLoading ? (
    <Loader />
  ) : (
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
        <GuestStatsTable
          client={client}
          stats={groupStatsByPeriod(stats, 'month')}
          monthCount={monthCount}
        />
      </div>
      <h1>Рекламные компании:</h1>
      {companyTemplates?.map((template) => (
        <div key={template.id} className={css.container__card}>
          <p className={css.container__card__title}>{template.name}</p>
          <GuestStatsTable
            client={client}
            stats={getCompanyStats(template) ?? []}
            company_template={template}
            monthCount={monthCount}
          />
        </div>
      ))}
    </div>
  );
};
export default ClientReportPage;
