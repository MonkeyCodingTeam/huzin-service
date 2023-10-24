import { Button, Form, FormInstance } from 'antd';
import React, { FC, useEffect, useState } from 'react';

interface Props {
  form: FormInstance;
  isLoading?: boolean;
  text: string;
}

export const SubmitFormButton: FC<Props> = ({ form, isLoading, text }) => {
  const [submittable, setSubmittable] = useState(false);

  // Watch all values
  const values = Form.useWatch([], form);

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      },
    );
  }, [values]);

  return (
    <Button type='primary' htmlType='submit' disabled={!submittable} loading={isLoading}>
      {text}
    </Button>
  );
};
