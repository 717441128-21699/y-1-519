import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface MagicButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

export function MagicButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
}: MagicButtonProps) {
  const baseStyles = 'rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2';
  
  const variantStyles = {
    primary: 'bg-magic-gradient text-white shadow-magic hover:shadow-magic-pink hover:scale-105 active:scale-95',
    secondary: 'bg-magic-purple/20 border border-magic-purple/50 text-white hover:bg-magic-purple/40 hover:border-magic-purple active:scale-95',
    danger: 'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/40 hover:border-red-500 active:scale-95',
    success: 'bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/40 hover:border-green-500 active:scale-95',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      whileHover={!disabled && !loading ? { scale: 1.05 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.95 } : undefined}
    >
      {loading && (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {children}
    </motion.button>
  );
}
