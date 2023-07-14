import { FC, useCallback, useEffect, useState } from 'react';
import css from './ClientSettingsGroup.module.scss';
import { Button } from 'primereact/button';
import { InputGroup } from '@shared/ui/InputGroup';
import { Input } from '@shared/ui/Input';
import { ClientGroupAPI, Group, GroupApi } from '@entities/group';
import { Client } from '@entities/client';
import { GroupList } from './GroupList';

interface ClientSettingsGroup {
  client: Client;
}

export const ClientSettingsGroup: FC<ClientSettingsGroup> = ({ client }) => {
  const [groupLink, setGroupLink] = useState('');
  const [group, setGroup] = useState<Group>();
  const [loadingGroup, setLoadingGroup] = useState(false);

  const getGroups = useCallback(() => {
    ClientGroupAPI.get(client.id).then((res) => {
      res.data;
      setGroup(res.data);
    });
  }, [client.id]);

  const handleSubmit = () => {
    const screenName = groupLink.match(/vk.com\/(?<screen_name>[\w_.]+)/)?.groups?.screen_name;

    if (screenName) {
      GroupApi.getBy({
        group_id: screenName,
        fields: ['city', 'public_date_label', 'site'],
      }).then((res) => {
        const groupVk = res.data[0];
        const group = {
          ...groupVk,
          photo: groupVk?.photo_200,
          site: groupVk?.site,
          link: `https://vk.com/${screenName}`,
          city: groupVk?.city?.title,
        };

        ClientGroupAPI.create(client.id, group).then((res) => {
          setGroup(res.data);
          setGroupLink('');
        });
      });
    }
  };

  useEffect(() => {
    getGroups();
    setGroupLink('');
  }, [client.id]);

  const handleDeleteGroup = () => {
    if (!group?.id) return;

    GroupApi.delete(group.id).then(() => {
      return setGroup(undefined);
    });
  };

  if (!group?.id) {
    return (
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
    );
  }
  return <GroupList group={group} onDelete={handleDeleteGroup} />;
};
