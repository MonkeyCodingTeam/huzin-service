import { ClientSelect, ClientStatsTable } from 'widgets/client';

const ClientsPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex' }}>
        <ClientSelect />
      </div>
      <ClientStatsTable />
    </div>
  );
};

export default ClientsPage;
