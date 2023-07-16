import { FC, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import css from './LinkGroupDialog.module.scss';
import { Group, GroupApi } from '@entities/group';
import { useFormik } from 'formik';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { Button } from 'primereact/button';

interface LinkGroupDialogProps {
  isOpen: boolean;
  onHide: () => void;
  group: Group;
  groups: Group[];
}

export const LinkGroupDialog: FC<LinkGroupDialogProps> = ({ isOpen, onHide, group, groups }) => {
  const formik = useFormik({
    initialValues: {
      groups: new Set<Group['id']>([]),
    },
    onSubmit: (data) => {
      GroupApi.setLinkedGroups(group.id, { groups: [...data.groups] }).then(({ data }) => {
        console.log(data);
      });
    },
  });

  useEffect(() => {
    if (!group.id) return;

    GroupApi.getLinkedGroups(group.id).then(({ data }) => {
      console.log(data);
      formik.setValues((prevState) => {
        data.forEach((item) => {
          prevState.groups.add(item.id);
          console.log(item.id);
        });
        return prevState;
      });
    });
  }, [group]);

  return (
    <Dialog header='Связать группы' className={css.dialog} visible={isOpen} onHide={onHide}>
      <form onSubmit={formik.handleSubmit} className={css.dialog__form}>
        <div className={css.dialog__form__checkboxList}>
          {groups
            .filter((item) => item.id !== group.id)
            .map((item, index) => (
              <div key={item.id} className={css.dialog__form__checkboxItem}>
                <Checkbox
                  inputId={`linked_${item.id}`}
                  checked={formik.values.groups.has(item.id)}
                  onChange={(e: CheckboxChangeEvent) => {
                    formik.setValues((prevState) => {
                      e.checked ? prevState.groups.add(item.id) : prevState.groups.delete(item.id);
                      return prevState;
                    });
                  }}
                  name={`groups[${index}]`}
                />
                <label htmlFor={`linked_${item.id}`}>{item.name}</label>
              </div>
            ))}
        </div>
        <Button label='Сохранить' type={'submit'} />
      </form>
    </Dialog>
  );
};
