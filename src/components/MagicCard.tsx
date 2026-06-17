import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface MagicCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export function MagicCard({ children, className = '', hover = true, glow = false, onClick }: MagicCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { scale: 1.02, y: -5 } : undefined}
      whileTap={hover ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`
        magic-card p-6
        ${glow ? 'magic-glow' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
