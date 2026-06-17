import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Home, Scroll, Crown, Building2, BarChart3, Trophy } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { PlayerAvatar } from './PlayerAvatar';

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/proposal', icon: Heart, label: '求婚' },
  { path: '/marriage', icon: Crown, label: '婚姻' },
  { path: '/wedding/prepare', icon: Scroll, label: '婚礼' },
  { path: '/guild/wedding-hall', icon: Building2, label: '公会' },
  { path: '/reports/weekly', icon: BarChart3, label: '报告' },
  { path: '/rankings', icon: Trophy, label: '排行' },
];

export function Navigation() {
  const { currentPlayer } = useGameStore();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-magic-darker/80 backdrop-blur-xl border-b border-magic-purple/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <span className="text-3xl">💒</span>
            <h1 className="font-display text-xl font-bold bg-magic-gradient bg-clip-text text-transparent">
              魔法世界婚礼系统
            </h1>
          </motion.div>

          <div className="flex items-center gap-6">
            {navItems.map((item, index) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300
                  ${isActive 
                    ? 'bg-magic-gradient text-white shadow-magic' 
                    : 'text-gray-400 hover:text-white hover:bg-magic-purple/20'
                  }
                `}
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <item.icon className="w-4 h-4" />
                </motion.div>
                <span className="text-sm font-medium hidden md:inline">{item.label}</span>
              </NavLink>
            ))}
          </div>

          {currentPlayer && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">{currentPlayer.name}</p>
                <p className="text-xs text-magic-gold">Lv.{currentPlayer.level}</p>
              </div>
              <PlayerAvatar player={currentPlayer} size="sm" showLevel={false} />
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
}
