import { Group } from '@entities/group';
import { FC, MouseEvent, useCallback } from 'react';
import { Input, InputGroup } from '@shared/ui';
import { Field, Form, Formik, FormikValues } from 'formik';
import { confirmPopup } from 'primereact/confirmpopup';
import css from './GroupSettings.module.scss';
import { Button } from 'primereact/button';

interface GroupSettingsProps {
  group: Group;
  onDelete: (groupId: Group['id']) => void;
  onSave: (values: FormikValues) => void;
  openLinkDialog: () => void;
}

export const GroupItem: FC<GroupSettingsProps> = ({ group, onDelete, onSave, openLinkDialog }) => {
  const confirmRemove = useCallback(
    (e: MouseEvent<HTMLButtonElement>, group: Group) => {
      confirmPopup({
        target: e.currentTarget,
        message: 'Хотите удалить группу?',
        accept: () => onDelete(group.id),
        acceptLabel: 'Да',
        rejectLabel: 'Отмена',
      });
    },
    [onDelete],
  );

  return (
    <div className={css.groupItem}>
      <div className={css.groupItem__header}>
        <span className={css.groupItem__header__title}>{group.name}</span>
        <Button
          type='button'
          icon='pi pi-trash'
          area-label='Удалить'
          severity='danger'
          title='Удалить группу'
          outlined
          onClick={(event) => confirmRemove(event, group)}
        />
      </div>
      <Button
        className={css.groupItem__form__button}
        onClick={openLinkDialog}
        title='Связать группу с другой'
      >
        Связать группу
      </Button>
      <Formik initialValues={{ timezone: group.timezone }} onSubmit={onSave} key={group.id}>
        <Form className={css.groupItem__form}>
          <InputGroup>
            <Field
              as={Input}
              label='Часовой пояс (от МСК)'
              name='timezone'
              placeholder={'Введите город группы'}
            />
          </InputGroup>
          <Button className={css.groupItem__form__button} label='Сохранить' />
        </Form>
      </Formik>
    </div>
  );
};
