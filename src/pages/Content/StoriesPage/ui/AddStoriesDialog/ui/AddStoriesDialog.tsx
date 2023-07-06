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
import { getDownloadObject } from '@shared/lib/yandex';
import { Messages } from 'primereact/messages';
import { DateTime } from 'luxon';
import { GroupStoryAPI } from '@entities/story/api/groupStory';
import { Group } from '@entities/group';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';

interface AddStoriesDialogProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: () => void;
  group: Group;
}

interface storiesProps {
  date?: string | Date | Date[] | null;
  time: string | null;
  with_linked: boolean;
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
    time: '00:00',
  });
  const [publishDate, setPublishDate] = useState<DateTime>(DateTime.now);
  const [isFullFilled, setIsFullFilled] = useState(false);
  const [error, setError] = useState<string>();

  const refVideo = useRef<HTMLVideoElement>(null);
  const refImage = useRef<HTMLImageElement>(null);
  const refMessages = useRef<Messages>(null);

  useEffect(() => {
    setError(undefined);
    const { time, date, file } = story;
    if (!time?.match(/^(([0-1]?[0-9])|(2[0-3])):[0-5]?[0-9]$/)) {
      setError('Проверьте введёное время');
      setIsFullFilled(false);
    } else {
      setIsFullFilled(!!date && !!time && !!file);
      const splitTime = time!.split(':');
      setPublishDate(
        DateTime.fromJSDate(date as Date).set({
          hour: +splitTime[0] - (group.timezone || 0),
          minute: +splitTime[1],
        }),
      );
    }
  }, [story]);

  useEffect(() => {
    if (!link) return;
    setIsFileLoading(true);
    setError(undefined);

    const timeout = setTimeout(() => {
      getDownloadObject(link)
        .then((res) => {
          const { href } = res.data;
          const params = new URLSearchParams(href);
          const filename = params.get('filename') || 'yandex_file';

          fetch(href)
            .then((res) => res.blob())
            .then((blob) => {
              const file = new File([blob], filename, {
                type: params.get('content_type') || 'image/jpg',
              });
              setStory((prevState) => ({
                ...prevState,
                link,
                file,
              }));
              setLink('');
              fileUploadRef.current?.setFiles([file]);
            })
            .finally(() => setIsFileLoading(false));
        })
        .catch((err) => {
          console.log('file error');
          setIsFileLoading(false);
          setError('Ошибка загрузки, проверьте ссылку');
        });
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
    const splitedTime = e.value?.split(':') || '00:00';

    if (+splitedTime[0] > 23) {
      e.target.value = `23:${splitedTime[1]}`;
    }
    if (+splitedTime[1] > 59) {
      e.target.value = `${splitedTime[0]}:59`;
    }

    setStory((prevState) => ({
      ...prevState,
      time: e.target.value || '00:00',
    }));
  };

  const submit = () => {
    const { date, time, file, with_linked, link } = story;
    if (!time || !file || !date) return;

    const formData = new FormData();

    formData.append('content', file, file.name);
    formData.append('date', publishDate.toString());
    formData.append('with_linked', `${+with_linked}`);

    if (link) {
      formData.append('link', link);
    }

    GroupStoryAPI.create(group.id, formData).then((res) => {
      onSubmit();
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
        {publishDate && (
          <span>
            Опубликуется по МСК: <b>{publishDate.toFormat('dd.LL HH:mm')}</b>
          </span>
        )}
        <div className='p-inputgroup' style={{ width: 'auto' }}>
          <Calendar
            value={story?.date}
            minDate={new Date()}
            dateFormat='dd.mm.yy'
            onChange={(e: CalendarChangeEvent) =>
              setStory((prevState) => ({
                ...prevState,
                date: e.value,
              }))
            }
            placeholder='Дата публикации'
            style={{ maxWidth: '10rem' }}
            inputStyle={{ textAlign: 'center' }}
            readOnlyInput
            required
          />
          <InputMask
            value={story?.time || ''}
            onChange={handleTimeChange}
            placeholder='Время'
            mask='99:99'
            slotChar='00:00'
            style={{ maxWidth: '4rem', textAlign: 'center' }}
          />
        </div>
        <div className={css.preview__linked}>
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
