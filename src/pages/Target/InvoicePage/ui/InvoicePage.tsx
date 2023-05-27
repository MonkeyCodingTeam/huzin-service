import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { useAppSelector } from '@shared/lib/redux';
import { AccountantTable } from './AccountantTable';

const InvoicePage = () => {
  const user = useAppSelector((state) => state.user);

  const toast = useRef<Toast>(null);

  return (
    <>
      <Toast ref={toast} />
      {/*<ManagerTable toast={toast} user={user} />*/}
      <AccountantTable toast={toast} />
    </>
  );
};

export default InvoicePage;
