import { Table } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import { Client } from '@entities/client';
import { ColumnsType } from 'antd/es/table';
import css from './ClientAdsTable.module.scss';

export interface DataType {
  key: number;
  name: Client['name'];
  adsCount: number;
  activeAdsDif: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Клиента',
    dataIndex: 'name',
    fixed: true,
  },
  {
    title: 'Количество компаний',
    dataIndex: 'adsCount',
    fixed: true,
  },
  // {
  //   title: 'Запущенные объявления',
  //   dataIndex: 'activeAdsDif',
  //   fixed: true,
  // },
];

interface Props {
  data: DataType[];
  loading: boolean;
}

export const ClientAdsTable: FC<Props> = ({ data, loading }) => {
  const [tableHeight, setTableHeight] = useState(600);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  // ref is the Table ref.
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (node === null) {
      setTableHeight(windowHeight - 130);
      return;
    }
    const { top } = node.getBoundingClientRect();
    setTableHeight(windowHeight - top - 130);
  }, [ref, windowHeight]);

  return (
    <div className={css.container}>
      <Table
        ref={ref}
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ y: tableHeight }}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>
                <b>Всего</b>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <b>{data.reduce<number>((prev, current) => prev + current.adsCount, 0)}</b>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </div>
  );
};
