import type { Wedding, WeddingStyle, Decoration, Guest, BlessingMessage } from '../types';
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

    if (wedding.status !== 'ongoing') {
      return { success: false, message: '婚礼已结束！' };
    }

    const player = getPlayerById(playerId);
    if (!player) {
      return { success: false, message: '玩家不存在！' };
    }

    const existingGuest = wedding.guests.find(g => g.playerId === playerId);
    if (existingGuest) {
      return { success: false, message: '您已送过祝福！' };
    }

    const guest: Guest = {
      playerId,
      player,
      giftAmount,
      message,
      blessedAt: new Date().toISOString(),
    };
    wedding.guests.push(guest);

    const blessingPoints = Math.floor(giftAmount / 10) + message.length;
    wedding.blessingPoints += blessingPoints;
    wedding.totalGift += giftAmount;

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

  static getWeddingById(weddingId: string): Wedding | undefined {
    const wedding = mockWeddings.find(w => w.id === weddingId);
    if (wedding) {
      wedding.marriage = getMarriageById(wedding.marriageId);
      wedding.guests = wedding.guests.map(g => ({
        ...g,
        player: getPlayerById(g.playerId),
      }));
    }
    return wedding;
  }

  static getWeddingsByMarriage(marriageId: string): Wedding[] {
    return mockWeddings
      .filter(w => w.marriageId === marriageId)
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }

  static getOngoingWeddings(): Wedding[] {
    return mockWeddings
      .filter(w => w.status === 'ongoing')
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  static getWeddingAnnouncement(wedding: Wedding): string {
    const p1 = wedding.marriage?.player1?.name || '神秘玩家';
    const p2 = wedding.marriage?.player2?.name || '神秘玩家';
    const style = this.WEDDING_STYLES.find(s => s.id === wedding.style)?.name || '梦幻';
    
    return `📢 【全服公告】${p1} 与 ${p2} 的${style}婚礼即将开始！豪华度：${wedding.luxuryScore}！欢迎各位前来观礼祝福！🎉`;
  }
}
