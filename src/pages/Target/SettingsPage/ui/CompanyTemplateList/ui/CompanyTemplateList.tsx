import { CompanyTemplate } from '@shared/lib/api/target/types';
import { FC, MouseEvent, useCallback } from 'react';
import css from './CompanyTemplateList.module.scss';
import classNames from 'classnames';
import { Button } from 'primereact/button';
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';
import { CompanyTemplateTags } from '@pages/Target/SettingsPage/ui/CompanyTemplateTags';
import { Checkbox } from 'primereact/checkbox';

interface CompanyTemplateProps {
  templates: CompanyTemplate[];
  onRemove: (template: CompanyTemplate) => void;
  onSenlerToggle: (template: CompanyTemplate) => void;
}

export const CompanyTemplateList: FC<CompanyTemplateProps> = ({
  templates,
  onRemove,
  onSenlerToggle,
}) => {
  const confirmRemove = useCallback(
    (e: MouseEvent<HTMLButtonElement>, template: CompanyTemplate) => {
      confirmPopup({
        target: e.currentTarget,
        message: 'Хотите удалить шаблон компании?',
        accept: () => {
          onRemove(template);
        },
        acceptLabel: 'Да',
        rejectLabel: 'Отмена',
      });
    },
    [onRemove],
  );

  return (
    <>
      <ConfirmPopup />
      <ul className={css.templateList}>
        {templates.map((template) => (
          <li className={classNames('p-inputgroup', css.templateList__item)} key={template.id}>
            <span className={classNames('p-inputgroup-addon', css.templateList__item__name)}>
              {template.name}
            </span>
            <CompanyTemplateTags template={template} />
            <span className={classNames('p-inputgroup-addon', css.templateList__item__checkbox)}>
              <label htmlFor={`has_senler_${template.id}`}>Senler</label>
              <Checkbox
                inputId={`has_senler_${template.id}`}
                checked={!!template.has_senler}
                onChange={() => onSenlerToggle(template)}
              />
            </span>
            <Button
              onClick={(event) => confirmRemove(event, template)}
              icon='pi pi-trash'
              area-label='Удалить'
              severity='danger'
              outlined
            />
          </li>
        ))}
      </ul>
    </>
  );
};
