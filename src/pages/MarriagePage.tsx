import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Heart, Gift, Swords, Sparkles, Calendar, Lock, Unlock } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { MagicCard } from '../components/MagicCard';
import { MagicButton } from '../components/MagicButton';
import { PlayerAvatar } from '../components/PlayerAvatar';
import { ProgressBar } from '../components/ProgressBar';
import type { SkillUnlock } from '../../shared/types';

const loveLevels = [
  { level: 1, name: '初识', icon: '💗', min: 0, next: 100 },
  { level: 2, name: '相知', icon: '💕', min: 100, next: 300 },
  { level: 3, name: '相恋', icon: '💖', min: 300, next: 600 },
  { level: 4, name: '相守', icon: '💓', min: 600, next: 1000 },
  { level: 5, name: '相爱', icon: '💞', min: 1000, next: 1500 },
  { level: 6, name: '情深', icon: '💝', min: 1500, next: 2000 },
  { level: 7, name: '伉俪', icon: '💘', min: 2000, next: 2500 },
  { level: 8, name: '白头偕老', icon: '💟', min: 2500, next: 99999 },
];

export default function MarriagePage() {
  const { currentPlayer, marriage, loadCurrentPlayer, loadMarriage, claimDailyLove, enterDungeon, loading } = useGameStore();
  const [loveLevel, setLoveLevel] = useState(loveLevels[0]);

  useEffect(() => {
    loadCurrentPlayer();
  }, [loadCurrentPlayer]);

  useEffect(() => {
    if (currentPlayer) {
      loadMarriage(currentPlayer.id);
    }
  }, [currentPlayer, loadMarriage]);

  useEffect(() => {
    if (marriage) {
      const level = loveLevels.find((l) => marriage.loveValue >= l.min && marriage.loveValue < l.next) || loveLevels[7];
      setLoveLevel(level);
    }
  }, [marriage]);

  const getSkillIcon = (type: string) => {
    switch (type) {
      case 'heal': return '💚';
      case 'attack': return '⚔️';
      case 'defense': return '🛡️';
      case 'buff': return '✨';
      case 'teleport': return '🌀';
      default: return '⭐';
    }
  };

  if (!marriage) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <MagicCard className="text-center p-12 max-w-md">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="font-display text-2xl font-bold mb-4">暂无婚姻关系</h2>
          <p className="text-gray-400 mb-6">你还没有伴侣，快去求婚吧！</p>
          <MagicButton onClick={() => window.location.href = '/proposal'}>
            <Heart className="w-5 h-5" />
            去求婚
          </MagicButton>
        </MagicCard>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const canClaimDaily = marriage.lastDailyClaim !== today;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Crown className="w-10 h-10 text-magic-gold" />
            我们的婚姻
            <Crown className="w-10 h-10 text-magic-gold" />
          </h1>
        </motion.div>

        <MagicCard className="mb-8 p-8" hover={false}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <PlayerAvatar player={marriage.partner1 as any} size="lg" showName />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-5xl"
              >
                💖
              </motion.div>
              <PlayerAvatar player={marriage.partner2 as any} size="lg" showName />
            </div>

            <div className="flex-1 max-w-md">
              <div className="text-center mb-4">
                <span className="text-4xl mr-2">{loveLevel.icon}</span>
                <span className="font-display text-2xl font-bold text-magic-gold">
                  {loveLevel.name}
                </span>
                <span className="text-gray-400 ml-2">Lv.{loveLevel.level}</span>
              </div>
              <ProgressBar
                value={marriage.loveValue - loveLevel.min}
                max={loveLevel.next - loveLevel.min}
                label={`恩爱值 ${marriage.loveValue}`}
                color="pink"
              />
              <p className="text-sm text-gray-400 text-center mt-2">
                距离下一等级还需 {loveLevel.next - marriage.loveValue} 恩爱值
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">结婚天数</p>
              <p className="font-display text-4xl font-bold text-magic-purple">
                {marriage.marriageDays || 1}
                <span className="text-lg text-gray-400 ml-1">天</span>
              </p>
            </div>
          </div>
        </MagicCard>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <MagicCard>
            <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-magic-green" />
              每日恩爱
            </h2>
            
            <div className="mb-6">
              <p className="text-gray-400 mb-4">每日领取恩爱值，有概率触发甜蜜或冷战事件</p>
              <MagicButton
                onClick={() => claimDailyLove(marriage.id)}
                disabled={!canClaimDaily}
                loading={loading.marriage}
                className="w-full"
              >
                <Gift className="w-5 h-5" />
                {canClaimDaily ? '领取今日恩爱值' : '今日已领取'}
              </MagicButton>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30 text-center">
                <p className="text-green-400 text-2xl mb-1">🌸</p>
                <p className="font-semibold text-green-400">甜蜜事件</p>
                <p className="text-sm text-gray-400">恩爱值 +20~50</p>
              </div>
              <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/30 text-center">
                <p className="text-red-400 text-2xl mb-1">❄️</p>
                <p className="font-semibold text-red-400">冷战事件</p>
                <p className="text-sm text-gray-400">恩爱值 -10~20</p>
              </div>
            </div>
          </MagicCard>

          <MagicCard>
            <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
              <Swords className="w-5 h-5 text-magic-purple" />
              专属副本
            </h2>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">今日剩余挑战次数</span>
                <span className="font-bold text-magic-gold">{marriage.dungeonRemaining || 3}/3</span>
              </div>
              <ProgressBar
                value={marriage.dungeonRemaining || 3}
                max={3}
                color="purple"
                showPercentage={false}
              />
            </div>

            <p className="text-gray-400 mb-4 text-sm">
              双人组队挑战专属副本，获得稀有道具和大量恩爱值
            </p>

            <MagicButton
              onClick={() => enterDungeon(marriage.id)}
              disabled={(marriage.dungeonRemaining || 3) <= 0}
              className="w-full"
            >
              <Swords className="w-5 h-5" />
              挑战双人副本
            </MagicButton>
          </MagicCard>
        </div>

        <MagicCard hover={false}>
          <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-magic-gold" />
            双人技能
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marriage.skills?.map((skill: SkillUnlock, index: number) => (
              <motion.div
                key={skill.skillId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MagicCard
                  className={`p-4 h-full ${
                    skill.unlocked ? '' : 'opacity-60 grayscale'
                  }`}
                  hover={false}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-4xl">{getSkillIcon(skill.skill?.type || 'buff')}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold">{skill.skill?.name || '未知技能'}</h4>
                        {skill.unlocked ? (
                          <Unlock className="w-4 h-4 text-green-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-400 my-1">
                        {skill.skill?.description || '神秘技能'}
                      </p>
                      <p className="text-xs text-magic-gold">
                        需要恩爱值: {skill.requiredLoveValue}
                      </p>
                      {skill.unlocked && (
                        <p className="text-xs text-green-400 mt-1">
                          已解锁 · Lv.{skill.skillLevel || 1}
                        </p>
                      )}
                    </div>
                  </div>
                </MagicCard>
              </motion.div>
            ))}
          </div>
        </MagicCard>
      </div>
    </div>
  );
}
