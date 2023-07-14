import { emptyGroupState, Group, GroupApi } from '@entities/group';
import { FC, MouseEvent, useCallback, useRef } from 'react';
import { Input, InputGroup } from '@shared/ui';
import { Field, Form, Formik, FormikValues } from 'formik';
import { Toast } from 'primereact/toast';
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';
import css from './GroupSettings.module.scss';

interface GroupSettingsProps {
  group: Group;
  onDelete: (groupId: Group['id']) => void;
}

export const GroupItem: FC<GroupSettingsProps> = ({ group, onDelete }) => {
  const toast = useRef<Toast>(null);

  const saveGroupChange = (values: FormikValues, group: Group) => {
    GroupApi.update(group.id, values).then((res) => {
      toast.current!.show({
        severity: 'success',
        detail: 'Сохранено!',
        life: 2000,
      });
    });
  };

  const confirmRemove = useCallback((e: MouseEvent<HTMLButtonElement>, group: Group) => {
    confirmPopup({
      target: e.currentTarget,
      message: 'Хотите удалить группу?',
      accept: () => onDelete(group.id),
      acceptLabel: 'Да',
      rejectLabel: 'Отмена',
    });
  }, []);

  return (
    <div className={css.groupItem}>
      <span className={css.groupItem__title}>{group.name}</span>
      <Formik
        initialValues={{ ...emptyGroupState, ...group }}
        onSubmit={(e, formikHelpers) => {
          saveGroupChange(e, group);
          e.senler_token = '';
        }}
        key={group.id}
      >
        <Form>
          <InputGroup>
            <Field
              as={Input}
              label='Часовой пояс (от МСК)'
              name='timezone'
              placeholder={'Введите город группы'}
            />
          </InputGroup>
        </Form>
      </Formik>
      <Toast ref={toast} />
      <ConfirmPopup />
    </div>
  );
};
