import type { Wedding, WeddingStyle, Decoration, Guest, BlessingMessage, MiniGameResult } from '../types';
import { mockWeddings, getMarriageById, getPlayerById, generateId, mockItems, mockGuildHalls } from '../mockData';

export class WeddingService {
  static readonly WEDDING_STYLES: { id: WeddingStyle; name: string; icon: string; baseLuxury: number; description: string }[] = [
    { id: 'fairyTale', name: '梦幻童话', icon: '🏰', baseLuxury: 50, description: '粉色梦幻，白马王子与公主的完美婚礼' },
    { id: 'darkFantasy', name: '魔幻暗黑', icon: '🌙', baseLuxury: 60, description: '神秘哥特风，暗夜中的永恒誓言' },
    { id: 'xianxia', name: '东方仙侠', icon: '🏯', baseLuxury: 55, description: '祥云缭绕，仙侣奇缘的中式婚礼' },
    { id: 'starryNight', name: '星空主题', icon: '✨', baseLuxury: 65, description: '星光璀璨，银河为证的浪漫婚礼' },
    { id: 'oceanDream', name: '海洋之梦', icon: '🌊', baseLuxury: 55, description: '深海明珠，人鱼公主的梦幻婚礼' },
    { id: 'forestWonder', name: '森林奇境', icon: '🌲', baseLuxury: 50, description: '自然精灵，森林中的神秘婚礼' },
  ];

  static calculateLuxuryScore(style: WeddingStyle, decorations: Decoration[], guildBonus: number = 0): number {
    const styleData = this.WEDDING_STYLES.find(s => s.id === style);
    const baseLuxury = styleData?.baseLuxury || 50;
    const decorationLuxury = decorations.reduce((sum, d) => sum + d.luxuryBonus, 0);
    const total = baseLuxury + decorationLuxury;
    return Math.floor(total * (1 + guildBonus));
  }

  static calculateLuxury(style: WeddingStyle, decorationIds: string[]): { luxuryScore: number; estimatedGift: number } {
    const decorations = decorationIds.map(id => {
      const item = mockItems.find(i => i.id === id);
      return {
        id,
        luxuryBonus: item?.luxuryBonus || 10,
      };
    });
    const luxuryScore = this.calculateLuxuryScore(style, decorations, 0);
    const estimatedGift = Math.floor(luxuryScore * 100 * (0.8 + Math.random() * 0.4));
    return { luxuryScore, estimatedGift };
  }

  static createWedding(marriageId: string, style: WeddingStyle, startTime: string): { success: boolean; wedding?: Wedding; message: string } {
    const marriage = getMarriageById(marriageId);
    if (!marriage) {
      return { success: false, message: '婚姻关系不存在！' };
    }

    const guildHall = mockGuildHalls.find(h => 
      h.guildId === marriage.player1?.guildId || h.guildId === marriage.player2?.guildId
    );

    const wedding: Wedding = {
      id: generateId(),
      marriageId,
      marriage,
      style,
      decorations: [],
      luxuryScore: this.calculateLuxuryScore(style, [], guildHall?.luxuryBonus || 0),
      startTime,
      status: 'preparing',
      guests: [],
      blessingPoints: 0,
      totalGift: 0,
      createdAt: new Date().toISOString(),
    };

    mockWeddings.push(wedding);
    marriage.weddingCount++;

    return { success: true, wedding, message: '婚礼筹备已创建！' };
  }

  static createCompleteWedding(
    marriageId: string,
    style: WeddingStyle,
    decorationIds: string[],
    startTime: string,
    luxuryScore: number,
    estimatedGift: number
  ): { success: boolean; wedding?: Wedding; message: string } {
    const marriage = getMarriageById(marriageId);
    if (!marriage) {
      return { success: false, message: '婚姻关系不存在！' };
    }

    const player1 = getPlayerById(marriage.player1Id);
    const player2 = getPlayerById(marriage.player2Id);

    const decorations: Decoration[] = decorationIds.map(id => {
      const item = mockItems.find(i => i.id === id);
      return {
        id,
        itemId: id,
        itemName: item?.name || '未知装饰',
        luxuryBonus: item?.luxuryBonus || 10,
      };
    });

    const wedding: Wedding = {
      id: generateId(),
      marriageId,
      marriage,
      partner1: player1,
      partner2: player2,
      partner1Name: player1?.name || '',
      partner2Name: player2?.name || '',
      style,
      decorations,
      luxuryScore,
      startTime,
      status: 'preparing',
      guests: [],
      guestCount: 0,
      blessingPoints: 0,
      totalGift: estimatedGift,
      totalGifts: 0,
      createdAt: new Date().toISOString(),
    };

    mockWeddings.push(wedding);
    marriage.weddingCount++;

    return { success: true, wedding, message: '婚礼已创建！' };
  }

  static addDecoration(weddingId: string, itemId: string, positionX: number, positionY: number): { success: boolean; decoration?: Decoration; message: string } {
    const wedding = mockWeddings.find(w => w.id === weddingId);
    if (!wedding) {
      return { success: false, message: '婚礼不存在！' };
    }

    if (wedding.status !== 'preparing') {
      return { success: false, message: '婚礼已开始，无法修改布置！' };
    }

    const item = mockItems.find(i => i.id === itemId);
    if (!item) {
      return { success: false, message: '道具不存在！' };
    }

    const decoration: Decoration = {
      id: generateId(),
      itemId,
      itemName: item.name,
      positionX,
      positionY,
      luxuryBonus: item.luxuryBonus || 20,
    };

    wedding.decorations.push(decoration);

    const guildHall = mockGuildHalls.find(h => 
      h.guildId === wedding.marriage?.player1?.guildId || h.guildId === wedding.marriage?.player2?.guildId
    );
    wedding.luxuryScore = this.calculateLuxuryScore(wedding.style, wedding.decorations, guildHall?.luxuryBonus || 0);

    return { success: true, decoration, message: `已添加 ${item.name}！` };
  }

  static removeDecoration(weddingId: string, decorationId: string): { success: boolean; message: string } {
    const wedding = mockWeddings.find(w => w.id === weddingId);
    if (!wedding) {
      return { success: false, message: '婚礼不存在！' };
    }

    if (wedding.status !== 'preparing') {
      return { success: false, message: '婚礼已开始，无法修改布置！' };
    }

    const index = wedding.decorations.findIndex(d => d.id === decorationId);
    if (index === -1) {
      return { success: false, message: '装饰不存在！' };
    }

    wedding.decorations.splice(index, 1);

    const guildHall = mockGuildHalls.find(h => 
      h.guildId === wedding.marriage?.player1?.guildId || h.guildId === wedding.marriage?.player2?.guildId
    );
    wedding.luxuryScore = this.calculateLuxuryScore(wedding.style, wedding.decorations, guildHall?.luxuryBonus || 0);

    return { success: true, message: '装饰已移除！' };
  }

  static startWedding(weddingId: string): { success: boolean; message: string; countdown?: number } {
    const wedding = mockWeddings.find(w => w.id === weddingId);
    if (!wedding) {
      return { success: false, message: '婚礼不存在！' };
    }

    if (wedding.status !== 'preparing') {
      return { success: false, message: '婚礼状态异常！' };
    }

    wedding.status = 'ongoing';
    const countdown = 300;

    return {
      success: true,
      message: `🎉 婚礼开始！全服公告已发布，请各位宾客就位！`,
      countdown,
    };
  }

  static sendBlessing(weddingId: string, playerId: string, message: string, giftAmount: number): { success: boolean; blessing?: BlessingMessage; message: string } {
    const wedding = mockWeddings.find(w => w.id === weddingId);
    if (!wedding) {
      return { success: false, message: '婚礼不存在！' };
    }

    if (wedding.status === 'completed') {
      return { success: false, message: '婚礼已结束！' };
    }

    const player = getPlayerById(playerId);
    if (!player) {
      return { success: false, message: '玩家不存在！' };
    }

    const guest: Guest = {
      playerId,
      player,
      giftAmount,
      message,
      blessedAt: new Date().toISOString(),
    };
    wedding.guests.push(guest);
    wedding.guestCount = (wedding.guestCount || 0) + 1;

    const blessingPoints = Math.floor(giftAmount / 10) + message.length;
    wedding.blessingPoints += blessingPoints;
    wedding.totalGift += giftAmount;
    wedding.totalGifts = (wedding.totalGifts || 0) + giftAmount;

    const blessing: BlessingMessage = {
      id: generateId(),
      playerId,
      playerName: player.name,
      playerAvatar: player.avatar,
      message,
      giftAmount,
      timestamp: new Date().toISOString(),
    };

    return {
      success: true,
      blessing,
      message: `💝 祝福已送达！获得 ${blessingPoints} 祝福积分！`,
    };
  }

  static completeWedding(weddingId: string): { success: boolean; message: string; stats?: { totalGuests: number; totalGift: number; blessingPoints: number; luxuryRank: string } } {
    const wedding = mockWeddings.find(w => w.id === weddingId);
    if (!wedding) {
      return { success: false, message: '婚礼不存在！' };
    }

    wedding.status = 'completed';

    let luxuryRank = '铜';
    if (wedding.luxuryScore >= 500) luxuryRank = '金';
    else if (wedding.luxuryScore >= 300) luxuryRank = '银';

    return {
      success: true,
      message: `💒 婚礼圆满完成！感谢所有宾客的祝福！`,
      stats: {
        totalGuests: wedding.guests.length,
        totalGift: wedding.totalGift,
        blessingPoints: wedding.blessingPoints,
        luxuryRank,
      },
    };
  }

  static getBlessingMessages(weddingId: string): BlessingMessage[] {
    const wedding = mockWeddings.find(w => w.id === weddingId);
    if (!wedding) return [];
    return wedding.guests.map(g => ({
      id: generateId(),
      playerId: g.playerId,
      playerName: g.player?.name || '神秘玩家',
      playerAvatar: g.player?.avatar || '🧙',
      message: g.message,
      giftAmount: g.giftAmount,
      timestamp: g.blessedAt,
    }));
  }

  static playMiniGame(weddingId: string, playerId: string, gameType: string): { success: boolean; result?: MiniGameResult; message: string } {
    const wedding = mockWeddings.find(w => w.id === weddingId);
    if (!wedding) {
      return { success: false, message: '婚礼不存在！' };
    }
    if (wedding.status === 'completed') {
      return { success: false, message: '婚礼已结束！' };
    }
    const player = getPlayerById(playerId);
    if (!player) {
      return { success: false, message: '玩家不存在！' };
    }
    const score = Math.floor(Math.random() * 41) + 10;
    const reward = Math.floor(Math.random() * 91) + 10;
    const result: MiniGameResult = {
      id: generateId(),
      gameType,
      playerId,
      playerName: player.name,
      playerAvatar: player.avatar,
      score,
      reward,
      timestamp: new Date().toISOString(),
    };
    if (!wedding.miniGames) {
      wedding.miniGames = [];
    }
    wedding.miniGames.push(result);
    wedding.blessingPoints += score;
    wedding.totalGift += reward;
    wedding.totalGifts = (wedding.totalGifts || 0) + reward;
    return {
      success: true,
      result,
      message: `🎉 游戏完成！获得 ${score} 祝福积分和 ${reward} 金币奖励！`,
    };
  }

  private static enrichWedding(wedding: Wedding): Wedding {
    wedding.marriage = getMarriageById(wedding.marriageId);
    const p1 = getPlayerById(wedding.marriage?.player1Id || '');
    const p2 = getPlayerById(wedding.marriage?.player2Id || '');
    if (!wedding.partner1 && p1) wedding.partner1 = p1;
    if (!wedding.partner2 && p2) wedding.partner2 = p2;
    if (!wedding.partner1Name && p1) wedding.partner1Name = p1.name;
    if (!wedding.partner2Name && p2) wedding.partner2Name = p2.name;
    wedding.guests = wedding.guests.map(g => ({
      ...g,
      player: getPlayerById(g.playerId),
    }));
    return wedding;
  }

  static getWeddingById(weddingId: string): Wedding | undefined {
    const wedding = mockWeddings.find(w => w.id === weddingId);
    if (wedding) {
      return this.enrichWedding(wedding);
    }
    return wedding;
  }

  static getWeddingsByMarriage(marriageId: string): Wedding[] {
    return mockWeddings
      .filter(w => w.marriageId === marriageId)
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .map(w => this.enrichWedding(w));
  }

  static getOngoingWeddings(): Wedding[] {
    return mockWeddings
      .filter(w => w.status === 'ongoing')
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .map(w => this.enrichWedding(w));
  }

  static getWeddingAnnouncement(wedding: Wedding): string {
    const p1 = wedding.marriage?.player1?.name || '神秘玩家';
    const p2 = wedding.marriage?.player2?.name || '神秘玩家';
    const style = this.WEDDING_STYLES.find(s => s.id === wedding.style)?.name || '梦幻';
    
    return `📢 【全服公告】${p1} 与 ${p2} 的${style}婚礼即将开始！豪华度：${wedding.luxuryScore}！欢迎各位前来观礼祝福！🎉`;
  }
}
