import { motion } from 'framer-motion';
import type { Player } from '../../shared/types';

interface PlayerAvatarProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLevel?: boolean;
  showName?: boolean;
  onClick?: () => void;
}

const sizeStyles = {
  sm: 'w-10 h-10 text-xl',
  md: 'w-14 h-14 text-2xl',
  lg: 'w-20 h-20 text-4xl',
  xl: 'w-28 h-28 text-6xl',
};

export function PlayerAvatar({ player, size = 'md', showLevel = true, showName = false, onClick }: PlayerAvatarProps) {
  if (!player) {
    return (
      <div className={`relative ${sizeStyles[size]} rounded-full bg-gray-700 flex items-center justify-center`}>
        <span>❓</span>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.1 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      className={`flex flex-col items-center gap-1 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className={`relative ${sizeStyles[size]} rounded-full bg-magic-gradient flex items-center justify-center shadow-magic`}>
        <span>{player.avatar}</span>
        {showLevel && (
          <div className="absolute -bottom-1 -right-1 bg-magic-gold text-magic-darker text-xs font-bold px-1.5 py-0.5 rounded-full">
            {player.level}
          </div>
        )}
      </div>
      {showName && (
        <span className="font-display font-semibold text-sm text-white">{player.name}</span>
      )}
    </motion.div>
  );
}
