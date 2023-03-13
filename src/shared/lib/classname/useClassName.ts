import { useCallback } from 'react';
import classNames from 'classnames';

export type ClassValue =
  | string
  | number
  | ClassDictionary
  | ClassArray
  | undefined
  | null
  | boolean;

export type ClassArray = Array<ClassValue>; // eslint-disable-line @typescript-eslint/no-empty-interface

export interface ClassDictionary {
  [id: string]: unknown;
}

export function addPrefix(pre: string, className: string | string[], delimiter = '-'): string {
  if (!pre && !className) {
    return '';
  }

  if (pre.charAt(pre.length - 1) === delimiter) {
    // eslint-disable-next-line no-param-reassign
    pre = pre.slice(0, -1);
  }

  if (Array.isArray(className)) {
    return classNames(className.filter((name) => !!name).map((name) => pre + delimiter + name));
  }

  return pre + delimiter + className;
}

export function useClassNames(str: string, module?: CSSModuleClasses) {
  /**
   * @example
   *
   * if str = 'button':
   * prefix('red', { active: true }) => 'button-red button-active'
   */
  const prefix = useCallback(
    (...classes: ClassValue[]) => {
      const mergeClasses = classes.length
        ? classNames(...classes)
            .split(' ')
            .map((item) => {
              const className = addPrefix(str, item);

              if (!module) {
                return className;
              }

              return module[className] ?? className;
            })
        : [];

      return mergeClasses.filter((cls) => cls).join(' ');
    },
    [module, str],
  );

  /**
   * @example
   *
   * if str = 'button':
   * withClassPrefix('red', { active: true }) => 'button button-red button-active'
   */
  const withClassPrefix = useCallback(
    (...classes: ClassValue[]) => {
      console.log(classes);
      const mergeClasses = prefix(classes);
      const baseStyle = module ? module[str] : str;
      return mergeClasses ? `${baseStyle} ${mergeClasses}` : baseStyle;
    },
    [prefix, module, str],
  );

  return {
    withClassPrefix,
    merge: classNames,
    prefix,
  };
}
