import { FC, MouseEvent, useCallback, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import css from './ClientSettingsGroup.module.scss';
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';
import { InputGroup } from '@shared/ui/InputGroup';
import { Input } from '@shared/ui/Input';
import { Field, Form, Formik, FormikValues } from 'formik';
import { Toast } from 'primereact/toast';
import { Group, GroupApi } from '@entities/group';

interface GroupListProps {
  group: Group;
  onDelete: () => void;
}

export const GroupList: FC<GroupListProps> = ({ group, onDelete }) => {
  const toast = useRef<Toast>(null);

  const confirmRemove = useCallback((e: MouseEvent<HTMLButtonElement>, group: Group) => {
    confirmPopup({
      target: e.currentTarget,
      message: 'Хотите удалить группу?',
      accept: onDelete,
      acceptLabel: 'Да',
      rejectLabel: 'Отмена',
    });
  }, []);

  const titleTemplate = (group: Group) => {
    return (
      <div className={css.group__item__header}>
        <a
          className={css.group__item__header__title}
          href={group.link}
          target='_blank'
          rel='noreferrer'
        >
          <img
            className={css.group__item__header__image}
            height={32}
            width={32}
            src={group.photo}
            alt='group icon'
          />
          {group.name}
        </a>
        <Button
          type='button'
          icon='pi pi-trash'
          area-label='Удалить'
          severity='danger'
          outlined
          onClick={(event) => confirmRemove(event, group)}
        />
      </div>
    );
  };

  const saveGroupChange = (values: FormikValues, group: Group) => {
    GroupApi.update(group.id, values).then((res) => {
      console.log(res.data);
      toast.current!.show({
        severity: 'success',
        detail: 'Сохранено!',
        life: 2000,
      });
    });
  };

  return (
    <div className={css.group__list}>
      <Toast ref={toast} />
      <ConfirmPopup />
      <Formik
        initialValues={{ senler_token: group.senler_token || '' }}
        onSubmit={(e, formikHelpers) => {
          saveGroupChange(e, group);
          e.senler_token = '';
        }}
        key={group.id}
      >
        <Form>
          <Card title={titleTemplate(group)}>
            <div className={css.group__item__body}>
              <InputGroup>
                <Field
                  as={Input}
                  label='ключ Senler'
                  name='senler_token'
                  placeholder={group.senler_token_protected || 'Введите API ключ Senler'}
                />
              </InputGroup>
              <div>
                <Button type='submit'>Сохранить</Button>
              </div>
            </div>
          </Card>
        </Form>
      </Formik>
    </div>
  );
};
