import { FC, useEffect, useState } from 'react';
import { ClientGroupAPI } from '@shared/lib/api/target/group';
import css from './ClientSettingsGroup.module.scss';
import { Button } from 'primereact/button';
import { InputGroup } from '@shared/ui/InputGroup';
import { Input } from '@shared/ui/Input';
import { Group } from '@entities/group';
import { Client } from '@entities/client';
import { GroupList } from './GroupList';

interface ClientSettingsGroup {
  client: Client;
}

export const ClientSettingsGroup: FC<ClientSettingsGroup> = ({ client }) => {
  const [groupLink, setGroupLink] = useState('');
  const [group, setGroup] = useState<Group>();
  const [loadingGroup, setLoadingGroup] = useState(false);

  const handleSubmit = () => {
    const screenName = groupLink.match(/vk.com\/(?<screen_name>[\w_.]+)/)?.groups?.screen_name;
    setLoadingGroup(true);

    if (screenName) {
      ClientGroupAPI.getBy({
        group_id: screenName,
        fields: ['city', 'site'],
      }).then((res) => {
        const { id, city, place, screen_name, name, photo_200, site } = res.data[0];
        const group = {
          id,
          name,
          site,
          screen_name,
          photo: photo_200,
          link: `https://vk.com/${screenName}`,
          city: city?.title,
        };

        ClientGroupAPI.create(client.id, group).then((res) => {
          setGroup(res.data);
          setGroupLink('');
          setLoadingGroup(false);
        });
      });
    }
  };

  useEffect(() => {
    ClientGroupAPI.get(client.id).then((res) => {
      setGroup(res.data);
    });
    setGroupLink('');
  }, [client.id]);

  const handleDeleteGroup = () => {
    if (!client.group_id) return;

    ClientGroupAPI.delete(client).then(() => {
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
