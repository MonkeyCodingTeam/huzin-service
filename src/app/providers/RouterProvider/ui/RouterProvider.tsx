import { AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router } from 'react-router-dom';
import { ReactNode } from 'react';

interface WithRouterProps {
  children: ReactNode;
}

export const RouterProvider = ({ children }: WithRouterProps) => {
  return (
    <Router>
      <AnimatePresence mode='wait'>{children}</AnimatePresence>
    </Router>
  );
};
