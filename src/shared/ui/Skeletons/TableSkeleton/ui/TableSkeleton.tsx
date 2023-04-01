import { Skeleton } from 'primereact/skeleton';
import { DataTable, DataTableValue } from 'primereact/datatable';
import { Column } from 'primereact/column';
import classNames from 'classnames';
import { CSSProperties } from 'react';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
  style?: CSSProperties;
}

export const TableSkeleton = ({
  rows = 5,
  columns = rows,
  className,
  style,
}: TableSkeletonProps) => {
  const itemsColumn: DataTableValue[] = Array.from({ length: columns }, (v, i) => {
    return { i };
  });
  const itemsRow: DataTableValue[] = Array.from({ length: rows }, (v, i) => {
    return { i };
  });

  const bodyTemplate = () => {
    return <Skeleton width='5rem'></Skeleton>;
  };

  const renderColumns = () => {
    return itemsColumn.map((field, index) => (
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
    <DataTable
      value={itemsRow}
      header={''}
      style={style}
      className={classNames('p-datatable-striped', className)}
    >
      {renderColumns()}
    </DataTable>
  );
};
