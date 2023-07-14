import { Group, GroupApi, selectGroup } from '@entities/group';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@shared/lib/redux';
import { useNavigate, useParams } from 'react-router';
import { selectClient } from '@entities/client';
import { ROUTES } from '@app/providers/RouterProvider';
import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import { GroupItem } from '@pages/Content/SettingsPage/ui/GroupSettings';
import { Field, Form, Formik, FormikValues } from 'formik';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import css from './GroupSettings.module.scss';

export const GroupSettings = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const selectedGroup = useAppSelector((state) => state.selectedGroup);
  const dispatch = useAppDispatch();
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    GroupApi.getAll().then((res) => {
      setGroups(res.data);
      if (!res.data.length || selectedGroup.id) {
        return;
      }

      const id = groupId ? +groupId : res.data[0].id;
      const group = res.data.find((item) => item.id === id) || res.data[0];

      dispatch(selectGroup(group));
    });
  }, []);

  useEffect(() => {
    navigate(`${ROUTES.CONTENT.Settings}/group/${selectedGroup.id}`);
  }, [selectedGroup.id]);

  const handleGroupChange = (e: ListBoxChangeEvent) => {
    {
      const client = groups.find((item) => item.id === e.value);
      if (client) {
        dispatch(selectClient(client));
      }
    }
  };

  const handleGroupDelete = (groupId: Group['id']) => {
    console.log(groupId);
  };

  const handleSubmit = (value: FormikValues) => {
    const screenName = value.link.match(/vk.com\/(?<screen_name>[\w_.]+)/)?.groups?.screen_name;

    if (screenName) {
      GroupApi.getBy({
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

        GroupApi.create(group).then((res) => {
          setGroups((prevState) => {
            prevState.push(res.data);
            dispatch(selectGroup(res.data));
            return prevState.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
          });
        });
      });
    }
  };

  return (
    <div className={css.container}>
      <div className={css.container__left}>
        <Formik initialValues={{ link: '' }} onSubmit={handleSubmit}>
          <Form className='p-inputgroup'>
            <Field as={InputText} name='link' placeholder='Ссылка на группу' />
            <Button
              title='Добавить группу'
              icon='pi pi-plus'
              type='submit'
              className='p-button-success'
            />
          </Form>
        </Formik>
        <ListBox
          listStyle={{ height: 'calc(100% - 58px)', overflow: 'auto' }}
          style={{ height: 'calc(100% - 10px)' }}
          value={selectedGroup.id}
          filter
          filterPlaceholder='Поиск'
          options={groups}
          optionValue='id'
          optionLabel='name'
          onChange={handleGroupChange}
        />
      </div>
      <div className={css.container__right}>
        {selectedGroup.id ? (
          <GroupItem group={selectedGroup} onDelete={handleGroupDelete} />
        ) : (
          'Нет группы'
        )}
      </div>
    </div>
  );
};
