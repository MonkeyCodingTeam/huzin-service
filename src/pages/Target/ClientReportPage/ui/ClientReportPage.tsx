import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { CompanyTemplate } from '@shared/lib/api/target/types';
import { setCookie } from '@shared/lib/util';
import { Client } from '@entities/client';
import { GuestAPI } from '@shared/lib/api/target/guest';
import { GuestStatsTable } from '@pages/Target/ClientReportPage/ui/GuestStatsTable';
import { Loader } from '@shared/ui';
import css from './ClientReportPage.module.scss';

interface ClientReportParams extends Record<string, string> {
  clientId: string;
  token: string;
}

const ClientReportPage = () => {
  const { clientId = '', token = '' } = useParams<ClientReportParams>();
  const [companyTemplates, setCompanyTemplates] = useState<CompanyTemplate[]>();
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

    GuestAPI.getCompanyTemlpates().then((res) => {
      setCompanyTemplates(res.data);
    });
  }, [clientId, token]);

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
        <GuestStatsTable client={client} />
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
          <GuestStatsTable client={client} company_template={template} />
        </div>
      ))}
    </div>
  );
};
export default ClientReportPage;
