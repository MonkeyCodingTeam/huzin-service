import { Dialog } from 'primereact/dialog';
import { FC, useRef } from 'react';
import {
  FileUpload,
  FileUploadHeaderTemplateOptions,
  ItemTemplateOptions,
} from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';

interface AddStoriesDialogProps {
  visible: boolean;
  onHide: () => void;
  title?: string;
}

export const AddStoriesDialog: FC<AddStoriesDialogProps> = ({
  visible,
  onHide,
  title = 'Добавить сторис',
}) => {
  const fileUploadRef = useRef<FileUpload>(null);

  const emptyTemplate = () => {
    return (
      <div>
        <i
          style={{
            fontSize: '5em',
            borderRadius: '50%',
            backgroundColor: 'var(--surface-b)',
            color: 'var(--surface-d)',
          }}
        ></i>
        <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className='my-5'>
          Drag and Drop Image Here
        </span>
      </div>
    );
  };

  const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
    const { className, chooseButton } = options;

    return (
      <div
        className={className}
        style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}
      >
        {chooseButton}
        <div className='flex align-items-center gap-3 ml-auto'>
          <InputText placeholder='tests' />
        </div>
      </div>
    );
  };
  const onTemplateRemove = (file: File, callback: (...arg: never[]) => void) => {
    callback();
  };

  const itemTemplate = (inFile: object, options: ItemTemplateOptions) => {
    const file = inFile as File;
    const { formatSize, onRemove } = options;
    return (
      <div className='flex align-items-center flex-wrap'>
        <div className='flex align-items-center' style={{ width: '40%' }}>
          {/*@ts-ignore*/}
          <img alt={file.name} role='presentation' src={file.objectURL} width={100} />
          <span className='flex flex-column text-left ml-3'>
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag value={formatSize} severity='warning' className='px-3 py-2' />
        <Button
          type='button'
          icon='pi pi-times'
          className='p-button-outlined p-button-rounded p-button-danger ml-auto'
          onClick={() => onTemplateRemove(file, onRemove)}
        />
      </div>
    );
  };

  return (
    <Dialog
      header={title}
      visible={visible}
      style={{ width: '20vw', marginTop: '5rem' }}
      position='top'
      onHide={onHide}
      draggable={false}
    >
      <FileUpload
        ref={fileUploadRef}
        name='demo[]'
        url='/api/upload'
        accept='image/*'
        maxFileSize={1000000}
        headerTemplate={headerTemplate}
        itemTemplate={itemTemplate}
        emptyTemplate={emptyTemplate}
      />
      <p className='m-0'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </Dialog>
  );
};
