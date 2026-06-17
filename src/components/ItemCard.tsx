import { motion } from 'framer-motion';
import type { Item } from '../../shared/types';
import { MagicCard } from './MagicCard';

interface ItemCardProps {
  item: Item;
  selected?: boolean;
  onClick?: () => void;
  showDetails?: boolean;
}

const qualityColors = {
  common: 'border-gray-400 text-gray-400 bg-gray-500/10',
  rare: 'border-blue-400 text-blue-400 bg-blue-500/10',
  epic: 'border-purple-400 text-purple-400 bg-purple-500/10',
  legendary: 'border-yellow-400 text-yellow-400 bg-yellow-500/10 animate-pulse-slow',
};

const qualityNames = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};

export function ItemCard({ item, selected = false, onClick, showDetails = true }: ItemCardProps) {
  return (
    <MagicCard
      onClick={onClick}
      className={`
        ${qualityColors[item.quality]}
        ${selected ? 'ring-2 ring-magic-pink ring-offset-2 ring-offset-magic-darker scale-105' : ''}
        p-4
      `}
      glow={item.quality === 'legendary'}
    >
      <div className="flex flex-col items-center gap-2">
        <motion.div
          animate={{ rotate: selected ? [0, -10, 10, -10, 0] : 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl"
        >
          {item.icon}
        </motion.div>
        <h4 className="font-display font-bold text-lg">{item.name}</h4>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${qualityColors[item.quality]}`}>
          {qualityNames[item.quality]}
        </span>
        {showDetails && (
          <>
            <p className="text-sm text-gray-400 text-center">{item.description}</p>
            <div className="flex items-center gap-1 text-magic-gold">
              <span className="text-lg">⭐</span>
              <span className="font-bold">+{item.qualityBonus}% 成功率加成</span>
            </div>
          </>
        )}
      </div>
    </MagicCard>
  );
}
