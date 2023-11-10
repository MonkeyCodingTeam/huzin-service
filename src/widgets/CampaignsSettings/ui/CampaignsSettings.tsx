import { PlusOutlined } from '@ant-design/icons';
import { Input, InputRef, Space, Tag, Tooltip } from 'antd';
import React, { FC, useEffect, useRef, useState } from 'react';
import { CampaignTemplate } from '@entities/campaign';
import { useUpdateTagsMutation } from '@features/campaign';
import css from './CampaignsSettings.module.scss';

interface Props {
  templateId: CampaignTemplate['id'];
  templateTags?: CampaignTemplate['tags'];
}

export const CampaignsSettings: FC<Props> = ({ templateId, templateTags }) => {
  const [updateTags] = useUpdateTagsMutation();

  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (!templateTags?.length) return;
    const tagsName: string[] = [];

    templateTags.map((templateTag) => {
      if (!tags.includes(templateTag.tag)) tagsName.push(templateTag.tag);
    });

    setTags([...tags, ...tagsName]);
  }, [templateTags]);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  // TODO обновление текущей рекламной группы (удаление)
  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
    updateTags({
      body: { tags: newTags.map((value) => ({ tag: value })) },
      campaignTemplateId: templateId,
    });
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // TODO обновление текущей рекламной группы
  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
      updateTags({
        body: { tags: [...tags, inputValue].map((value) => ({ tag: value })) },
        campaignTemplateId: templateId,
      });
    }

    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue('');
  };

  return (
    <Space size={[0, 8]} wrap style={{ padding: '6px 0' }}>
      {tags.map((tag, index) => {
        if (editInputIndex === index) {
          return (
            <Input
              ref={editInputRef}
              key={tag}
              size='small'
              className={css.campaignsSettings__tagInput}
              value={editInputValue}
              onChange={handleEditInputChange}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );
        }
        const isLongTag = tag.length > 20;
        const tagElem = (
          <Tag key={tag} closable style={{ userSelect: 'none' }} onClose={() => handleClose(tag)}>
            <span>{isLongTag ? `${tag.slice(0, 20)}...` : tag}</span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible ? (
        <Input
          ref={inputRef}
          type='text'
          size='small'
          className={css.campaignsSettings__tagInput}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag className={css.campaignsSettings__tagPlus} icon={<PlusOutlined />} onClick={showInput}>
          новый тэг
        </Tag>
      )}
    </Space>
  );
};
