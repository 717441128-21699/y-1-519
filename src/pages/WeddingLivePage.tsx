import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Coins, Users, Sparkles, Send, Crown, Music } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { MagicCard } from '../components/MagicCard';
import { MagicButton } from '../components/MagicButton';
import { PlayerAvatar } from '../components/PlayerAvatar';
import type { BlessingMessage } from '../../shared/types';

export default function WeddingLivePage() {
  const { currentPlayer, wedding, blessingMessages, loadWedding, sendBlessing, addBlessingMessage, blessing } = useGameStore();
  const [message, setMessage] = useState('');
  const [giftAmount, setGiftAmount] = useState(100);
  const [blessingPoints, setBlessingPoints] = useState(0);
  const [interactions, setInteractions] = useState(0);
  const [weddingPhase, setWeddingPhase] = useState<'ceremony' | 'vows' | 'rings' | 'kiss' | 'celebration'>('ceremony');
  const [showFireworks, setShowFireworks] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadWedding('w1');
  }, [loadWedding]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [blessingMessages]);

  useEffect(() => {
    const phases: Array<'ceremony' | 'vows' | 'rings' | 'kiss' | 'celebration'> = ['ceremony', 'vows', 'rings', 'kiss', 'celebration'];
    let index = 0;
    
    const interval = setInterval(() => {
      index = (index + 1) % phases.length;
      setWeddingPhase(phases[index]);
      
      if (phases[index] === 'kiss') {
        setShowFireworks(true);
        setTimeout(() => setShowFireworks(false), 3000);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlessingPoints((prev) => prev + Math.floor(Math.random() * 10) + 5);
      setInteractions((prev) => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSendBlessing = async () => {
    if (!message.trim() || !currentPlayer || !wedding) return;
    
    const success = await sendBlessing(wedding.id, currentPlayer.id, message, giftAmount);
    if (success) {
      setMessage('');
    }
  };

  const phaseNames = {
    ceremony: '婚礼仪式',
    vows: '新人宣誓',
    rings: '交换戒指',
    kiss: '浪漫亲吻',
    celebration: '欢庆时刻',
  };

  const phaseDescriptions = {
    ceremony: '神圣的婚礼仪式正在进行...',
    vows: '新人正在宣读爱的誓言...',
    rings: '交换象征永恒的戒指...',
    kiss: '浪漫的一吻定终身！',
    celebration: '让我们一起庆祝这美好时刻！',
  };

  const quickBlessings = [
    '百年好合！',
    '永结同心！',
    '早生贵子！',
    '幸福美满！',
    '甜甜蜜蜜！',
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 relative overflow-hidden">
      {showFireworks && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(20)].map((_, i) => (
            <motion.div
            key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
              }}
              transition={{ duration: 2, delay: i * 0.1 }}
              className="absolute text-4xl"
              style={{
                left: `${30 + Math.random() * 40}%`,
                top: `${20 + Math.random() * 40}%`,
              }}
            >
              {['🎆', '✨', '💖', '🌟', '💫'][i % 5]}
            </motion.div>
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-6">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            💒
          </motion.div>
          <h1 className="font-display text-4xl font-bold mb-2 bg-magic-gradient bg-clip-text text-transparent">
            {wedding?.partner1Name} & {wedding?.partner2Name}
          </h1>
          <p className="text-gray-400">婚礼正在进行中</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MagicCard hover={false} className="mb-6 overflow-hidden">
              <div className="relative h-80 bg-gradient-to-b from-magic-purple/30 to-magic-pink/30 rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-8xl mb-4"
                    >
                      {wedding?.style === 'fairyTale' && '🏰'}
                      {wedding?.style === 'starryNight' && '✨'}
                      {wedding?.style === 'xianxia' && '⛩️'}
                      {wedding?.style === 'darkFantasy' && '🌙'}
                      {wedding?.style === 'oceanDream' && '🌊'}
                      {wedding?.style === 'forestWonder' && '🌲'}
                      {!wedding?.style && '💒'}
                    </motion.div>
                    
                    <div className="flex items-center justify-center gap-8 mb-6">
                      <PlayerAvatar player={wedding?.partner1 as any} size="lg" showName />
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-5xl"
                      >
                        💖
                      </motion.div>
                      <PlayerAvatar player={wedding?.partner2 as any} size="lg" showName />
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={weddingPhase}
                      className="mt-8"
                    >
                      <h2 className="font-display text-2xl font-bold text-magic-gold mb-2">
                        {phaseNames[weddingPhase]}
                      </h2>
                      <p className="text-gray-300">{phaseDescriptions[weddingPhase]}</p>
                    </motion.div>
                  </div>
                </div>

                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -300],
                      opacity: [1, 0],
                      x: Math.sin(i) * 50,
                    }}
                    transition={{
                      duration: 4 + Math.random() * 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                    className="absolute text-2xl"
                    style={{
                      left: `${10 + Math.random() * 80}%`,
                      bottom: '0',
                    }}
                  >
                    {['🌸', '✨', '💖', '🌹', '💕'][i % 5]}
                  </motion.div>
                ))}
              </div>
            </MagicCard>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <MagicCard hover={false} className="text-center p-4">
                <div className="text-3xl mb-2">✨</div>
                <p className="text-2xl font-bold text-magic-gold">{blessingPoints.toLocaleString()}</p>
                <p className="text-sm text-gray-400">祝福积分</p>
              </MagicCard>
              <MagicCard hover={false} className="text-center p-4">
                <div className="text-3xl mb-2">💬</div>
                <p className="text-2xl font-bold text-magic-purple">{interactions.toLocaleString()}</p>
                <p className="text-sm text-gray-400">互动次数</p>
              </MagicCard>
              <MagicCard hover={false} className="text-center p-4">
                <div className="text-3xl mb-2">💰</div>
                <p className="text-2xl font-bold text-magic-pink">{wedding?.totalGifts?.toLocaleString() || '0'}</p>
                <p className="text-sm text-gray-400">礼金总额</p>
              </MagicCard>
            </div>

            <MagicCard hover={false}>
              <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-magic-purple" />
                实时祝福墙
              </h3>
              
              <div className="h-64 overflow-y-auto scrollbar-magic pr-2 mb-4 space-y-3">
                {blessingMessages.map((msg, index) => (
                  <motion.div
                    key={msg.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3 p-3 bg-magic-darker/50 rounded-xl"
                  >
                    <div className="text-2xl">{msg.playerAvatar || '🧙'}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{msg.playerName}</span>
                        {msg.giftAmount && msg.giftAmount > 0 && (
                          <span className="text-xs text-magic-gold">
                            💰 {msg.giftAmount} 金币
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300">{msg.message}</p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex gap-2 mb-3">
                {quickBlessings.map((blessing) => (
                  <MagicButton
                    key={blessing}
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setMessage(blessing);
                    }}
                  >
                    {blessing}
                  </MagicButton>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="送上你的祝福..."
                  className="magic-input flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendBlessing()}
                />
                <select
                  value={giftAmount}
                  onChange={(e) => setGiftAmount(Number(e.target.value))}
                  className="magic-input w-24"
                >
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                  <option value={500}>500</option>
                  <option value={1000}>1000</option>
                </select>
                <MagicButton onClick={handleSendBlessing} disabled={!message.trim()}>
                  <Send className="w-5 h-5" />
                </MagicButton>
              </div>
            </MagicCard>
          </div>

          <div className="space-y-6">
            <MagicCard hover={false}>
              <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-magic-blue" />
                在线宾客 ({wedding?.guestCount || 128})
              </h3>
              <div className="flex flex-wrap gap-2">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-magic-gradient flex items-center justify-center text-lg"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {['🧙', '🧝', '🧚', '🧛', '🧜', '🧞'][i % 6]}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-magic-purple/30 flex items-center justify-center text-xs text-gray-400">
                  +{wedding?.guestCount ? wedding.guestCount - 20 : 108}
                </div>
              </div>
            </MagicCard>

            <MagicCard hover={false}>
              <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-magic-gold" />
                婚礼详情
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">婚礼风格</span>
                  <span className="font-semibold">
                    {wedding?.style === 'fairyTale' && '🏰 梦幻童话'}
                    {wedding?.style === 'starryNight' && '✨ 星空主题'}
                    {wedding?.style === 'xianxia' && '⛩️ 仙侠情缘'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">豪华度</span>
                  <span className="font-bold text-magic-gold">{wedding?.luxuryScore || 150}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">豪华等级</span>
                  <span className="font-semibold text-magic-purple">
                    {wedding?.luxuryScore && wedding.luxuryScore >= 150 ? '💎 璀璨' :
                     wedding?.luxuryScore && wedding.luxuryScore >= 100 ? '👑 豪华' : '✨ 精致'}
                  </span>
                </div>
              </div>
            </MagicCard>

            <MagicCard hover={false}>
              <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <Music className="w-5 h-5 text-magic-pink" />
                祝福排行榜
              </h3>
              <div className="space-y-2">
                {[
                  { name: '星辰法师', amount: 1000, avatar: '🧙' },
                  { name: '月光精灵', amount: 500, avatar: '🧝' },
                  { name: '暗影刺客', amount: 300, avatar: '🥷' },
                ].map((guest, index) => (
                  <div key={guest.name} className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{guest.avatar}</span>
                      <span className="text-sm">{guest.name}</span>
                    </div>
                    <span className="text-magic-gold font-semibold text-sm">
                      {guest.amount} 💰
                    </span>
                  </div>
                ))}
              </div>
            </MagicCard>
          </div>
        </div>
      </div>
    </div>
  );
}
