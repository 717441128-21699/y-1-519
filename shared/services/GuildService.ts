import type { GuildWeddingHall, ContributionRecord } from '../types';
import { mockGuildHalls, mockGuilds, getPlayerById, generateId } from '../mockData';

export class GuildService {
  static getExpToNextLevel(level: number): number {
    return Math.floor(1000 * Math.pow(1.5, level - 1));
  }

  static getLuxuryBonus(level: number): number {
    return level * 0.05;
  }

  static getDungeonBonus(level: number): number {
    return level * 0.04;
  }

  static getGuildHall(guildId: string): GuildWeddingHall | undefined {
    const hall = mockGuildHalls.find(h => h.guildId === guildId);
    if (hall) {
      hall.guild = mockGuilds.find(g => g.id === guildId);
      hall.contributions = hall.contributions.map(c => ({
        ...c,
        player: getPlayerById(c.playerId),
      }));
      if (hall.upgradeApplicantId) {
        hall.upgradeApplicant = getPlayerById(hall.upgradeApplicantId);
      }
    }
    return hall;
  }

  static getGuildHallByPlayer(playerId: string): GuildWeddingHall | undefined {
    const player = getPlayerById(playerId);
    if (!player?.guildId) return undefined;
    return this.getGuildHall(player.guildId);
  }

  static contribute(playerId: string, amount: number): { success: boolean; message: string; hall?: GuildWeddingHall } {
    const player = getPlayerById(playerId);
    if (!player?.guildId) {
      return { success: false, message: '您还没有加入公会！' };
    }

    const hall = this.getGuildHall(player.guildId);
    if (!hall) {
      return { success: false, message: '公会婚庆堂不存在！' };
    }

    if (amount <= 0) {
      return { success: false, message: '贡献数量必须大于0！' };
    }

    hall.exp = (hall.exp || 0) + amount;
    hall.currentContribution = (hall.currentContribution || 0) + amount;
    hall.pendingApproval = false;
    hall.pendingUpgrade = false;
    hall.upgradeApplicantId = null;

    const record: ContributionRecord = {
      id: generateId(),
      hallId: hall.id,
      playerId,
      player,
      amount,
      createdAt: new Date().toISOString(),
    };
    hall.contributions.unshift(record);

    if (hall.myContribution !== undefined) {
      hall.myContribution += amount;
    }

    const expToNext = hall.expToNext || this.getExpToNextLevel(hall.level);
    const upgradeRequired = hall.upgradeRequired || this.getExpToNextLevel(hall.level);

    if (hall.currentContribution >= upgradeRequired || hall.exp >= expToNext) {
      hall.pendingApproval = true;
      hall.pendingUpgrade = true;
      hall.upgradeApplicantId = playerId;
      hall.upgradeApplicant = player;
      return {
        success: true,
        hall,
        message: `🎉 贡献成功！婚庆堂已满足升级条件，请等待会长/副会长审批！`,
      };
    }

    return {
      success: true,
      hall,
      message: `贡献成功！获得 ${amount} 贡献值！当前进度：${hall.currentContribution}/${hall.upgradeRequired}`,
    };
  }

  static requestUpgrade(playerId: string): { success: boolean; message: string; hall?: GuildWeddingHall } {
    const player = getPlayerById(playerId);
    if (!player?.guildId) {
      return { success: false, message: '您还没有加入公会！' };
    }

    if (player.guildRole !== 'president' && player.guildRole !== 'vicePresident') {
      return { success: false, message: '只有会长或副会长才能申请升级！' };
    }

    const hall = this.getGuildHall(player.guildId);
    if (!hall) {
      return { success: false, message: '公会婚庆堂不存在！' };
    }

    if (hall.exp < hall.expToNext) {
      return { success: false, message: `经验不足！当前：${hall.exp}/${hall.expToNext}` };
    }

    if (hall.pendingApproval) {
      return { success: false, message: '已有升级申请待审批！' };
    }

    hall.pendingApproval = true;
    hall.upgradeApplicantId = playerId;

    return {
      success: true,
      hall,
      message: '升级申请已提交，请等待审批！',
    };
  }

  static approveUpgrade(playerId: string, approve: boolean): { success: boolean; message: string; hall?: GuildWeddingHall } {
    const player = getPlayerById(playerId);
    if (!player?.guildId) {
      return { success: false, message: '您还没有加入公会！' };
    }

    if (player.guildRole !== 'president' && player.guildRole !== 'vicePresident' &&
        player.guildRole !== 'leader' && player.guildRole !== 'officer') {
      return { success: false, message: '只有会长或副会长才能审批！' };
    }

    const hall = this.getGuildHall(player.guildId);
    if (!hall) {
      return { success: false, message: '公会婚庆堂不存在！' };
    }

    if (!hall.pendingApproval && !hall.pendingUpgrade) {
      return { success: false, message: '没有待审批的升级申请！' };
    }

    if (approve) {
      const oldExpToNext = hall.expToNext || this.getExpToNextLevel(hall.level);
      const oldUpgradeRequired = hall.upgradeRequired || this.getExpToNextLevel(hall.level);
      
      hall.level++;
      hall.exp = (hall.exp || 0) - oldExpToNext;
      hall.currentContribution = (hall.currentContribution || 0) - oldUpgradeRequired;
      hall.expToNext = this.getExpToNextLevel(hall.level);
      hall.upgradeRequired = this.getExpToNextLevel(hall.level);
      hall.luxuryBonus = this.getLuxuryBonus(hall.level);
      hall.dungeonBonus = this.getDungeonBonus(hall.level);
      hall.pendingApproval = false;
      hall.pendingUpgrade = false;
      hall.upgradeApplicantId = null;
      hall.upgradeApplicant = undefined;

      return {
        success: true,
        hall,
        message: `🎉 婚庆堂升级成功！当前等级：${hall.level}，豪华度加成：${(hall.luxuryBonus * 100).toFixed(0)}%，副本加成：${(hall.dungeonBonus * 100).toFixed(0)}%`,
      };
    } else {
      hall.pendingApproval = false;
      hall.pendingUpgrade = false;
      hall.upgradeApplicantId = null;
      hall.upgradeApplicant = undefined;
      return {
        success: true,
        hall,
        message: '升级申请已被驳回。',
      };
    }
  }

  static getContributionRanking(guildId: string, limit: number = 10): { playerId: string; playerName: string; playerAvatar: string; totalAmount: number; rank: number }[] {
    const hall = this.getGuildHall(guildId);
    if (!hall) return [];

    const contributionMap = new Map<string, number>();
    hall.contributions.forEach(c => {
      const current = contributionMap.get(c.playerId) || 0;
      contributionMap.set(c.playerId, current + c.amount);
    });

    return Array.from(contributionMap.entries())
      .map(([playerId, totalAmount]) => {
        const player = getPlayerById(playerId);
        return {
          playerId,
          playerName: player?.name || '未知玩家',
          playerAvatar: player?.avatar || '👤',
          totalAmount,
          rank: 0,
        };
      })
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, limit)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  }

  static getAllGuildHalls(): GuildWeddingHall[] {
    return mockGuildHalls.map(h => {
      const hall = { ...h };
      hall.guild = mockGuilds.find(g => g.id === h.guildId);
      return hall;
    });
  }
}
