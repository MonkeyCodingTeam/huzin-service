import { MouseEvent, useEffect, useRef, useState } from 'react';
import { Group, GroupApi, selectGroup } from '@entities/group';
import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import { ROUTES } from '@app/providers/RouterProvider/const/routes';
import { useNavigate, useParams } from 'react-router';
import { Button } from 'primereact/button';
import css from './StoriesPage.module.scss';
import { AddStoriesDialog } from './AddStoriesDialog';
import { useAppDispatch, useAppSelector } from '@shared/lib/redux';
import { GroupStoryAPI } from '@entities/story/api/groupStory';
import { Story } from '@entities/story';
import { StoryCard } from '@pages/Content/StoriesPage/ui/StoryCard';
import { Toast } from 'primereact/toast';
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';

const StoriesPage = () => {
  const selectedGroup = useAppSelector((state: RootState) => state.selectedGroup);
  const [groups, setGroups] = useState<Group[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams<{ groupId: string }>();
  const toast = useRef<Toast>(null);

  const deleteStory = (story: Story) => {
    GroupStoryAPI.delete(story.id).then((res) => {
      setStories(stories.filter((story) => story.id !== res.data.id));
    });
  };

  const confirmRemove = (e: MouseEvent<HTMLElement>, story: Story) => {
    confirmPopup({
      target: e.currentTarget,
      message: 'Хотите удалить сторис?',
      accept: () => deleteStory(story),
      acceptLabel: 'Да',
      rejectLabel: 'Отмена',
    });
  };

  useEffect(() => {
    GroupApi.getAll().then((res) => {
      setGroups(res.data);
      if (!res.data.length) {
        return;
      }

      if (selectedGroup.id) {
        return navigate(`${ROUTES.CONTENT.Stories}/group/${selectedGroup.id}`);
      }

      const { groupId = res.data[0].id } = params;
      const group = res.data.find((group) => group.id === +groupId) || res.data[0];

      dispatch(selectGroup(group));
      navigate(`${ROUTES.CONTENT.Stories}/group/${group.id}`);
    });
  }, []);

  useEffect(() => {
    navigate(`${ROUTES.CONTENT.Stories}/group/${selectedGroup.id}`);
  }, [selectedGroup, navigate]);

  useEffect(() => {
    if (!selectedGroup.id) return;

    GroupStoryAPI.getAll(selectedGroup.id).then((res) => {
      setStories(res.data);
    });

    const interval = setInterval(() => {
      GroupStoryAPI.getAll(selectedGroup.id).then((res) => {
        setStories(res.data);
      });
    }, 1000 * 60 * 2);

    return () => {
      clearInterval(interval);
    };
  }, [selectedGroup.id]);

  const handleGroupChange = (e: ListBoxChangeEvent) => {
    if (e.value) {
      dispatch(selectGroup(e.value));
    }
  };

  const handleSubmit = () => {
    setOpenModal(false);
    GroupStoryAPI.getAll(selectedGroup.id).then((res) => {
      setStories(res.data);
    });
  };

  return (
    <div className={css.container}>
      <Toast ref={toast} />
      <ConfirmPopup />
      <ListBox
        value={selectedGroup}
        listStyle={{ height: 'calc(100% - 47px)' }}
        filter
        filterPlaceholder='Поиск'
        options={groups}
        optionLabel='name'
        onChange={handleGroupChange}
      />
      <div className={css.stories}>
        <div className={css.stories__header}>
          <span className={css.stories__header__title}>{selectedGroup?.name}</span>
          <div className={css.stories__header__tools}>
            <Button label='Добавить сторис' severity='success' onClick={() => setOpenModal(true)} />
            <a
              href={`https://vk.com/public${selectedGroup.id}?act=stories`}
              target='_blank'
              rel='noreferrer'
            >
              Сторис группы
            </a>
          </div>
        </div>
        <div className={css.stories__block}>
          {stories.map((story, index) => (
            <StoryCard
              key={`story_${story.id}_${index}`}
              story={story}
              removeStory={confirmRemove}
            />
          ))}
        </div>
      </div>
      <AddStoriesDialog
        visible={openModal}
        onHide={() => {
          setOpenModal(false);
        }}
        onSubmit={handleSubmit}
        group={selectedGroup}
      />
    </div>
  );
};

export default StoriesPage;
