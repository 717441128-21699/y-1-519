import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Crown, Scroll, Building2, BarChart3, Trophy, Sparkles } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { MagicCard } from '../components/MagicCard';
import { MagicButton } from '../components/MagicButton';
import { PlayerAvatar } from '../components/PlayerAvatar';

export default function HomePage() {
  const {
    currentPlayer,
    marriage,
    loadCurrentPlayer,
    loadPlayers,
    loadMarriage,
    loadRankings,
    rankings,
    loading,
  } = useGameStore();

  useEffect(() => {
    loadCurrentPlayer();
    loadPlayers();
    loadRankings('loveValue');
  }, [loadCurrentPlayer, loadPlayers, loadRankings]);

  useEffect(() => {
    if (currentPlayer) {
      loadMarriage(currentPlayer.id);
    }
  }, [currentPlayer, loadMarriage]);

  const features = [
    { icon: Heart, title: '求婚系统', desc: '提交定情信物，计算成功率，触发随机事件', path: '/proposal', color: 'text-magic-pink' },
    { icon: Crown, title: '婚姻系统', desc: '解锁双人技能，挑战专属副本，每日恩爱值', path: '/marriage', color: 'text-magic-gold' },
    { icon: Scroll, title: '婚礼系统', desc: '选择婚礼风格，布置礼堂，全服公告', path: '/wedding/prepare', color: 'text-magic-purple' },
    { icon: Building2, title: '公会婚庆堂', desc: '全员贡献升级，提升婚礼豪华度', path: '/guild/wedding-hall', color: 'text-magic-blue' },
    { icon: BarChart3, title: '姻缘报告', desc: '每周数据统计，热力图与趋势分析', path: '/reports/weekly', color: 'text-magic-green' },
    { icon: Trophy, title: '全服排行榜', desc: '恩爱值、婚礼次数、公会贡献排名', path: '/rankings', color: 'text-magic-gold' },
  ];

  const topCouples = rankings.loveValue?.slice(0, 3) || [];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            💒
          </motion.div>
          <h1 className="font-display text-5xl font-bold mb-4 bg-magic-gradient bg-clip-text text-transparent">
            魔法世界婚礼系统
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            在魔法的见证下，与你的挚爱携手开启浪漫之旅。求婚、婚礼、婚姻，每一步都充满惊喜与挑战！
          </p>
        </motion.div>

        {currentPlayer && (
          <MagicCard className="mb-8 p-8" hover={false}>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <PlayerAvatar player={currentPlayer} size="xl" showName />
              <div className="flex-1 text-center md:text-left">
                <h2 className="font-display text-2xl font-bold mb-2">
                  欢迎回来，{currentPlayer.name}！
                </h2>
                <p className="text-gray-400 mb-4">
                  等级 {currentPlayer.level} · 职业 {currentPlayer.class}
                </p>
                {marriage ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-magic-pink/20 rounded-full">
                    <Heart className="w-5 h-5 text-magic-pink animate-heartbeat" />
                    <span className="font-semibold">
                      已与 {marriage.partner2Name} 结为伴侣
                    </span>
                    <span className="text-magic-gold">💕 {marriage.loveValue} 恩爱值</span>
                  </div>
                ) : (
                  <MagicButton size="sm" onClick={() => window.location.href = '/proposal'}>
                    <Heart className="w-4 h-4" />
                    开始求婚之旅
                  </MagicButton>
                )}
              </div>
            </div>
          </MagicCard>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={feature.path}>
                <MagicCard className="h-full">
                  <div className={`text-4xl mb-4 ${feature.color}`}>
                    <feature.icon className="w-10 h-10" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </MagicCard>
              </Link>
            </motion.div>
          ))}
        </div>

        <MagicCard className="mb-8" hover={false}>
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-6 h-6 text-magic-gold" />
            <h2 className="font-display text-2xl font-bold">全服恩爱榜 TOP 3</h2>
          </div>
          
          {loading['ranking_loveValue'] ? (
            <div className="text-center py-8 text-gray-400">加载中...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {topCouples.map((couple, index) => (
                <motion.div
                  key={couple.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className={`text-center p-6 rounded-xl border-2 ${
                    index === 0
                      ? 'border-yellow-400 bg-yellow-500/10'
                      : index === 1
                      ? 'border-gray-400 bg-gray-500/10'
                      : 'border-amber-600 bg-amber-500/10'
                  }`}
                >
                  <div className="text-4xl mb-2">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">
                    {couple.player1Name} & {couple.player2Name}
                  </h3>
                  <p className="text-magic-gold font-bold text-xl">
                    {couple.loveValue?.toLocaleString()} 恩爱值
                  </p>
                  {couple.rankChange !== undefined && couple.rankChange !== 0 && (
                    <span className={`text-sm ${couple.rankChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {couple.rankChange > 0 ? '↑' : '↓'} {Math.abs(couple.rankChange)}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </MagicCard>

        <div className="text-center">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-2 text-magic-purple/60"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">愿魔法与爱情同在</span>
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
