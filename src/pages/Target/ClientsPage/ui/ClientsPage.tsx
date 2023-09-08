import { useState } from 'react';
import { useGetClientsQuery } from '@entities/client';
import { ClientsFilter } from '@features/filters';
import { StatsTable } from 'widgets/StatsTable';

const ClientsPage = () => {
  const [selectedClient, setSelectedClient] = useState(0);

  const { isLoading: isClientLoading, isError, data } = useGetClientsQuery(null);

  if (isClientLoading) console.log('is loading');
  if (isError) console.log('error occurred');

  const onSelect = (clientId: number) => {
    setSelectedClient(clientId);
  };

  return (
    <>
      <ClientsFilter clients={data ? data : []} onSelect={onSelect} />
      {selectedClient ? <StatsTable clientId={selectedClient} /> : <p>no data</p>}
    </>
  );
};

export default ClientsPage;
