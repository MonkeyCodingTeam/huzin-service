import { TableSkeleton } from '@shared/ui';
import { motion } from 'framer-motion';
import { FC, ReactNode } from 'react';

interface TableLoaderProps {
  isLoading: boolean;
  rows?: number;
  children?: ReactNode;
}

export const TableLoader: FC<TableLoaderProps> = ({ children, isLoading, rows = 10 }) => {
  return isLoading ? (
    <motion.div
      initial={{ opacity: 0, height: '100%' }}
      transition={{ delay: 0.2 }}
      animate={{ opacity: 1 }}
    >
      <TableSkeleton rows={rows} />
    </motion.div>
  ) : (
    <motion.div
      initial={{ opacity: 0, height: '100%' }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};
