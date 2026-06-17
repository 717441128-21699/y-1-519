import type { RankingEntry, RankingType } from '../types';
import { mockMarriages, mockWeddings, mockGuildHalls, getPlayerById } from '../mockData';

export class RankingService {
  static readonly RANKING_CONFIG: { type: RankingType; title: string; icon: string; description: string }[] = [
    { type: 'loveValue', title: '恩爱值排行', icon: '❤️', description: '全服最恩爱的夫妻' },
    { type: 'weddingCount', title: '婚礼次数排行', icon: '💒', description: '举办婚礼最多的夫妻' },
    { type: 'guildContribution', title: '公会贡献排行', icon: '🏰', description: '婚庆堂建设贡献最多的玩家' },
  ];

  static getLoveValueRanking(limit: number = 20): RankingEntry[] {
    const sorted = [...mockMarriages].sort((a, b) => b.loveValue - a.loveValue);
    
    return sorted.slice(0, limit).map((marriage, index) => {
      const player1 = getPlayerById(marriage.player1Id);
      const player2 = getPlayerById(marriage.player2Id);
      
      return {
        rank: index + 1,
        id: marriage.id,
        name: `${player1?.name || '???'} & ${player2?.name || '???'}`,
        avatar: `${player1?.avatar || '👤'}${player2?.avatar || '👤'}`,
        value: marriage.loveValue,
        previousRank: index + 2 - Math.floor(Math.random() * 3),
      };
    });
  }

  static getWeddingCountRanking(limit: number = 20): RankingEntry[] {
    const sorted = [...mockMarriages].sort((a, b) => b.weddingCount - a.weddingCount);
    
    return sorted.slice(0, limit).map((marriage, index) => {
      const player1 = getPlayerById(marriage.player1Id);
      const player2 = getPlayerById(marriage.player2Id);
      
      return {
        rank: index + 1,
        id: marriage.id,
        name: `${player1?.name || '???'} & ${player2?.name || '???'}`,
        avatar: `${player1?.avatar || '👤'}${player2?.avatar || '👤'}`,
        value: marriage.weddingCount,
        previousRank: index + 2 - Math.floor(Math.random() * 3),
      };
    });
  }

  static getGuildContributionRanking(limit: number = 20): RankingEntry[] {
    const contributionMap = new Map<string, number>();
    
    mockGuildHalls.forEach(hall => {
      hall.contributions.forEach(contribution => {
        const current = contributionMap.get(contribution.playerId) || 0;
        contributionMap.set(contribution.playerId, current + contribution.amount);
      });
    });

    const sorted = Array.from(contributionMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);

    return sorted.map(([playerId, totalAmount], index) => {
      const player = getPlayerById(playerId);
      
      return {
        rank: index + 1,
        id: playerId,
        name: player?.name || '???',
        avatar: player?.avatar || '👤',
        value: totalAmount,
        previousRank: index + 2 - Math.floor(Math.random() * 3),
      };
    });
  }

  static getRanking(type: RankingType, limit: number = 20): RankingEntry[] {
    switch (type) {
      case 'loveValue':
        return this.getLoveValueRanking(limit);
      case 'weddingCount':
        return this.getWeddingCountRanking(limit);
      case 'guildContribution':
        return this.getGuildContributionRanking(limit);
      default:
        return [];
    }
  }

  static getPlayerRank(playerId: string, type: RankingType): { rank: number; total: number; value: number } | null {
    const rankings = this.getRanking(type, 1000);
    const total = rankings.length;
    
    if (type === 'guildContribution') {
      const entry = rankings.find(r => r.id === playerId);
      if (entry) {
        return { rank: entry.rank, total, value: entry.value };
      }
    } else {
      const entry = rankings.find(r => {
        const marriage = mockMarriages.find(m => m.id === r.id);
        return marriage?.player1Id === playerId || marriage?.player2Id === playerId;
      });
      if (entry) {
        return { rank: entry.rank, total, value: entry.value };
      }
    }

    return null;
  }

  static getRankChange(currentRank: number, previousRank?: number): { change: 'up' | 'down' | 'same'; value: number } {
    if (!previousRank) return { change: 'same', value: 0 };
    const diff = previousRank - currentRank;
    if (diff > 0) return { change: 'up', value: diff };
    if (diff < 0) return { change: 'down', value: Math.abs(diff) };
    return { change: 'same', value: 0 };
  }

  static getRankColor(rank: number): string {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-amber-600';
    if (rank <= 10) return 'text-purple-400';
    return 'text-gray-500';
  }

  static getRankBackground(rank: number): string {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/50';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400/20 to-gray-300/20 border-gray-400/50';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600/20 to-orange-500/20 border-amber-600/50';
    return 'bg-slate-800/50 border-slate-700/50';
  }

  static getRankTrophy(rank: number): string {
    if (rank === 1) return '🏆';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  }
}
