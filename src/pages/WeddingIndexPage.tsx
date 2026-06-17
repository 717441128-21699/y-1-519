import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Sparkles, Crown, Users, Gift, Coins, Clock, ArrowRight, PartyPopper } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { MagicCard } from '../components/MagicCard';
import { MagicButton } from '../components/MagicButton';
import type { Wedding, WeddingStyle } from '../../shared/types';

const styleNames: Record<WeddingStyle, { name: string; icon: string }> = {
  fairyTale: { name: '梦幻童话', icon: '🏰' },
  darkFantasy: { name: '黑暗幻想', icon: '🌙' },
  xianxia: { name: '仙侠情缘', icon: '⛩️' },
  starryNight: { name: '星空主题', icon: '✨' },
  oceanDream: { name: '海洋之梦', icon: '🌊' },
  forestWonder: { name: '森林奇幻', icon: '🌲' },
};

function WeddingCard({ wedding, index }: { wedding: Wedding; index: number }) {
  const navigate = useNavigate();
  const styleInfo = styleNames[wedding.style] || { name: wedding.style, icon: '💒' };
  const guestCount = wedding.guestCount ?? wedding.guests?.length ?? 0;
  const totalGift = wedding.totalGifts ?? wedding.totalGift ?? 0;

  const handleEnter = () => {
    navigate(`/wedding/live/${wedding.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <MagicCard className="h-full p-6 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{styleInfo.icon}</span>
            <div>
              <h3 className="font-display text-xl font-bold text-magic-pink">
                {wedding.partner1Name || '新人A'}
                <span className="mx-2 text-magic-gold">💖</span>
                {wedding.partner2Name || '新人B'}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-magic-purple/20 text-magic-purple">
                  {styleInfo.icon} {styleInfo.name}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                  <Clock className="w-3 h-3" />
                  进行中
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-magic-darker/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <Crown className="w-3.5 h-3.5 text-magic-gold" />
              豪华度
            </div>
            <p className="text-xl font-bold text-magic-gold">{wedding.luxuryScore}</p>
          </div>
          <div className="bg-magic-darker/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5 text-magic-purple" />
              祝福积分
            </div>
            <p className="text-xl font-bold text-magic-purple">{wedding.blessingPoints}</p>
          </div>
          <div className="bg-magic-darker/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <Gift className="w-3.5 h-3.5 text-magic-pink" />
              礼金总额
            </div>
            <p className="text-xl font-bold text-magic-pink">💰 {totalGift.toLocaleString()}</p>
          </div>
          <div className="bg-magic-darker/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <Users className="w-3.5 h-3.5 text-magic-green" />
              现场宾客
            </div>
            <p className="text-xl font-bold text-magic-green">{guestCount} 人</p>
          </div>
        </div>

        <div className="mt-auto">
          <MagicButton onClick={handleEnter} className="w-full justify-center">
            <PartyPopper className="w-5 h-5" />
            进入现场
            <ArrowRight className="w-5 h-5" />
          </MagicButton>
        </div>
      </MagicCard>
    </motion.div>
  );
}

export default function WeddingIndexPage() {
  const { ongoingWeddings, loadOngoingWeddings, currentPlayer, loadCurrentPlayer, loading } = useGameStore();

  useEffect(() => {
    loadCurrentPlayer();
    loadOngoingWeddings();
  }, [loadCurrentPlayer, loadOngoingWeddings]);

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <Heart className="w-10 h-10 md:w-12 md:h-12 text-magic-pink animate-pulse" />
            进行中的婚礼
            <Heart className="w-10 h-10 md:w-12 md:h-12 text-magic-pink animate-pulse" />
          </h1>
          <p className="text-gray-400 text-lg flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-magic-gold" />
            魔法宴会厅 · 见证美好爱情
            <Sparkles className="w-5 h-5 text-magic-gold" />
          </p>
        </motion.div>

        {loading.ongoingWeddings ? (
          <div className="flex items-center justify-center py-20">
            <MagicCard className="text-center p-12 max-w-md">
              <div className="text-6xl mb-4 animate-spin">⏳</div>
              <h2 className="font-display text-2xl font-bold mb-4">加载中...</h2>
              <p className="text-gray-400">正在获取进行中的婚礼列表</p>
            </MagicCard>
          </div>
        ) : ongoingWeddings.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {ongoingWeddings.map((wedding, index) => (
              <WeddingCard key={wedding.id} wedding={wedding} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <MagicCard className="text-center p-12 max-w-lg mx-auto">
              <div className="text-7xl mb-6">💒</div>
              <h2 className="font-display text-2xl font-bold mb-4">暂无进行中的婚礼</h2>
              <p className="text-gray-400 mb-8">
                目前还没有正在进行的婚礼，去筹备一场属于你的浪漫婚礼吧！
              </p>
              <Link to="/wedding/prepare">
                <MagicButton className="justify-center">
                  <Heart className="w-5 h-5" />
                  开始筹备婚礼
                  <ArrowRight className="w-5 h-5" />
                </MagicButton>
              </Link>
            </MagicCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
