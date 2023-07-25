import { Dialog } from 'primereact/dialog';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import {
  FileUpload,
  FileUploadHeaderTemplateOptions,
  ItemTemplateOptions,
} from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import css from './AddStoriesDialog.module.scss';
import { Button } from 'primereact/button';
import classNames from 'classnames';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { InputMask, InputMaskChangeEvent } from 'primereact/inputmask';
import { Checkbox } from 'primereact/checkbox';
import { Messages } from 'primereact/messages';
import { DateTime } from 'luxon';
import { GroupStoryAPI } from '@entities/story/api/groupStory';
import { Group } from '@entities/group';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { ContentAPI } from '@entities/content';

interface AddStoriesDialogProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: () => void;
  group: Group;
}

interface storiesProps {
  publish_date: DateTime;
  with_linked: boolean;
  from_msk: boolean;
  link?: string;
  file?: File;
}

export const AddStoriesDialog: FC<AddStoriesDialogProps> = ({
  visible,
  onHide,
  onSubmit,
  group,
}) => {
  const fileUploadRef = useRef<FileUpload>(null);
  const [link, setLink] = useState('');
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [story, setStory] = useState<storiesProps>({
    with_linked: true,
    from_msk: false,
    publish_date: DateTime.now(),
  });
  const [isFullFilled, setIsFullFilled] = useState(false);
  const [error, setError] = useState<string>();

  const refVideo = useRef<HTMLVideoElement>(null);
  const refImage = useRef<HTMLImageElement>(null);
  const refMessages = useRef<Messages>(null);

  useEffect(() => {
    setStory((prevState) => ({
      ...prevState,
      publish_date: prevState.publish_date.set({ hour: DateTime.now().hour + group.timezone }),
    }));
  }, [group]);

  useEffect(() => {
    const { publish_date, file } = story;
    setError(undefined);
    setIsFullFilled(!!publish_date && !!file);
  }, [story]);

  useEffect(() => {
    if (!link) return;
    setIsFileLoading(true);
    setError(undefined);

    const timeout = setTimeout(() => {
      ContentAPI.downloadFromYandex(link)
        .then((res) => {
          setStory((prevState) => ({
            ...prevState,
            link,
            file: res.data,
          }));
          setLink('');
          fileUploadRef.current?.setFiles([res.data]);
        })
        .catch(({ response }) => {
          refMessages.current?.show({
            severity: 'error',
            content: response.data.message,
          });
        })
        .finally(() => setIsFileLoading(false));
    }, 2000);

    return () => clearTimeout(timeout);
  }, [link]);

  const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
    const { className, chooseButton } = options;

    return (
      <div className={classNames(className, css.upload)}>
        <InputText
          placeholder='Введите ссылку'
          value={link}
          onChange={(e) => setLink(e.target.value)}
          disabled={isFileLoading}
        />
        <span>или</span>
        {chooseButton}
      </div>
    );
  };
  const onTemplateRemove = (file: File, callback: (...arg: never[]) => void) => {
    callback();
    setStory((prevState) => ({
      ...prevState,
      file: undefined,
    }));
  };

  const ContentPreview = useMemo(() => {
    const { file } = story;

    if (!file) return;
    const url = window.URL.createObjectURL(file);

    return (
      <div>
        {file.type.match(/^video\//) ? (
          <video ref={refVideo} src={url} title={file.name} width='100' controls />
        ) : (
          <img
            ref={refImage}
            alt={file.name}
            title={file.name}
            role='presentation'
            src={url}
            width={100}
          />
        )}
      </div>
    );
  }, [story.file]);

  const handleTimeChange = (e: InputMaskChangeEvent) => {
    if (!e.value?.length) return;
    const splitedTime = e.value?.split(':') || '00:00';

    setStory((prevState) => ({
      ...prevState,
      publish_date: prevState.publish_date.set({
        hour: +splitedTime[0] % 24,
        minute: +splitedTime[1] % 60,
      }),
    }));
  };

  const submit = () => {
    const { publish_date, file, with_linked, from_msk, link } = story;
    if (!file || !publish_date) return;

    const formData = new FormData();

    formData.append('content', file, file.name);
    formData.append('date', publish_date.minus({ hour: group.timezone }).toString());
    formData.append('with_linked', `${+with_linked}`);
    formData.append('from_msk', `${+from_msk}`);

    if (link) {
      formData.append('link', link);
    }

    GroupStoryAPI.create(group.id, formData)
      .then(() => {
        onSubmit();
      })
      .catch(({ response }) => {
        refMessages.current?.show({
          severity: 'error',
          content: response.data.message,
        });
      });
  };

  const itemTemplate = (inFile: object, options: ItemTemplateOptions) => {
    const fileInput = inFile as File;
    const { onRemove } = options;

    return (
      <div className={css.preview}>
        <div className={css.preview__header}>
          <span className={css.preview__header__title}>{fileInput.name}</span>
          <Button
            icon='pi pi-times'
            rounded
            text
            severity='danger'
            aria-label='Remove'
            onClick={() => onTemplateRemove(fileInput, onRemove)}
          />
        </div>
        {ContentPreview}
        <span>
          Опубликуется по МСК:{' '}
          <b>{story.publish_date.minus({ hour: group.timezone }).toFormat('dd.LL HH:mm')}</b>
        </span>
        <div className='p-inputgroup' style={{ width: 'auto' }}>
          <Calendar
            value={story.publish_date.toJSDate()}
            minDate={new Date()}
            dateFormat='dd.mm.yy'
            onChange={(e: CalendarChangeEvent) =>
              setStory((prevState) => ({
                ...prevState,
                publish_date: DateTime.fromJSDate(e.value as Date).set({
                  hour: prevState.publish_date.hour,
                  minute: prevState.publish_date.minute,
                }),
              }))
            }
            placeholder='Дата публикации'
            style={{ maxWidth: '10rem' }}
            inputStyle={{ textAlign: 'center' }}
            readOnlyInput
            required
          />
          <InputMask
            value={story.publish_date.toFormat('HH:mm')}
            onChange={handleTimeChange}
            placeholder='Время'
            mask='99:99'
            slotChar='00:00'
            style={{ maxWidth: '4rem', textAlign: 'center' }}
          />
        </div>
        <div className={css.preview__ceckbox}>
          <label htmlFor='linkeClients' className='ml-2'>
            Опубликовать в связанных проектах
          </label>
          <Checkbox
            inputId='linkeClients'
            onChange={() =>
              setStory((prevState) => {
                return {
                  ...prevState,
                  with_linked: !story.with_linked,
                };
              })
            }
            checked={story.with_linked}
          />
        </div>
        <div className={css.preview__ceckbox}>
          <label htmlFor='linkeClients' className='ml-2'>
            Время относительно МСК
          </label>
          <Checkbox
            inputId='linkeClients'
            onChange={() =>
              setStory((prevState) => {
                return {
                  ...prevState,
                  from_msk: !story.from_msk,
                };
              })
            }
            checked={story.from_msk}
          />
        </div>
        <div
          className={css.preview__submit}
          title={isFullFilled ? '' : 'Загрузите файл и выберите дату публикации'}
        >
          <Button label='Опубликовать' onClick={submit} disabled={!isFullFilled} />
        </div>
      </div>
    );
  };

  return (
    <Dialog
      header={group.name}
      visible={visible}
      style={{ width: '20vw', marginTop: '5rem' }}
      position='top'
      onHide={onHide}
      draggable={false}
    >
      <Messages ref={refMessages} />
      <FileUpload
        ref={fileUploadRef}
        name='demo[]'
        url='/api/upload'
        accept='.jpg,.png,.gif,.mp4,.mav,.mov'
        maxFileSize={10000000}
        contentStyle={{ padding: 0 }}
        chooseLabel='Выберите файл'
        headerTemplate={headerTemplate}
        itemTemplate={itemTemplate}
        onSelect={(e) => {
          setError(undefined);
          setStory((prevState) => ({
            ...prevState,
            file: e.files[0],
          }));
        }}
      />

      <div className={css.infoBlock}>
        {isFileLoading && (
          <ProgressSpinner
            color='var(--primary-color)'
            className={css.spinner}
            strokeWidth='.3rem'
          />
        )}
        {error && <Message severity='error' text={error} />}
      </div>
    </Dialog>
  );
};
