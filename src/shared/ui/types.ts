import { CSSProperties, DOMAttributes, ReactNode } from 'react';

export interface ComponentProps<T = HTMLAnchorElement> extends DOMAttributes<T> {
  /** Additional classes */
  className?: string;

  /** Primary content */
  children?: ReactNode;

  /** Additional style */
  style?: CSSProperties;
}

export type Size = 'small' | 'medium' | 'large';

export type Color = 'primary' | 'secondary' | 'success' | 'transparent';

export type KeyOf<T extends Record<string, unknown>> = keyof T;
export type ValueOf<T extends Record<string, unknown>> = T[KeyOf<T>];