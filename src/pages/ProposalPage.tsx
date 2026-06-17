import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, AlertTriangle, Star, UserPlus } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { MagicCard } from '../components/MagicCard';
import { MagicButton } from '../components/MagicButton';
import { ItemCard } from '../components/ItemCard';
import { PlayerAvatar } from '../components/PlayerAvatar';
import { ProgressBar } from '../components/ProgressBar';
import type { Item, Player } from '../../shared/types';
import { proposalApi } from '../utils/apiClient';

export default function ProposalPage() {
  const { currentPlayer, players, items, loadPlayers, loadItems, submitProposal, loading } = useGameStore();
  const [selectedTarget, setSelectedTarget] = useState<Player | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [successRate, setSuccessRate] = useState<number | null>(null);
  const [intimacy, setIntimacy] = useState<number>(0);
  const [qualityBonus, setQualityBonus] = useState<number>(0);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; randomEvent?: string; successRate?: number } | null>(null);

  useEffect(() => {
    loadPlayers();
    loadItems();
  }, [loadPlayers, loadItems]);

  useEffect(() => {
    if (selectedTarget && selectedItem && currentPlayer) {
      calculateSuccessRate();
    } else {
      setSuccessRate(null);
      setIntimacy(0);
      setQualityBonus(0);
    }
  }, [selectedTarget, selectedItem, currentPlayer]);

  const calculateSuccessRate = async () => {
    if (!currentPlayer || !selectedTarget || !selectedItem) return;
    
    try {
      const response = await proposalApi.calculate({
        proposerId: currentPlayer.id,
        targetId: selectedTarget.id,
        tokenItemId: selectedItem.id,
      });
      if (response.success) {
        const data = response.data as { successRate: number; intimacy: number; qualityBonus: number };
        setSuccessRate(data.successRate);
        setIntimacy(data.intimacy);
        setQualityBonus(data.qualityBonus);
      }
    } catch (error) {
      console.error('计算成功率失败', error);
    }
  };

  const availableTargets = players.filter((p) => p.id !== currentPlayer?.id);

  const handleSubmit = async () => {
    if (!currentPlayer || !selectedTarget || !selectedItem) return;

    const response = await submitProposal({
      proposerId: currentPlayer.id,
      targetId: selectedTarget.id,
      tokenItemId: selectedItem.id,
    });

    if (response) {
      setResult(response);
      setShowResult(true);
    }
  };

  const handleResultClose = () => {
    setShowResult(false);
    if (result?.success) {
      window.location.href = '/marriage';
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Heart className="w-10 h-10 text-magic-pink animate-heartbeat" />
            浪漫求婚
            <Heart className="w-10 h-10 text-magic-pink animate-heartbeat" />
          </h1>
          <p className="text-gray-400">选择你的心仪对象，献上定情信物，开启浪漫之旅</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-magic-purple" />
              选择求婚对象
            </h2>
            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto scrollbar-magic pr-2">
              {availableTargets.map((player) => (
                <MagicCard
                  key={player.id}
                  onClick={() => setSelectedTarget(player)}
                  className={`p-4 text-center ${
                    selectedTarget?.id === player.id
                      ? 'ring-2 ring-magic-pink ring-offset-2 ring-offset-magic-darker'
                      : ''
                  }`}
                >
                  <PlayerAvatar player={player} size="lg" showName showLevel />
                  <p className="text-sm text-gray-400 mt-2">{player.class}</p>
                </MagicCard>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-magic-gold" />
              选择定情信物
            </h2>
            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto scrollbar-magic pr-2">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  selected={selectedItem?.id === item.id}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </div>
          </div>
        </div>

        {(selectedTarget || selectedItem) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <MagicCard hover={false}>
              <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-magic-purple" />
                求婚预测
              </h3>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">亲密度</p>
                  <ProgressBar
                    value={intimacy}
                    max={100}
                    color="pink"
                    label={selectedTarget ? `与 ${selectedTarget.name}` : ''}
                  />
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">道具加成</p>
                  <div className="text-3xl font-bold text-magic-gold">
                    {qualityBonus > 0 ? `+${qualityBonus}%` : '--'}
                  </div>
                  {selectedItem && (
                    <p className="text-sm text-gray-400">{selectedItem.name}</p>
                  )}
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">预计成功率</p>
                  <motion.div
                    key={successRate}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-4xl font-bold ${
                      successRate === null
                        ? 'text-gray-500'
                        : successRate >= 70
                        ? 'text-green-400'
                        : successRate >= 40
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}
                  >
                    {successRate !== null ? `${successRate}%` : '--'}
                  </motion.div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-magic-darker/50 rounded-xl border border-magic-purple/30">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-400 mb-1">随机事件提示</p>
                    <p className="text-sm text-gray-400">
                      求婚过程中有10%概率触发「情劫」（成功率-20%），15%概率触发「天降祥瑞」（成功率+20%）
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <MagicButton
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!selectedTarget || !selectedItem || loading.proposal}
                  loading={loading.proposal}
                >
                  <Heart className="w-5 h-5" />
                  {selectedTarget && selectedItem
                    ? `向 ${selectedTarget.name} 求婚`
                    : '请选择对象和信物'}
                </MagicButton>
              </div>
            </MagicCard>
          </motion.div>
        )}

        <AnimatePresence>
          {showResult && result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={handleResultClose}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-md w-full"
              >
                <MagicCard hover={false} glow={result.success} className="text-center p-8">
                  <motion.div
                    animate={{ rotate: result.success ? [0, 10, -10, 0] : [0, -5, 5, 0] }}
                    transition={{ duration: 0.5, repeat: 3 }}
                    className="text-7xl mb-4"
                  >
                    {result.success ? '💖' : '💔'}
                  </motion.div>

                  {result.randomEvent && (
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className={`mb-4 px-4 py-2 rounded-full inline-block ${
                        result.randomEvent === 'heavenlyBlessing'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {result.randomEvent === 'heavenlyBlessing' ? '🌟 天降祥瑞！' : '⚡ 情劫降临！'}
                    </motion.div>
                  )}

                  <h2 className={`font-display text-3xl font-bold mb-4 ${
                    result.success ? 'text-magic-pink' : 'text-gray-400'
                  }`}>
                    {result.success ? '求婚成功！' : '求婚失败...'}
                  </h2>
                  
                  {result.successRate !== undefined && (
                    <div className="mb-4 p-3 bg-magic-darker/50 rounded-lg">
                      <p className="text-sm text-gray-400">实际成功率</p>
                      <p className={`text-2xl font-bold ${
                        result.successRate >= 70 ? 'text-green-400' :
                        result.successRate >= 40 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {result.successRate}%
                      </p>
                    </div>
                  )}
                  
                  <p className="text-gray-300 mb-6">{result.message}</p>
                  
                  {result.success && selectedTarget && (
                    <p className="text-magic-gold mb-6">
                      恭喜你与 {selectedTarget.name} 结为魔法伴侣！
                    </p>
                  )}

                  <MagicButton onClick={handleResultClose}>
                    {result.success ? '前往婚姻页面' : '再试一次'}
                  </MagicButton>
                </MagicCard>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
