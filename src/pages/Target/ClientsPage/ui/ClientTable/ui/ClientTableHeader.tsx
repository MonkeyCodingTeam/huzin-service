import { Client } from '@entities/client';
import { ClientAPI, CompanyTemplateAPI } from '@shared/lib/api';
import { FC, useEffect, useState } from 'react';
import { Company } from '@entities/company';
import { CompanyTemplate } from '@shared/lib/api/target/types';
import { SelectButton } from 'primereact/selectbutton';
import classNames from 'classnames';

interface ClientTableHeaderProps {
  client: Client;
  className?: string;
}

export const ClientTableHeader: FC<ClientTableHeaderProps> = ({ client, className = '' }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<CompanyTemplate>();
  const [companyTemplate, setCompanyTemplate] = useState<CompanyTemplate[]>([]);

  useEffect(() => {
    CompanyTemplateAPI.getAll().then((res) => {
      setCompanyTemplate(res.data);
    });
  }, []);

  useEffect(() => {
    if (client.id) {
      ClientAPI.getCompanies(client.id).then((res) => {
        setCompanies(res.data);
      });
    }
  }, [client]);

  return (
    <div className={classNames(className)}>
      <SelectButton
        value={selectedTemplate}
        options={companyTemplate}
        onChange={(e) => setSelectedTemplate(e.value)}
        optionLabel='name'
      />
    </div>
  );
};
