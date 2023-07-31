import css from './AddInvoiceDialog.module.scss';
import { FloatInput } from '@shared/ui';
import { Formik, FormikHelpers } from 'formik';
import { Dialog } from 'primereact/dialog';
import { FC } from 'react';
import { Button } from 'primereact/button';
import { AddInvoiceState } from '@entities/invoice/model/invoice';
import { FileUpload } from 'primereact/fileupload';
import { InvoiceAPI, InvoiceWithFile } from '@entities/invoice';
import { mixed, number, object, string } from 'yup';
import { FormikConfig } from 'formik/dist/types';

interface AddInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: InvoiceWithFile, helpers: FormikHelpers<InvoiceWithFile>) => void;
  title?: string;
}

export const AddInvoiceDialog: FC<AddInvoiceDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = 'Добавить счёт',
}) => {
  const formikProps: FormikConfig<InvoiceWithFile> = {
    initialValues: { ...AddInvoiceState },
    onSubmit,
    validationSchema: object({
      file: mixed().required().label('файл'),
      inn: number().required().label('ИНН'),
      number: number().required().label('номер счёта'),
      sum: number().required().label('сумма'),
      entrepreneur: string().required().label('заказчик'),
      description: string(),
    }),
  };

  const disabled = ({ number, file, sum, entrepreneur, inn }: InvoiceWithFile): boolean =>
    !(number && inn && file && sum && entrepreneur);

  return (
    <Dialog className={css.dialog} visible={isOpen} onHide={onClose} header={title}>
      <Formik {...formikProps}>
        {(formik) => (
          <form onSubmit={formik.handleSubmit}>
            <div className={css.form__body}>
              <FileUpload
                auto
                customUpload
                mode='basic'
                name='file[]'
                accept='.pdf'
                maxFileSize={10000000}
                uploadHandler={(event) => {
                  const file = event.files.pop();
                  if (!file) return;

                  InvoiceAPI.parse(file).then(({ data }) => {
                    formik.setValues((prevState) => ({ ...prevState, ...data, file }));
                  });
                }}
                chooseLabel={formik.values.file?.name || 'Загрузить счёт'}
                chooseOptions={{ style: { width: '100%' } }}
              />

              <FloatInput label='Номер счёта' name='number' />
              <FloatInput label='Заказчик' name='entrepreneur' />
              <FloatInput label='ИНН' name='inn' />
              <FloatInput label='Сумма' name='sum' />
              <FloatInput label='Комментарий' name='description' />
            </div>
            <div className={css.form__footer}>
              <Button type='button' label='Отменить' severity='secondary' onClick={onClose} />
              <Button type='submit' label='Сохранить' disabled={disabled(formik.values)} />
            </div>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};
