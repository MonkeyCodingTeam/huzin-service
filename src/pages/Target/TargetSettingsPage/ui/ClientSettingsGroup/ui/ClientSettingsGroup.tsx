import {FC, useCallback, useEffect, useRef, useState} from 'react';
import { GroupAPI } from '@shared/lib/api/target/group';
import css from './ClientSettingsGroup.module.scss';
import { Client, Group } from '@shared/lib/api/target/types';
import { emptyGroupState } from '@entities/group/model';
import { Button } from 'primereact/button';
import { InputGroup } from '@shared/ui/InputGroup';
import { Input } from '@shared/ui/Input';
import { GroupList } from '@pages/Target/TargetSettingsPage/ui/ClientSettingsGroup/ui/GroupList';
import {InputTextProps} from "primereact/inputtext";

interface ClientSettingsGroup {
  client: Client;
}

export const ClientSettingsGroup: FC<ClientSettingsGroup> = ({ client }) => {
  const [groupLink, setGroupLink] = useState('');
  const [group, setGroup] = useState<Group>(emptyGroupState);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loadingGroup, setLoadingGroup] = useState(false);

  const getGroups = useCallback(() => {
    GroupAPI.get(client.id).then((res) => {
      res.data;
      setGroups(res.data);
    });
  }, [client.id]);

  const handleSubmit = () => {
    GroupAPI.create(client.id, group).then((res) => {
      getGroups();
      setGroupLink('')
    });
  };

  useEffect(() => {
    getGroups();
    setGroupLink('')
  }, [client.id]);

  useEffect(() => {
    if (!groupLink) return;
    setLoadingGroup(true);

    const delayDebounceFn = setTimeout(() => {
      const screenName = groupLink.match(/vk.com\/(?<screen_name>\w+)/)?.groups?.screen_name;

      if (screenName) {
        GroupAPI.getBy({ group_id: screenName, fields: ['city', 'public_date_label', 'site'] }).then(
          (res) => {
            const groupVk = res.data[0];
            setGroup({
              ...groupVk,
              photo: groupVk?.photo_200,
              site: groupVk?.site,
              link: groupLink,
              city: groupVk?.city?.title,
            });
            setLoadingGroup(false);

          },
        );
      }
      // Send Axios request here
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [groupLink]);

  return (
    <div>
      <div className={css.group__setting__form}>
        <InputGroup>
          <Input
            value={groupLink}
            label='Группа'
            placeholder={'Введите ссылку'}
            onChange={(e) => setGroupLink(e.target.value)}
          />
          <Button severity='success' outlined loading={loadingGroup} onClick={handleSubmit}>
            Сохранить
          </Button>
        </InputGroup>
      </div>
      {/*<Formik initialValues={{}} onSubmit={handleClientChange}>*/}
      {/*  <Form></Form>*/}
      {/*</Formik>*/}
      <GroupList groups={groups} />
    </div>
  );
};
