import { Select } from 'antd';
import { IClient } from '@entities/client';

interface Props {
  clients: IClient[];
  onSelect: (clientId: number) => void;
}

interface IOption {
  value: number;
  label: string;
}

export const ClientsFilter = ({ clients, onSelect }: Props) => {
  // сортировка
  const collator = new Intl.Collator('ru', { caseFirst: 'upper' });
  const orderedClients = [...clients].sort((a, b) => collator.compare(a.name, b.name));

  const setOptions = (): IOption[] => {
    return orderedClients.map((client) => ({
      value: client.id,
      label: client.name,
    }));
  };

  return (
    <div>
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder='Клиенты'
        optionFilterProp='children'
        filterOption={(input, option): boolean => {
          if (!option) return false;
          return option.label.toLowerCase().includes(input.toLowerCase());
        }}
        options={setOptions()}
        onSelect={(value) => {
          onSelect(value);
        }}
      />
    </div>
  );
};
