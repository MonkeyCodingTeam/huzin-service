import { motion } from 'framer-motion';
import { FC, ReactNode } from 'react';

interface TransitionProps {
  children: ReactNode;
  className?: string;
}

export const Transition: FC<TransitionProps> = ({ children, className }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};
