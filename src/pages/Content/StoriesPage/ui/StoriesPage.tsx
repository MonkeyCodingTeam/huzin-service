import { useEffect, useState } from 'react';
import { emptyGroupState, Group, GroupApi } from '@entities/group';
import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import { ROUTES } from '@app/providers/RouterProvider/const/routes';
import { useNavigate } from 'react-router';
import { Button } from 'primereact/button';
import css from './StoriesPage.module.scss';
import { AddStoriesDialog } from './AddStoriesDialog';

const StoriesPage = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [group, setGroup] = useState<Group>(emptyGroupState);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    GroupApi.getAll().then((res) => {
      setGroups(res.data);
      setGroup(res.data[0]);
    });
  }, []);

  const handleGroupChange = (e: ListBoxChangeEvent) => {
    if (e.value) {
      setGroup(e.value);
      navigate(`${ROUTES.CONTENT.Stories}`);
    }
  };

  return (
    <div className={css.container}>
      <ListBox
        value={group}
        listStyle={{ height: 'calc(100% - 47px)' }}
        filter
        filterPlaceholder='Поиск'
        options={groups}
        optionLabel='name'
        onChange={handleGroupChange}
      />
      <div className={css.stories}>
        <div className={css.stories__header}>
          <span className={css.stories__header__title}>{group?.name}</span>
          <div className={css.stories__header__tools}>
            <Button label='Добавить сторис' severity='success' onClick={() => setVisible(true)} />
            <AddStoriesDialog visible={visible} onHide={() => setVisible(false)} group={group} />
          </div>
        </div>
        <div className={css.stories__block}>
          <p>test</p>
          <p>test</p>
          <p>test</p>
          <p>test</p>
          <p>test</p>
          <p>test</p>
          <p>test</p>
          <p>test</p>
        </div>
      </div>
    </div>
  );
};

export default StoriesPage;
