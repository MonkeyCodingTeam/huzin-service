import { InboxOutlined } from '@ant-design/icons';
import { Form, message, Modal, Upload, UploadProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { Client } from '@entities/client';

interface Props {
  clientInvoice?: Client;
  onCancel: () => void;
}

export const InvoiceAddModal: React.FC<Props> = ({ clientInvoice, onCancel }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const onFormSubmit = () => {
    if (!clientInvoice) {
      // TODO анализ и возможный рефактор
      console.log('Error, check client exist: ', clientInvoice);
      return;
    }
    form.validateFields().then((values) => {
      console.log({ id: clientInvoice.id, ...values });
      onCancel();
    });
  };

  const { Dragger } = Upload;

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    accept: 'application/pdf',
    // TODO добавить экшен
    maxCount: 1,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  useEffect(() => {
    if (!clientInvoice) return setIsModalOpen(false);
    setIsModalOpen(true);
  }, [clientInvoice]);

  return (
    <Modal
      open={isModalOpen}
      title={clientInvoice?.name}
      okText='Сохранить'
      cancelText='Отмена'
      onCancel={onCancel}
      okButtonProps={{ form: 'form_in_modal', htmlType: 'submit' }}
    >
      <Dragger {...props}>
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>Перетащите файл в эту область или нажмите на неё</p>
        <p className='ant-upload-hint'>Поддерживаются файлы только в формате PDF</p>
      </Dragger>

      <Form name='form_in_modal' form={form} layout='vertical' onFinish={onFormSubmit}>
        <Form.Item></Form.Item>
      </Form>
    </Modal>
  );
};
