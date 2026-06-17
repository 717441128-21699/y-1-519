import type { Marriage, DailyEventType, DailyLoveRecord, SkillUnlock } from '../types';
import { mockMarriages, mockDailyLoveRecords, getPlayerById, generateId, mockSkills } from '../mockData';

export class MarriageService {
  static triggerDailyEvent(): DailyEventType {
    const rand = Math.random() * 100;
    if (rand < 20) return 'sweet';
    if (rand < 35) return 'coldWar';
    return null;
  }

  static getEventEffect(event: DailyEventType): { loveMultiplier: number; rewardMultiplier: number; message: string } {
    switch (event) {
      case 'sweet':
        return {
          loveMultiplier: 1.5,
          rewardMultiplier: 1.3,
          message: '💕 甜蜜时光！今日恩爱值和任务收益大幅提升！',
        };
      case 'coldWar':
        return {
          loveMultiplier: 0.5,
          rewardMultiplier: 0.7,
          message: '😤 冷战中！今日恩爱值和任务收益下降，需要多互动来缓和关系。',
        };
      default:
        return {
          loveMultiplier: 1,
          rewardMultiplier: 1,
          message: '',
        };
    }
  }

  static getMarriageByPlayer(playerId: string): Marriage | undefined {
    const marriage = mockMarriages.find(
      m => m.player1Id === playerId || m.player2Id === playerId
    );
    if (marriage) {
      marriage.player1 = getPlayerById(marriage.player1Id);
      marriage.player2 = getPlayerById(marriage.player2Id);
    }
    return marriage;
  }

  static getMarriageById(marriageId: string): Marriage | undefined {
    const marriage = mockMarriages.find(m => m.id === marriageId);
    if (marriage) {
      marriage.player1 = getPlayerById(marriage.player1Id);
      marriage.player2 = getPlayerById(marriage.player2Id);
    }
    return marriage;
  }

  static claimDailyLove(marriageId: string): { success: boolean; loveGained: number; message: string; event: DailyEventType } {
    const marriage = this.getMarriageById(marriageId);
    if (!marriage) {
      return { success: false, loveGained: 0, message: '婚姻关系不存在！', event: null };
    }

    const today = new Date().toISOString().split('T')[0];
    if (marriage.lastDailyClaim === today) {
      return { success: false, loveGained: 0, message: '今日恩爱值已领取！', event: marriage.todayEvent };
    }

    const event = this.triggerDailyEvent();
    marriage.todayEvent = event;
    const { loveMultiplier, message: eventMessage } = this.getEventEffect(event);

    const baseLove = 50 + Math.floor(Math.random() * 30);
    const loveGained = Math.floor(baseLove * loveMultiplier);

    marriage.loveValue += loveGained;
    marriage.lastDailyClaim = today;

    this.checkSkillUnlocks(marriage);

    const record: DailyLoveRecord = {
      id: generateId(),
      marriageId,
      loveGained,
      eventType: event,
      createdAt: new Date().toISOString(),
    };
    if (!mockDailyLoveRecords) {
      (globalThis as any).mockDailyLoveRecords = [];
    }
    (mockDailyLoveRecords as DailyLoveRecord[]).push(record);

    return {
      success: true,
      loveGained,
      message: eventMessage ? `${eventMessage} 获得 ${loveGained} 恩爱值！` : `获得 ${loveGained} 恩爱值！`,
      event,
    };
  }

  static checkSkillUnlocks(marriage: Marriage): SkillUnlock[] {
    const newUnlocks: SkillUnlock[] = [];
    
    marriage.skills.forEach(skillUnlock => {
      if (!skillUnlock.unlocked) {
        const skill = mockSkills.find(s => s.id === skillUnlock.skillId);
        if (skill && marriage.loveValue >= skill.requiredLove) {
          skillUnlock.unlocked = true;
          skillUnlock.unlockedAt = new Date().toISOString();
          newUnlocks.push(skillUnlock);
        }
      }
    });

    return newUnlocks;
  }

  static getDailyRecords(marriageId: string, days: number = 7): DailyLoveRecord[] {
    const records = (globalThis as any).mockDailyLoveRecords || [];
    return records
      .filter((r: DailyLoveRecord) => r.marriageId === marriageId)
      .sort((a: DailyLoveRecord, b: DailyLoveRecord) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, days);
  }

  static getMarriageDuration(marriage: Marriage): number {
    const marryDate = new Date(marriage.marryDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - marryDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  static getLoveLevel(loveValue: number): { level: number; name: string; icon: string; nextLove: number } {
    const levels = [
      { level: 1, name: '初识', icon: '💗', min: 0, next: 100 },
      { level: 2, name: '相知', icon: '💕', min: 100, next: 300 },
      { level: 3, name: '相恋', icon: '💖', min: 300, next: 500 },
      { level: 4, name: '相守', icon: '💝', min: 500, next: 800 },
      { level: 5, name: '相爱', icon: '💘', min: 800, next: 1200 },
      { level: 6, name: '相惜', icon: '❤️', min: 1200, next: 1800 },
      { level: 7, name: '相濡以沫', icon: '💞', min: 1800, next: 2500 },
      { level: 8, name: '白头偕老', icon: '💟', min: 2500, next: 99999 },
    ];

    for (let i = levels.length - 1; i >= 0; i--) {
      if (loveValue >= levels[i].min) {
        return { ...levels[i], nextLove: levels[i].next };
      }
    }
    return { ...levels[0], nextLove: levels[0].next };
  }

  static enterDungeon(marriageId: string): { success: boolean; message: string; rewards?: { gold: number; exp: number; items: string[] } } {
    const marriage = this.getMarriageById(marriageId);
    if (!marriage) {
      return { success: false, message: '婚姻关系不存在！' };
    }

    if (marriage.dungeonRemaining <= 0) {
      return { success: false, message: '今日专属副本次数已用完！' };
    }

    marriage.dungeonRemaining--;

    const event = marriage.todayEvent;
    const { rewardMultiplier } = this.getEventEffect(event);

    const baseGold = 500 + Math.floor(Math.random() * 500);
    const baseExp = 200 + Math.floor(Math.random() * 200);
    const gold = Math.floor(baseGold * rewardMultiplier);
    const exp = Math.floor(baseExp * rewardMultiplier);

    const possibleDrops = ['爱心宝石', '甜蜜糖果', '永恒花束', '情侣戒指', '婚纱碎片'];
    const drops: string[] = [];
    if (Math.random() < 0.5) drops.push(possibleDrops[Math.floor(Math.random() * possibleDrops.length)]);
    if (Math.random() < 0.2) drops.push(possibleDrops[Math.floor(Math.random() * possibleDrops.length)]);

    return {
      success: true,
      message: `副本挑战成功！获得 ${gold} 金币，${exp} 经验值${drops.length > 0 ? `，以及 ${drops.join('、')}` : ''}！`,
      rewards: { gold, exp, items: drops },
    };
  }

  static getAllMarriages(): Marriage[] {
    return mockMarriages.map(m => ({
      ...m,
      player1: getPlayerById(m.player1Id),
      player2: getPlayerById(m.player2Id),
    }));
  }
}

if (!(globalThis as any).mockDailyLoveRecords) {
  (globalThis as any).mockDailyLoveRecords = [];
}
