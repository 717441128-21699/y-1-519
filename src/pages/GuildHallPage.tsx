import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Coins, ArrowUpCircle, CheckCircle, XCircle, Crown, Sparkles } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { MagicCard } from '../components/MagicCard';
import { MagicButton } from '../components/MagicButton';
import { ProgressBar } from '../components/ProgressBar';
import { PlayerAvatar } from '../components/PlayerAvatar';

export default function GuildHallPage() {
  const { currentPlayer, guildHall, loadGuildHall, contributeGuild, approveUpgrade, loading } = useGameStore();
  const [contributeAmount, setContributeAmount] = useState(100);
  const [showApproveModal, setShowApproveModal] = useState(false);

  useEffect(() => {
    if (currentPlayer) {
      loadGuildHall(currentPlayer.id);
    }
  }, [currentPlayer, loadGuildHall]);

  const handleContribute = () => {
    if (!currentPlayer) return;
    contributeGuild(currentPlayer.id, contributeAmount);
  };

  const handleApprove = (approve: boolean) => {
    if (!currentPlayer) return;
    approveUpgrade(currentPlayer.id, approve);
    setShowApproveModal(false);
  };

  const canApprove = currentPlayer?.guildRole === 'leader' || currentPlayer?.guildRole === 'officer';

  if (!guildHall) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <MagicCard className="text-center p-12 max-w-md">
          <div className="text-6xl mb-4">🏰</div>
          <h2 className="font-display text-2xl font-bold mb-4">暂无公会</h2>
          <p className="text-gray-400 mb-6">请先加入公会，才能使用公会婚庆堂功能</p>
        </MagicCard>
      </div>
    );
  }

  const nextLevel = guildHall.level + 1;
  const upgradeProgress = (guildHall.currentContribution / guildHall.upgradeRequired) * 100;
  const needsApproval = guildHall.pendingUpgrade && canApprove;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Building2 className="w-10 h-10 text-magic-blue" />
            公会婚庆堂
            <Building2 className="w-10 h-10 text-magic-blue" />
          </h1>
          <p className="text-gray-400">{guildHall.guildName} 的联合婚庆堂</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <MagicCard hover={false} className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="text-center">
                  <div className="text-8xl mb-4">🏰</div>
                  <div className="flex items-center justify-center gap-2">
                    <Crown className="w-6 h-6 text-magic-gold" />
                    <span className="font-display text-3xl font-bold text-magic-gold">
                      Lv.{guildHall.level}
                    </span>
                  </div>
                  <p className="text-gray-400 mt-2">
                    {guildHall.level === 1 && '初创婚庆堂'}
                    {guildHall.level === 2 && '精致婚庆堂'}
                    {guildHall.level === 3 && '豪华婚庆堂'}
                    {guildHall.level >= 4 && '璀璨婚庆堂'}
                  </p>
                </div>

                <div className="flex-1 w-full">
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">升级进度</span>
                      <span className="text-magic-gold font-bold">
                        {guildHall.currentContribution} / {guildHall.upgradeRequired}
                      </span>
                    </div>
                    <ProgressBar
                      value={guildHall.currentContribution}
                      max={guildHall.upgradeRequired}
                      color="blue"
                      showPercentage={false}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-magic-purple/10 rounded-xl border border-magic-purple/30 text-center">
                      <p className="text-3xl font-bold text-magic-purple">+{guildHall.level * 5}%</p>
                      <p className="text-sm text-gray-400">婚礼豪华度加成</p>
                    </div>
                    <div className="p-4 bg-magic-pink/10 rounded-xl border border-magic-pink/30 text-center">
                      <p className="text-3xl font-bold text-magic-pink">+{guildHall.level * 10}%</p>
                      <p className="text-sm text-gray-400">副本收益加成</p>
                    </div>
                  </div>
                </div>
              </div>
            </MagicCard>
          </div>

          <div className="space-y-6">
            <MagicCard hover={false}>
              <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <Coins className="w-5 h-5 text-magic-gold" />
                贡献系统
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">我的贡献</p>
                  <p className="text-2xl font-bold text-magic-gold">
                    {guildHall.myContribution?.toLocaleString() || 0}
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="number"
                    value={contributeAmount}
                    onChange={(e) => setContributeAmount(Math.max(10, Number(e.target.value)))}
                    className="magic-input flex-1"
                    min={10}
                  />
                  <MagicButton onClick={handleContribute} loading={loading.guildHall}>
                    贡献
                  </MagicButton>
                </div>

                <div className="flex gap-2">
                  {[100, 500, 1000].map((amount) => (
                    <MagicButton
                      key={amount}
                      size="sm"
                      variant="secondary"
                      onClick={() => setContributeAmount(amount)}
                    >
                      {amount}
                    </MagicButton>
                  ))}
                </div>
              </div>
            </MagicCard>

            {needsApproval && (
              <MagicCard hover={false} className="border-2 border-yellow-500/50">
                <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                  <ArrowUpCircle className="w-5 h-5 text-yellow-400" />
                  待审批升级
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  有会员申请升级婚庆堂到 Lv.{nextLevel}
                </p>
                <div className="flex gap-2">
                  <MagicButton
                    variant="success"
                    onClick={() => handleApprove(true)}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    批准
                  </MagicButton>
                  <MagicButton
                    variant="danger"
                    onClick={() => handleApprove(false)}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4" />
                    拒绝
                  </MagicButton>
                </div>
              </MagicCard>
            )}

            {guildHall.pendingUpgrade && !canApprove && (
              <MagicCard hover={false} className="border-2 border-yellow-500/50">
                <h3 className="font-display text-lg font-bold mb-2 flex items-center gap-2">
                  <ArrowUpCircle className="w-5 h-5 text-yellow-400" />
                  升级审核中
                </h3>
                <p className="text-sm text-gray-400">
                  升级到 Lv.{nextLevel} 正在等待会长/副会长审批
                </p>
              </MagicCard>
            )}
          </div>
        </div>

        <MagicCard hover={false}>
          <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-magic-purple" />
            贡献排行榜
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-magic-purple/30">
                  <th className="pb-3">排名</th>
                  <th className="pb-3">玩家</th>
                  <th className="pb-3">职业</th>
                  <th className="pb-3">职位</th>
                  <th className="pb-3 text-right">总贡献</th>
                </tr>
              </thead>
              <tbody>
                {guildHall.contributions?.map((contribution, index) => (
                  <motion.tr
                    key={contribution.playerId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-magic-purple/10 hover:bg-magic-purple/10"
                  >
                    <td className="py-3">
                      <span className={`font-bold ${
                        index === 0 ? 'text-yellow-400' :
                        index === 1 ? 'text-gray-300' :
                        index === 2 ? 'text-amber-600' : 'text-gray-500'
                      }`}>
                        #{index + 1}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-magic-gradient flex items-center justify-center text-lg">
                          {contribution.player?.avatar || '🧙'}
                        </div>
                        <span className="font-semibold">{contribution.player?.name || '未知玩家'}</span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-400">
                      {contribution.player?.class || '-'}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        contribution.player?.guildRole === 'leader' ? 'bg-yellow-500/20 text-yellow-400' :
                        contribution.player?.guildRole === 'officer' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {contribution.player?.guildRole === 'leader' ? '会长' :
                         contribution.player?.guildRole === 'officer' ? '副会长' : '会员'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="font-bold text-magic-gold">
                        {contribution.amount.toLocaleString()}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </MagicCard>

        <MagicCard hover={false} className="mt-6">
          <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-magic-gold" />
            等级特权
          </h2>

          <div className="grid md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((level) => (
              <MagicCard
                key={level}
                hover={false}
                className={`text-center p-6 ${
                  guildHall.level >= level ? '' : 'opacity-50 grayscale'
                }`}
                glow={guildHall.level >= level}
              >
                <div className="text-4xl mb-2">
                  {level === 1 && '🏰'}
                  {level === 2 && '💎'}
                  {level === 3 && '👑'}
                  {level === 4 && '🌟'}
                </div>
                <h3 className="font-display font-bold mb-2">Lv.{level}</h3>
                <p className="text-sm text-gray-400 mb-2">
                  {level === 1 && '初创婚庆堂'}
                  {level === 2 && '精致婚庆堂'}
                  {level === 3 && '豪华婚庆堂'}
                  {level === 4 && '璀璨婚庆堂'}
                </p>
                <div className="text-xs text-magic-gold">
                  +{level * 5}% 豪华度 · +{level * 10}% 收益
                </div>
                {guildHall.level >= level && (
                  <div className="mt-2 text-green-400 text-xs">✓ 已解锁</div>
                )}
              </MagicCard>
            ))}
          </div>
        </MagicCard>
      </div>
    </div>
  );
}
