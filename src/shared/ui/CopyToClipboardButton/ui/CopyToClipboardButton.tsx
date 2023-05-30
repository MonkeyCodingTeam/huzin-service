import { FC, useState } from 'react';
import classNames from 'classnames';
import { PrimeIcons } from 'primereact/api';
import { Tag } from 'primereact/tag';

interface CopyToClipboardButtonProps {
  text: string;
}

export const CopyToClipboardButton: FC<CopyToClipboardButtonProps> = ({ text }) => {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <Tag
      title='Скопировать'
      severity={isCopied ? 'success' : null}
      value={<i className={classNames('pi', isCopied ? PrimeIcons.CHECK : PrimeIcons.COPY)}></i>}
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        });
      }}
    />
  );
};
