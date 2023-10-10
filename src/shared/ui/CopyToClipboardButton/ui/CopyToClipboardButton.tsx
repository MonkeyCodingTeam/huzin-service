import { FC, useState } from 'react';
import { Button } from 'primereact/button';

interface CopyToClipboardButtonProps {
  text: string;
  title?: string;
}

export const CopyToClipboardButton: FC<CopyToClipboardButtonProps> = ({ text, title }) => {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <Button
      title={title || 'Скопировать'}
      severity={isCopied ? 'success' : undefined}
      icon='pi pi-copy'
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        });
      }}
    />
  );
};
