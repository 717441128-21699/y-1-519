import type { WeeklyReport, WeddingStyle, ReportFilter, Guild } from '../types';
import { mockWeddings, mockMarriages, mockProposals, mockGuildHalls, mockGuilds, mockPlayers } from '../mockData';

export class ReportService {
  static generateWeeklyReport(filter: ReportFilter = {}): WeeklyReport {
    const { guildId, style, weekOffset = 0 } = filter;

    const now = new Date();
    const weeksOffsetMs = weekOffset * 7 * 24 * 60 * 60 * 1000;
    const weekEnd = new Date(now.getTime() + weeksOffsetMs);
    const weekStart = new Date(weekEnd.getTime() - 7 * 24 * 60 * 60 * 1000);

    let weekProposals = mockProposals.filter(p => {
      const createdAt = new Date(p.createdAt);
      return createdAt >= weekStart && createdAt <= weekEnd;
    });
    let weekWeddings = mockWeddings.filter(w => {
      const createdAt = new Date(w.createdAt);
      return createdAt >= weekStart && createdAt <= weekEnd;
    });

    if (guildId) {
      const playerIdsInGuild = new Set(
        mockPlayers.filter(p => p.guildId === guildId).map(p => p.id)
      );
      weekWeddings = weekWeddings.filter(w => {
        const marriage = mockMarriages.find(m => m.id === w.marriageId);
        if (!marriage) return false;
        return playerIdsInGuild.has(marriage.player1Id) || playerIdsInGuild.has(marriage.player2Id);
      });
      weekProposals = weekProposals.filter(p => {
        return playerIdsInGuild.has(p.proposerId) || playerIdsInGuild.has(p.targetId);
      });
    }

    if (style) {
      weekWeddings = weekWeddings.filter(w => w.style === style);
    }

    const weddingStyleHeatmap = this.getWeddingStyleHeatmap(weekWeddings);
    const loveValueTrend = this.getLoveValueTrend(weekOffset, guildId);
    const transactionTrend = this.getTransactionTrend(weekWeddings, weekOffset);
    
    const totalProposals = weekProposals.length;
    const successfulProposals = weekProposals.filter(p => p.success).length;
    const successRate = totalProposals > 0 ? Math.round((successfulProposals / totalProposals) * 100) : 0;
    
    const avgLuxuryScore = weekWeddings.length > 0
      ? Math.round(weekWeddings.reduce((sum, w) => sum + w.luxuryScore, 0) / weekWeddings.length)
      : 0;
    
    let guildHalls = mockGuildHalls;
    if (guildId) {
      guildHalls = mockGuildHalls.filter(h => h.guildId === guildId);
    }
    const totalGuildContribution = guildHalls.reduce((sum, h) => 
      sum + h.contributions.reduce((s, c) => s + c.amount, 0), 0
    );

    let marriages = mockMarriages;
    if (guildId) {
      const playerIdsInGuild = new Set(
        mockPlayers.filter(p => p.guildId === guildId).map(p => p.id)
      );
      marriages = mockMarriages.filter(m => 
        playerIdsInGuild.has(m.player1Id) || playerIdsInGuild.has(m.player2Id)
      );
    }

    const avgLoveValue = marriages.length > 0
      ? Math.round(marriages.reduce((sum, m) => sum + m.loveValue, 0) / marriages.length)
      : 0;
    const marriageHappiness = Math.min(Math.round((avgLoveValue / 2000) * 100), 100);
    const activityLevel = Math.min(Math.round(((weekProposals.length + weekWeddings.length * 2) / 20) * 100), 100);
    const weddingLuxury = Math.min(Math.round((avgLuxuryScore / 500) * 100), 100);
    const guildContribution = Math.min(Math.round((totalGuildContribution / 10000) * 100), 100);

    return {
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0],
      weddingStyleHeatmap,
      loveValueTrend,
      transactionTrend,
      radarData: {
        proposalSuccess: successRate,
        marriageHappiness,
        weddingLuxury,
        guildContribution,
        activityLevel,
      },
      summary: {
        totalProposals,
        successRate,
        totalWeddings: weekWeddings.length,
        avgLuxuryScore,
        totalGuildContribution,
      },
    };
  }

  static getAllGuilds(): Guild[] {
    return mockGuilds;
  }

  static getAllStyles(): WeddingStyle[] {
    return ['fairyTale', 'darkFantasy', 'xianxia', 'starryNight', 'oceanDream', 'forestWonder'];
  }

  static getWeddingStyleHeatmap(weddings: typeof mockWeddings): Record<WeddingStyle, number> {
    const heatmap: Record<string, number> = {
      fairyTale: 0,
      darkFantasy: 0,
      xianxia: 0,
      starryNight: 0,
      oceanDream: 0,
      forestWonder: 0,
    };

    weddings.forEach(w => {
      heatmap[w.style] = (heatmap[w.style] || 0) + 1;
    });

    return heatmap as Record<WeddingStyle, number>;
  }

  static getLoveValueTrend(weekOffset: number = 0, guildId?: string): { date: string; avg: number }[] {
    const trend: { date: string; avg: number }[] = [];
    const now = new Date();
    const weeksOffsetMs = weekOffset * 7 * 24 * 60 * 60 * 1000;
    const baseDate = new Date(now.getTime() + weeksOffsetMs);

    let marriages = mockMarriages;
    if (guildId) {
      const playerIdsInGuild = new Set(
        mockPlayers.filter(p => p.guildId === guildId).map(p => p.id)
      );
      marriages = mockMarriages.filter(m => 
        playerIdsInGuild.has(m.player1Id) || playerIdsInGuild.has(m.player2Id)
      );
    }

    for (let i = 6; i >= 0; i--) {
      const date = new Date(baseDate.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const baseAvg = marriages.length > 0
        ? Math.round(marriages.reduce((sum, m) => sum + m.loveValue, 0) / marriages.length)
        : 1200;
      const variance = Math.sin(i * 0.5 + weekOffset) * 200 + Math.random() * 100;
      trend.push({
        date: dateStr,
        avg: Math.round(baseAvg + variance),
      });
    }

    return trend;
  }

  static getTransactionTrend(weddings: typeof mockWeddings, weekOffset: number = 0): { date: string; amount: number }[] {
    const trend: { date: string; amount: number }[] = [];
    const now = new Date();
    const weeksOffsetMs = weekOffset * 7 * 24 * 60 * 60 * 1000;
    const baseDate = new Date(now.getTime() + weeksOffsetMs);

    for (let i = 6; i >= 0; i--) {
      const date = new Date(baseDate.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayWeddings = weddings.filter(w => 
        new Date(w.createdAt).toISOString().split('T')[0] === dateStr
      );
      
      const dayAmount = dayWeddings.reduce((sum, w) => sum + w.totalGift, 0);
      const baseAmount = 5000 + Math.random() * 3000 + weekOffset * 500;
      
      trend.push({
        date: dateStr,
        amount: Math.round(dayAmount + baseAmount),
      });
    }

    return trend;
  }

  static getReportInsights(report: WeeklyReport): { type: string; title: string; description: string; icon: string }[] {
    const insights: { type: string; title: string; description: string; icon: string }[] = [];

    if (report.summary.successRate >= 70) {
      insights.push({
        type: 'positive',
        title: '求婚成功率创新高',
        description: `本周求婚成功率达到 ${report.summary.successRate}%，玩家们的感情越来越稳定了！`,
        icon: '💘',
      });
    } else if (report.summary.successRate < 40) {
      insights.push({
        type: 'warning',
        title: '求婚成功率偏低',
        description: `本周求婚成功率仅 ${report.summary.successRate}%，建议玩家们多提升亲密度再求婚哦。`,
        icon: '💔',
      });
    }

    const topStyle = Object.entries(report.weddingStyleHeatmap)
      .sort((a, b) => b[1] - a[1])[0];
    
    const styleNames: Record<string, string> = {
      fairyTale: '梦幻童话',
      darkFantasy: '魔幻暗黑',
      xianxia: '东方仙侠',
      starryNight: '星空主题',
      oceanDream: '海洋之梦',
      forestWonder: '森林奇境',
    };

    if (topStyle && topStyle[1] > 0) {
      insights.push({
        type: 'info',
        title: `最受欢迎婚礼风格：${styleNames[topStyle[0]] || topStyle[0]}`,
        description: `本周共有 ${topStyle[1]} 对新人选择了${styleNames[topStyle[0]] || topStyle[0]}婚礼风格。`,
        icon: '🏆',
      });
    }

    if (report.summary.avgLuxuryScore >= 300) {
      insights.push({
        type: 'positive',
        title: '婚礼豪华度提升',
        description: `本周平均婚礼豪华度达到 ${report.summary.avgLuxuryScore} 分，新人们都在打造完美婚礼！`,
        icon: '💎',
      });
    }

    if (report.radarData.guildContribution >= 60) {
      insights.push({
        type: 'info',
        title: '公会建设活跃',
        description: `本周公会婚庆堂总贡献达到 ${report.summary.totalGuildContribution}，大家都在为公会努力！`,
        icon: '🏰',
      });
    }

    return insights;
  }

  static exportPDF(report: WeeklyReport): string {
    return JSON.stringify(report, null, 2);
  }
}
