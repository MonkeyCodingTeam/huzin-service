import { Group, GroupApi, LinkGroupDialog, selectGroup } from '@entities/group';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@shared/lib/redux';
import { useNavigate, useParams } from 'react-router';
import { ROUTES } from '@app/providers/RouterProvider';
import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import { GroupItem } from '@pages/Content/SettingsPage/ui/GroupSettings';
import { FormikValues } from 'formik';
import css from './GroupSettings.module.scss';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { GroupAdd } from '@features/group';

export const GroupSettings = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const selectedGroup = useAppSelector((state) => state.selectedGroup);
  const dispatch = useAppDispatch();
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  useEffect(() => {
    GroupApi.getAll({ content_only: true }).then((res) => {
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
    GroupApi.delete(groupId, { from_content: true }).then(({ data }) => {
      dispatch(selectGroup(groups[0]));
      setGroups((prevState) => prevState.filter((group) => group.id !== data.id));
    });
  };

  const updateClients = (group: Group) => {
    setGroups((prevState) =>
      prevState.map((item) => {
        if (item.id === group.id) {
          dispatch(selectGroup(group));
          return group;
        }
        return item;
      }),
    );
  };

  const handleSaveGroup = (values: FormikValues) => {
    GroupApi.update(selectedGroup.id, values).then(({ data }) => {
      updateClients(data);
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
        <GroupAdd afterAdd={updateClients} />
        <ListBox
          listStyle={{ height: 'calc(100% - 60px)', overflow: 'auto' }}
          style={{ height: 'calc(100% - 60px)' }}
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
