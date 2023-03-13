import { CSSProperties, ReactNode } from 'react';

export interface ComponentProps {
  /** Additional classes */
  className?: string;

  /** Primary content */
  children?: ReactNode;

  /** Additional style */
  style?: CSSProperties;
}

export type Size = 'small' | 'medium' | 'large';

export type Color = 'primary' | 'secondary' | 'success' | 'transparent';
