import { Group, GroupApi, LinkGroupDialog, selectGroup } from '@entities/group';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@shared/lib/redux';
import { useNavigate, useParams } from 'react-router';
import { ROUTES } from '@app/providers/RouterProvider';
import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import { GroupItem } from '@pages/Content/SettingsPage/ui/GroupSettings';
import { Field, Form, Formik, FormikHelpers, FormikValues } from 'formik';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import css from './GroupSettings.module.scss';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';

export const GroupSettings = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const selectedGroup = useAppSelector((state) => state.selectedGroup);
  const dispatch = useAppDispatch();
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

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
      const group = groups.find((item) => item.id === e.value);
      if (group) {
        dispatch(selectGroup(group));
      }
    }
  };

  const handleGroupDelete = (groupId: Group['id']) => {
    GroupApi.delete(groupId).then(({ data }) => {
      dispatch(selectGroup(groups[0]));
      setGroups((prevState) => prevState.filter((group) => group.id !== data.id));
    });
  };

  const handleSubmit = (value: FormikValues, helpers: FormikHelpers<{ link: string }>) => {
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
          const newGroup = res.data;
          setGroups((prevState) => {
            if (!prevState.find((item) => item.id === newGroup.id)) {
              prevState.push(newGroup);
              prevState.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
            }
            dispatch(selectGroup(res.data));
            return prevState;
          });
          helpers.setValues({ link: '' });
        });
      });
    }
  };

  const handleSaveGroup = (values: FormikValues) => {
    GroupApi.update(selectedGroup.id, values).then(({ data }) => {
      setGroups((prevState) =>
        prevState.map((group) => {
          if (group.id === data.id) {
            return data;
          }
          return group;
        }),
      );
      dispatch(selectGroup(data));
      toast.current!.show({
        severity: 'success',
        detail: 'Сохранено!',
        life: 2000,
      });
    });
  };

  return (
    <div className={css.container}>
      <Toast ref={toast} />
      <LinkGroupDialog
        group={selectedGroup}
        onHide={() => setOpenLinkDialog(false)}
        isOpen={openLinkDialog}
        groups={groups}
        toast={toast}
      />
      <ConfirmPopup />
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
          listStyle={{ height: 'calc(100% - 48px)', overflow: 'auto' }}
          style={{ height: 'calc(100% - 48px)' }}
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
          <GroupItem
            group={selectedGroup}
            onDelete={handleGroupDelete}
            onSave={handleSaveGroup}
            openLinkDialog={() => setOpenLinkDialog(true)}
          />
        ) : (
          'Нет группы'
        )}
      </div>
    </div>
  );
};
