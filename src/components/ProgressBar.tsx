import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'purple' | 'pink' | 'gold' | 'green' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const colorStyles = {
  purple: 'from-magic-purple to-purple-600',
  pink: 'from-magic-pink to-rose-500',
  gold: 'from-magic-gold to-amber-500',
  green: 'from-magic-green to-emerald-500',
  blue: 'from-magic-blue to-cyan-500',
};

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-3',
  lg: 'h-5',
};

export function ProgressBar({
  value,
  max,
  label,
  showPercentage = true,
  color = 'purple',
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm text-gray-300">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-semibold text-magic-gold">
              {value} / {max} ({percentage}%)
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-magic-darker/50 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${colorStyles[color]} rounded-full shadow-lg`}
        />
      </div>
    </div>
  );
}
