import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Heart, Crown, Building2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { MagicCard } from '../components/MagicCard';
import { PlayerAvatar } from '../components/PlayerAvatar';

type RankingType = 'loveValue' | 'weddingCount' | 'guildContribution';

const rankingTypes = [
  { id: 'loveValue', name: '恩爱值排行', icon: Heart, color: 'text-magic-pink' },
  { id: 'weddingCount', name: '婚礼次数排行', icon: Crown, color: 'text-magic-gold' },
  { id: 'guildContribution', name: '公会贡献排行', icon: Building2, color: 'text-magic-blue' },
];

export default function RankingsPage() {
  const { rankings, loadRankings, loading } = useGameStore();
  const [activeType, setActiveType] = useState<RankingType>('loveValue');

  useEffect(() => {
    loadRankings(activeType);
  }, [activeType, loadRankings]);

  const currentRankings = rankings[activeType] || [];

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-amber-600';
    return 'text-gray-500';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Trophy className="w-10 h-10 text-magic-gold" />
            全服排行榜
            <Trophy className="w-10 h-10 text-magic-gold" />
          </h1>
          <p className="text-gray-400">魔法世界最具影响力的伴侣和公会</p>
        </motion.div>

        <div className="flex justify-center gap-4 mb-8">
          {rankingTypes.map((type) => (
            <MagicCard
              key={type.id}
              onClick={() => setActiveType(type.id as RankingType)}
              className={`px-6 py-3 flex items-center gap-2 ${
                activeType === type.id ? 'ring-2 ring-magic-pink' : ''
              }`}
            >
              <type.icon className={`w-5 h-5 ${type.color}`} />
              <span className="font-semibold">{type.name}</span>
            </MagicCard>
          ))}
        </div>

        <MagicCard hover={false}>
          {loading[`ranking_${activeType}`] ? (
            <div className="text-center py-12 text-gray-400">加载中...</div>
          ) : (
            <div className="space-y-4">
              {currentRankings.slice(0, 3).map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`flex items-center gap-6 p-6 rounded-2xl border-2 ${
                    index === 0
                      ? 'border-yellow-400 bg-yellow-500/10'
                      : index === 1
                      ? 'border-gray-400 bg-gray-500/10'
                      : 'border-amber-600 bg-amber-500/10'
                  }`}>
                    <div className="text-5xl">{getRankIcon(index + 1)}</div>
                    
                    {activeType === 'guildContribution' ? (
                      <>
                        <div className="flex-1">
                          <h3 className="font-display text-xl font-bold flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-magic-blue" />
                            {entry.guildName || '未知公会'}
                          </h3>
                          <p className="text-sm text-gray-400">
                            会长: {entry.leaderName || '未知'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-magic-gold">
                            {entry.totalContribution?.toLocaleString() || 0}
                          </p>
                          <p className="text-sm text-gray-400">总贡献</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-4">
                          <PlayerAvatar player={entry.player1 as any} size="md" />
                          <div className="text-3xl">💖</div>
                          <PlayerAvatar player={entry.player2 as any} size="md" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-display text-xl font-bold">
                            {entry.player1Name} & {entry.player2Name}
                          </h3>
                          {activeType === 'loveValue' && (
                            <p className="text-magic-gold font-semibold">
                              {entry.loveValue?.toLocaleString()} 恩爱值
                            </p>
                          )}
                          {activeType === 'weddingCount' && (
                            <p className="text-magic-purple font-semibold">
                              {entry.weddingCount || 0} 次婚礼
                            </p>
                          )}
                        </div>

                        {entry.rankChange !== undefined && (
                          <div className="flex items-center gap-1">
                            {entry.rankChange > 0 && (
                              <>
                                <TrendingUp className="w-5 h-5 text-green-400" />
                                <span className="text-green-400 font-bold">+{entry.rankChange}</span>
                              </>
                            )}
                            {entry.rankChange < 0 && (
                              <>
                                <TrendingDown className="w-5 h-5 text-red-400" />
                                <span className="text-red-400 font-bold">{entry.rankChange}</span>
                              </>
                            )}
                            {entry.rankChange === 0 && (
                              <>
                                <Minus className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-400">0</span>
                              </>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              ))}

              {currentRankings.slice(3).map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index + 3) * 0.05 }}
                >
                  <div className="flex items-center gap-6 p-4 border-b border-magic-purple/10 hover:bg-magic-purple/5">
                    <div className={`text-2xl font-bold ${getRankColor(index + 4)}`}>
                      #{index + 4}
                    </div>
                    
                    {activeType === 'guildContribution' ? (
                      <>
                        <div className="flex-1">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-magic-blue" />
                            {entry.guildName || '未知公会'}
                          </h4>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-magic-gold">
                            {entry.totalContribution?.toLocaleString() || 0}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-magic-gradient flex items-center justify-center text-lg">
                            {entry.player1?.avatar || '🧙'}
                          </div>
                          <span className="text-magic-pink">💖</span>
                          <div className="w-10 h-10 rounded-full bg-magic-gradient flex items-center justify-center text-lg">
                            {entry.player2?.avatar || '🧝'}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {entry.player1Name} & {entry.player2Name}
                          </h4>
                          {activeType === 'loveValue' && (
                            <p className="text-sm text-magic-gold">
                              {entry.loveValue?.toLocaleString()}
                            </p>
                          )}
                          {activeType === 'weddingCount' && (
                            <p className="text-sm text-magic-purple">
                              {entry.weddingCount || 0} 次
                            </p>
                          )}
                        </div>

                        {entry.rankChange !== undefined && (
                          <div className={`font-bold text-sm ${
                            entry.rankChange > 0 ? 'text-green-400' :
                            entry.rankChange < 0 ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            {entry.rankChange > 0 ? `↑ ${entry.rankChange}` :
                            entry.rankChange < 0 ? `↓ ${Math.abs(entry.rankChange)}` : '—'}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              ))}

              {currentRankings.length === 0 && !loading[`ranking_${activeType}`] && (
                <div className="text-center py-12 text-gray-400">
                  暂无排行数据
                </div>
              )}
            </div>
          )}
        </MagicCard>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            排行榜每小时更新一次 · 数据仅供娱乐
          </p>
        </div>
      </div>
    </div>
  );
}
