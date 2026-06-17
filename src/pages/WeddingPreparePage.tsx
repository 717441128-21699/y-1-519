import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Sparkles, Clock, Coins, Users, Crown, Heart } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { MagicCard } from '../components/MagicCard';
import { MagicButton } from '../components/MagicButton';
import { ProgressBar } from '../components/ProgressBar';
import type { WeddingStyle, Decoration } from '../../shared/types';
import { weddingApi } from '../utils/apiClient';

const weddingStyles = [
  { id: 'fairyTale', name: '梦幻童话', icon: '🏰', baseLuxury: 50, description: '粉色浪漫，童话般的婚礼' },
  { id: 'darkFantasy', name: '黑暗幻想', icon: '🌙', baseLuxury: 55, description: '神秘暗黑风格，独特魅力' },
  { id: 'xianxia', name: '仙侠情缘', icon: '⛩️', baseLuxury: 60, description: '仙侠古风，仙风道骨' },
  { id: 'starryNight', name: '星空主题', icon: '✨', baseLuxury: 65, description: '璀璨星空，浪漫永恒' },
  { id: 'oceanDream', name: '海洋之梦', icon: '🌊', baseLuxury: 58, description: '深海浪漫，神秘梦幻' },
  { id: 'forestWonder', name: '森林奇幻', icon: '🌲', baseLuxury: 52, description: '自然清新，精灵祝福' },
];

const decorations: Decoration[] = [
  { id: 'd1', name: '玫瑰花海', icon: '🌹', luxuryBonus: 15, cost: 100, category: 'flower' },
  { id: 'd2', name: '水晶吊灯', icon: '💎', luxuryBonus: 20, cost: 200, category: 'lighting' },
  { id: 'd3', name: '红毯之路', icon: '👑', luxuryBonus: 12, cost: 80, category: 'floor' },
  { id: 'd4', name: '魔法喷泉', icon: '⛲', luxuryBonus: 18, cost: 150, category: 'special' },
  { id: 'd5', name: '烟花秀', icon: '🎆', luxuryBonus: 25, cost: 300, category: 'special' },
  { id: 'd6', name: '白鸽放飞', icon: '🕊️', luxuryBonus: 10, cost: 60, category: 'special' },
  { id: 'd7', name: '豪华餐桌', icon: '🍷', luxuryBonus: 16, cost: 120, category: 'furniture' },
  { id: 'd8', name: '音乐乐队', icon: '🎵', luxuryBonus: 14, cost: 90, category: 'entertainment' },
];

export default function WeddingPreparePage() {
  const { currentPlayer, marriage, guildHall, loadCurrentPlayer, loadMarriage, loadGuildHall } = useGameStore();
  const [selectedStyle, setSelectedStyle] = useState<WeddingStyle>('fairyTale');
  const [selectedDecorations, setSelectedDecorations] = useState<string[]>([]);
  const [luxuryScore, setLuxuryScore] = useState(0);
  const [estimatedGift, setEstimatedGift] = useState(0);
  const [countdown, setCountdown] = useState(300);
  const [step, setStep] = useState<'style' | 'decorate' | 'confirm'>('style');
  const [createdWeddingId, setCreatedWeddingId] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentPlayer();
  }, [loadCurrentPlayer]);

  useEffect(() => {
    if (currentPlayer) {
      loadMarriage(currentPlayer.id);
      loadGuildHall(currentPlayer.id);
    }
  }, [currentPlayer, loadMarriage, loadGuildHall]);

  useEffect(() => {
    calculateLuxury();
  }, [selectedStyle, selectedDecorations]);

  const calculateLuxury = async () => {
    try {
      const response = await weddingApi.calculateLuxury({
        style: selectedStyle,
        decorations: selectedDecorations,
      });
      if (response.success) {
        const data = response.data as { luxuryScore: number; estimatedGift: number };
        setLuxuryScore(data.luxuryScore);
        setEstimatedGift(data.estimatedGift);
      }
    } catch (error) {
      console.error('计算豪华度失败', error);
    }
  };

  const toggleDecoration = (id: string) => {
    setSelectedDecorations((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const currentStyle = weddingStyles.find((s) => s.id === selectedStyle);

  const totalCost = selectedDecorations.reduce((sum, id) => {
    const deco = decorations.find((d) => d.id === id);
    return sum + (deco?.cost || 0);
  }, 0);

  const startWedding = async () => {
    if (!marriage) return;

    try {
      const startTime = new Date(Date.now() + countdown * 1000).toISOString();
      const response = await weddingApi.createWedding({
        marriageId: marriage.id,
        style: selectedStyle,
        decorations: selectedDecorations,
        startTime,
        luxuryScore,
        estimatedGift,
      });

      if (response.success && response.data) {
        const wedding = response.data as { id: string };
        setCreatedWeddingId(wedding.id);
        setStep('confirm');

        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              window.location.href = `/wedding/live/${wedding.id}`;
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      console.error('创建婚礼失败', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!marriage) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <MagicCard className="text-center p-12 max-w-md">
          <div className="text-6xl mb-4">💒</div>
          <h2 className="font-display text-2xl font-bold mb-4">需要先结婚</h2>
          <p className="text-gray-400 mb-6">你还没有伴侣，先去求婚吧！</p>
          <MagicButton onClick={() => window.location.href = '/proposal'}>
            <Heart className="w-5 h-5" />
            去求婚
          </MagicButton>
        </MagicCard>
      </div>
    );
  }

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
            筹备婚礼
            <Crown className="w-10 h-10 text-magic-gold" />
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-400">
            <span>
              {marriage.partner1Name} 💖 {marriage.partner2Name}
            </span>
          </div>
        </motion.div>

        {step === 'style' && (
          <div>
            <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
            <Palette className="w-5 h-5 text-magic-purple" />
            选择婚礼风格
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {weddingStyles.map((style, index) => (
              <motion.div
                key={style.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MagicCard
                  onClick={() => setSelectedStyle(style.id as WeddingStyle)}
                  className={`h-full p-6 ${selectedStyle === style.id ? 'ring-2 ring-magic-pink' : ''}`}
                  glow={selectedStyle === style.id}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">{style.icon}</div>
                    <h3 className="font-display text-xl font-bold mb-2">{style.name}</h3>
                    <p className="text-sm text-gray-400 mb-3">{style.description}</p>
                    <div className="flex items-center justify-center gap-2 text-magic-gold">
                      <Sparkles className="w-4 h-4" />
                      <span>基础豪华度: {style.baseLuxury}</span>
                    </div>
                  </div>
                </MagicCard>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-end">
            <MagicButton onClick={() => setStep('decorate')}>
              下一步：布置礼堂
            </MagicButton>
          </div>
        </div>
        )}

        {step === 'decorate' && (
          <div>
            <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-magic-pink" />
              布置礼堂装饰
            </h2>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {decorations.map((deco, index) => (
                    <motion.div
                      key={deco.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <MagicCard
                        onClick={() => toggleDecoration(deco.id)}
                        className={`p-4 text-center ${selectedDecorations.includes(deco.id) ? 'ring-2 ring-magic-gold' : ''}`}
                      >
                        <div className="text-4xl mb-2">{deco.icon}</div>
                        <h4 className="font-semibold text-sm mb-1">{deco.name}</h4>
                        <div className="flex items-center justify-center gap-1 text-xs text-magic-gold">
                          <Sparkles className="w-3 h-3" />
                          +{deco.luxuryBonus}
                        </div>
                        <div className="flex items-center justify-center gap-1 text-xs text-magic-purple">
                          <Coins className="w-3 h-3" />
                          {deco.cost} 金币
                        </div>
                      </MagicCard>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <MagicCard hover={false}>
                  <h3 className="font-display text-lg font-bold mb-4">当前配置</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">婚礼风格</p>
                      <p className="font-semibold">
                        {currentStyle?.icon} {currentStyle?.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-2">已选装饰 ({selectedDecorations.length})</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedDecorations.map((id) => {
                          const deco = decorations.find((d) => d.id === id);
                          return (
                            <span key={id} className="text-2xl" title={deco?.name}>
                              {deco?.icon}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <ProgressBar
                      value={luxuryScore}
                      max={200}
                      label="豪华度"
                      color="gold"
                    />

                    <div className="p-4 bg-magic-darker/50 rounded-xl">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">装饰费用</span>
                        <span className="font-bold text-magic-purple">{totalCost} 金币</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">预计礼金</span>
                        <span className="font-bold text-magic-gold">{estimatedGift} 金币</span>
                      </div>
                      {guildHall && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">公会加成</span>
                          <span className="font-bold text-magic-green">+{guildHall.level * 5}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </MagicCard>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <MagicButton variant="secondary" onClick={() => setStep('style')}>
                返回选择风格
              </MagicButton>
              <MagicButton onClick={startWedding} disabled={selectedDecorations.length === 0}>
                <Clock className="w-5 h-5" />
                开始婚礼倒计时
              </MagicButton>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <MagicCard hover={false} className="text-center p-12">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-8xl mb-6"
            >
              💒
            </motion.div>
            
            <h2 className="font-display text-3xl font-bold mb-2">婚礼即将开始！</h2>
            <p className="text-gray-400 mb-6">全服公告已发送</p>

            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-6xl font-display font-bold text-magic-gold mb-8"
            >
              {formatTime(countdown)}
            </motion.div>

            <div className="flex items-center justify-center gap-8 mb-8">
              <Users className="w-6 h-6 text-magic-purple" />
              <span className="text-lg">已有 <span className="text-magic-gold font-bold">128</span> 位宾客在线</span>
            </div>

            <div className="max-w-md mx-auto">
              <ProgressBar
                value={300 - countdown}
                max={300}
                color="pink"
                label="婚礼准备进度"
              />
            </div>

            <p className="text-sm text-gray-400 mt-6">
              {currentStyle?.icon} {currentStyle?.name} 风格 · 豪华度 {luxuryScore}
            </p>
          </MagicCard>
        )}
      </div>
    </div>
  );
}
