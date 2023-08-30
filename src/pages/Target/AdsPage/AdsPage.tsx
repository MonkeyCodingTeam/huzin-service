import { ClientAdsTable } from '@feature/ads';
import { useEffect, useState } from 'react';
import { Client, ClientAPI } from '@entities/client';

export const AdsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ClientAPI.getClients({ with: ['ads'] })
      .then(({ data }) => {
        setClients(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return <ClientAdsTable clients={clients} loading={loading} />;
};
