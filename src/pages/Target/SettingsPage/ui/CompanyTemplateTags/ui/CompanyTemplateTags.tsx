import { Chips, type ChipsChangeEvent } from 'primereact/chips';
import css from './CompanyTemplateTags.module.scss';
import type { CompanyTemplate, CompanyTemplateTag } from '@shared/lib/api/target/types';
import { type FC, useEffect, useState } from 'react';
import { CompanyTemplateAPI } from '@shared/lib/api/target/company';

interface CompanyTemplateChipsProps {
  template: CompanyTemplate;
}

export const CompanyTemplateTags: FC<CompanyTemplateChipsProps> = ({ template }) => {
  const [tagList, setTagList] = useState<CompanyTemplateTag['tag'][]>();

  useEffect(() => {
    const tagNames = template.tags.reduce(
      (previousValue: CompanyTemplateTag['tag'][], currentValue) => {
        previousValue.push(currentValue.tag);
        return previousValue;
      },
      [],
    );
    setTagList(tagNames);
  }, []);

  const storeTag = (e: ChipsChangeEvent) => {
    const tagsSet = [...new Set(e.value)] as CompanyTemplateTag['tag'][];
    const tags = tagsSet.map((tag) => {
      return { tag };
    });

    CompanyTemplateAPI.storeTags(template.id, { tags }).then((res) => {
      setTagList(res.data);
    });
  };

  return (
    <Chips value={tagList} className={css.chips} placeholder={'Теги поиска'} onChange={storeTag} />
  );
};
