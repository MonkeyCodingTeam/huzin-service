import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { useAppSelector } from '@shared/lib/redux';
import { AccountantTable } from './AccountantTable';
import { ManagerTable } from './ManagerTable';

const InvoicePage = () => {
  const user = useAppSelector((state) => state.user);

  const toast = useRef<Toast>(null);

  const page = () => {
    if (user.roles.find((role) => role.slug === 'admin' || role.slug === 'accountant')) {
      return <AccountantTable toast={toast} />;
    }
    return <ManagerTable toast={toast} user={user} />;
  };

  return (
    <>
      <Toast ref={toast} />
      {page()}
    </>
  );
};

export default InvoicePage;
