import { LoadingOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { GroupInfo, useLazyGetClientGroupQuery } from '@entities/group';
import { GroupAdd, GroupDelete, GroupSettingsForm } from '@features/group';
import css from './GroupSettingsTab.module.scss';

export const GroupSettingsTab = () => {
  const [getGroup, { data: group, isFetching }] = useLazyGetClientGroupQuery();
  const client = useSelector((state: RootState) => state.selectedClient);

  useEffect(() => {
    if (client.id) getGroup({ clientId: client.id });
  }, [client]);

  return (
    <>
      {isFetching ? (
        <div className={css.groupSettingsTab__loading}>
          <LoadingOutlined spin={true} style={{ fontSize: '24px' }} />
        </div>
      ) : group?.id ? (
        <>
          <Divider orientation='left' style={{ marginTop: '0' }}>
            Группа
          </Divider>
          <GroupInfo group={group} actions={<GroupDelete />} />

          <Divider orientation='left'>Основные настройки</Divider>
          <GroupSettingsForm group={group} isLoading={isFetching} />
        </>
      ) : (
        <GroupAdd />
      )}
    </>
  );
};
