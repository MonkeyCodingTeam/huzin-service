import css from './CompanyTagsSetting.module.scss';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import classNames from 'classnames';
import { Field, Form, Formik } from 'formik';
import { CompanyTemplateAPI } from '@shared/lib/api/target/company';
import type { CompanyTemplate, CreateCompanyTemplate } from '@shared/lib/api/target/types';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { CompanyTemplateList } from '@pages/Target/SettingsPage/ui/CompanyTemplateList';

export const CompanyTagsSetting = () => {
  const [templates, setTemplates] = useState<CompanyTemplate[]>([]);
  const toast = useRef<Toast>(null);

  const removeTemplate = (template: CompanyTemplate) => {
    CompanyTemplateAPI.delete(template.id).then(() => {
      toast.current!.show({
        severity: 'success',
        summary: 'Удалено',
        life: 2000,
      });
      getTemplate();
    });
  };

  useEffect(() => {
    getTemplate();
  }, []);

  const getTemplate = () => {
    CompanyTemplateAPI.getAll().then((res) => {
      setTemplates(res.data || []);
    });
  };

  const addTemplate = (value: CreateCompanyTemplate) => {
    CompanyTemplateAPI.create(value).then((res) => {
      console.log(templates);
      setTemplates([...templates, res.data]);
    });
  };

  return (
    <>
      <Toast ref={toast} />
      <Formik initialValues={{ name: '' }} onSubmit={addTemplate}>
        <Form className={classNames('p-inputgroup', css.toolPanel)}>
          <Field as={InputText} name='name' placeholder='Введите название компании' />
          <Button type='submit' label='Добавить' className='p-button-success' outlined />
        </Form>
      </Formik>

      <CompanyTemplateList onRemove={removeTemplate} templates={templates} />
    </>
  );
};
