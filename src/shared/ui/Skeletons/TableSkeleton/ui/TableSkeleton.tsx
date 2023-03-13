import { Skeleton } from 'primereact/skeleton';
import { DataTable, DataTableValue } from 'primereact/datatable';
import { Column } from 'primereact/column';

interface TableSkeletonProps {
  rows?: number;
}

export const TableSkeleton = ({ rows = 5 }: TableSkeletonProps) => {
  const items: DataTableValue[] = Array.from({ length: rows }, (v, i) => {
    return { i };
  });

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };

  const renderColumns = () => {
    return items.map((field, index) => (
      <Column
        key={`${field.toString()}_${index}`}
        field={field.toString()}
        header={<Skeleton />}
        filterElement={<Skeleton />}
        body={bodyTemplate}
      ></Column>
    ));
  };

  return (
    <div className='card'>
      <DataTable value={items} header={''} className='p-datatable-striped'>
        {renderColumns()}
      </DataTable>
    </div>
  );
};
