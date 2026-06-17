import type { Player, Item, Skill, Marriage, Wedding, Guild, GuildWeddingHall, Proposal, DailyLoveRecord, UpgradeRequest } from './types';
import { v4 as uuidv4 } from 'uuid';

export const mockPlayers: Player[] = [
  { id: 'p1', name: '月影法师', level: 85, avatar: '🧙‍♂️', class: '法师', guildId: 'g1', guildRole: 'president' },
  { id: 'p2', name: '星辰骑士', level: 82, avatar: '⚔️', class: '骑士', guildId: 'g1', guildRole: 'vicePresident' },
  { id: 'p3', name: '烈焰术士', level: 78, avatar: '🔥', class: '术士', guildId: 'g1', guildRole: 'member' },
  { id: 'p4', name: '冰霜女巫', level: 88, avatar: '❄️', class: '女巫', guildId: 'g2', guildRole: 'president' },
  { id: 'p5', name: '暗夜刺客', level: 75, avatar: '🗡️', class: '刺客', guildId: 'g2', guildRole: 'member' },
  { id: 'p6', name: '神圣牧师', level: 80, avatar: '✨', class: '牧师', guildId: 'g1', guildRole: 'member' },
  { id: 'p7', name: '风暴召唤师', level: 76, avatar: '🌪️', class: '召唤师', guildId: 'g2', guildRole: 'member' },
  { id: 'p8', name: '大地守护者', level: 90, avatar: '🌍', class: '守护者', guildId: 'g1', guildRole: 'member' },
];

export const mockItems: Item[] = [
  { id: 'i1', name: '永恒玫瑰', quality: 'legendary', qualityBonus: 50, icon: '🌹', description: '传说中永不凋谢的玫瑰，象征永恒的爱情', luxuryBonus: 100 },
  { id: 'i2', name: '星辰钻戒', quality: 'epic', qualityBonus: 35, icon: '💍', description: '镶嵌星辰碎片的钻戒，闪耀着神秘光芒', luxuryBonus: 75 },
  { id: 'i3', name: '月光项链', quality: 'epic', qualityBonus: 30, icon: '📿', description: '吸收月光精华的项链，蕴含祝福之力', luxuryBonus: 70 },
  { id: 'i4', name: '真爱花束', quality: 'rare', qualityBonus: 20, icon: '💐', description: '由99朵魔法玫瑰组成的花束', luxuryBonus: 45 },
  { id: 'i5', name: '情侣手环', quality: 'rare', qualityBonus: 15, icon: '🎀', description: '一对可以感知对方心情的神奇手环', luxuryBonus: 40 },
  { id: 'i6', name: '巧克力礼盒', quality: 'common', qualityBonus: 8, icon: '🍫', description: '充满爱意的手工巧克力', luxuryBonus: 20 },
  { id: 'i7', name: '水晶婚鞋', quality: 'legendary', qualityBonus: 45, icon: '👠', description: '传说中的水晶鞋，穿上它走向幸福', luxuryBonus: 95 },
  { id: 'i8', name: '黄金婚礼冠', quality: 'epic', qualityBonus: 40, icon: '👑', description: '镶嵌宝石的黄金头冠，王者风范', luxuryBonus: 85 },
];

export const mockSkills: Skill[] = [
  { id: 'skill_001', name: '心灵相通', description: '组队时双方攻击力+10%', requiredLove: 100, icon: '💞', effect: { attackBonus: 0.1 } },
  { id: 'skill_002', name: '同生共死', description: '一方生命值低于30%时，另一方获得50%减伤', requiredLove: 300, icon: '💗', effect: { damageReduction: 0.5 } },
  { id: 'skill_003', name: '比翼双飞', description: '双人移动速度+20%，可携手飞行', requiredLove: 500, icon: '💖', effect: { speedBonus: 0.2 } },
  { id: 'skill_004', name: '情比金坚', description: '解除双方所有控制效果，冷却5分钟', requiredLove: 800, icon: '💝', effect: { cleanse: 1 } },
  { id: 'skill_005', name: '生死与共', description: '为对方承担50%伤害，持续10秒', requiredLove: 1200, icon: '💘', effect: { damageShare: 0.5 } },
];

export const mockGuilds: Guild[] = [
  {
    id: 'g1',
    name: '星辰圣殿',
    presidentId: 'p1',
    vicePresidentId: 'p2',
    president: mockPlayers[0],
    vicePresident: mockPlayers[1],
    members: [
      { id: 'gm1', playerId: 'p1', player: mockPlayers[0], role: 'president', contribution: 5000, joinedAt: '2026-01-01' },
      { id: 'gm2', playerId: 'p2', player: mockPlayers[1], role: 'vicePresident', contribution: 4500, joinedAt: '2026-01-05' },
      { id: 'gm3', playerId: 'p3', player: mockPlayers[2], role: 'member', contribution: 2000, joinedAt: '2026-01-10' },
      { id: 'gm6', playerId: 'p6', player: mockPlayers[5], role: 'member', contribution: 1800, joinedAt: '2026-01-15' },
      { id: 'gm8', playerId: 'p7', player: mockPlayers[7], role: 'member', contribution: 3200, joinedAt: '2026-01-20' },
    ],
    createdAt: '2026-01-01',
  },
  {
    id: 'g2',
    name: '暗夜联盟',
    presidentId: 'p4',
    vicePresidentId: null,
    president: mockPlayers[3],
    vicePresident: undefined,
    members: [
      { id: 'gm4', playerId: 'p4', player: mockPlayers[3], role: 'president', contribution: 6000, joinedAt: '2026-01-03' },
      { id: 'gm5', playerId: 'p5', player: mockPlayers[4], role: 'member', contribution: 1500, joinedAt: '2026-01-12' },
      { id: 'gm7', playerId: 'p7', player: mockPlayers[6], role: 'member', contribution: 2200, joinedAt: '2026-01-18' },
    ],
    createdAt: '2026-01-03',
  },
];

export const mockUpgradeRequests: UpgradeRequest[] = [
  {
    id: 'ur1',
    hallId: 'gh1',
    applicantId: 'p3',
    applicant: mockPlayers[2],
    fromLevel: 1,
    toLevel: 2,
    status: 'approved',
    createdAt: '2026-05-20',
    approvedAt: '2026-05-21',
    approverId: 'p1',
    approver: mockPlayers[0],
  },
  {
    id: 'ur2',
    hallId: 'gh1',
    applicantId: 'p2',
    applicant: mockPlayers[1],
    fromLevel: 2,
    toLevel: 3,
    status: 'approved',
    createdAt: '2026-06-01',
    approvedAt: '2026-06-02',
    approverId: 'p1',
    approver: mockPlayers[0],
  },
  {
    id: 'ur3',
    hallId: 'gh1',
    applicantId: 'p6',
    applicant: mockPlayers[5],
    fromLevel: 2,
    toLevel: 3,
    status: 'rejected',
    createdAt: '2026-05-25',
    rejectedAt: '2026-05-26',
    approverId: 'p1',
    approver: mockPlayers[0],
    rejectReason: '当前公会活动较少，建议先积累更多贡献值再升级',
  },
  {
    id: 'ur4',
    hallId: 'gh2',
    applicantId: 'p4',
    applicant: mockPlayers[3],
    fromLevel: 2,
    toLevel: 3,
    status: 'pending',
    createdAt: '2026-06-15',
  },
  {
    id: 'ur5',
    hallId: 'gh2',
    applicantId: 'p5',
    applicant: mockPlayers[4],
    fromLevel: 1,
    toLevel: 2,
    status: 'approved',
    createdAt: '2026-06-05',
    approvedAt: '2026-06-06',
    approverId: 'p4',
    approver: mockPlayers[3],
  },
];

export const mockGuildHalls: GuildWeddingHall[] = [
  {
    id: 'gh1',
    guildId: 'g1',
    guild: mockGuilds[0],
    guildName: '星辰魔法公会',
    level: 3,
    exp: 2500,
    expToNext: 4000,
    currentContribution: 2500,
    upgradeRequired: 4000,
    luxuryBonus: 0.15,
    dungeonBonus: 0.12,
    pendingApproval: false,
    pendingUpgrade: false,
    upgradeApplicantId: null,
    myContribution: 1000,
    leaderName: '林玄',
    contributions: [
      { id: 'c1', hallId: 'gh1', playerId: 'p1', player: mockPlayers[0], amount: 1000, createdAt: '2026-06-10' },
      { id: 'c2', hallId: 'gh1', playerId: 'p2', player: mockPlayers[1], amount: 800, createdAt: '2026-06-11' },
      { id: 'c3', hallId: 'gh1', playerId: 'p3', player: mockPlayers[2], amount: 500, createdAt: '2026-06-12' },
    ],
    upgradeRequests: mockUpgradeRequests.filter(r => r.hallId === 'gh1'),
  },
  {
    id: 'gh2',
    guildId: 'g2',
    guild: mockGuilds[1],
    guildName: '暗夜联盟',
    level: 2,
    exp: 1200,
    expToNext: 2500,
    currentContribution: 1200,
    upgradeRequired: 2500,
    luxuryBonus: 0.08,
    dungeonBonus: 0.06,
    pendingApproval: true,
    pendingUpgrade: true,
    upgradeApplicantId: 'p4',
    upgradeApplicant: mockPlayers[3],
    myContribution: 600,
    leaderName: '墨尘',
    contributions: [
      { id: 'c4', hallId: 'gh2', playerId: 'p4', player: mockPlayers[3], amount: 600, createdAt: '2026-06-10' },
      { id: 'c5', hallId: 'gh2', playerId: 'p5', player: mockPlayers[4], amount: 400, createdAt: '2026-06-13' },
    ],
    upgradeRequests: mockUpgradeRequests.filter(r => r.hallId === 'gh2'),
  },
];

export const mockMarriages: Marriage[] = [
  {
    id: 'm1',
    player1Id: 'p1',
    player2Id: 'p4',
    player1: mockPlayers[0],
    player2: mockPlayers[3],
    partner1: mockPlayers[0],
    partner2: mockPlayers[3],
    partner1Name: '林玄',
    partner2Name: '墨尘',
    loveValue: 2580,
    marryDate: '2026-03-14',
    marriageDays: 95,
    todayEvent: 'sweet',
    lastDailyClaim: '2026-06-16',
    dungeonRemaining: 1,
    weddingCount: 2,
    skills: [
      { id: 'su1', skillId: 'skill_001', skill: mockSkills[0], unlocked: true, unlockedAt: '2026-03-15', requiredLoveValue: 0, skillLevel: 3 },
      { id: 'su2', skillId: 'skill_002', skill: mockSkills[1], unlocked: true, unlockedAt: '2026-04-01', requiredLoveValue: 500, skillLevel: 2 },
      { id: 'su3', skillId: 'skill_003', skill: mockSkills[2], unlocked: true, unlockedAt: '2026-05-10', requiredLoveValue: 1500, skillLevel: 1 },
      { id: 'su4', skillId: 'skill_004', skill: mockSkills[3], unlocked: false, unlockedAt: null, requiredLoveValue: 3000 },
      { id: 'su5', skillId: 'skill_005', skill: mockSkills[4], unlocked: false, unlockedAt: null, requiredLoveValue: 5000 },
    ],
  },
  {
    id: 'm2',
    player1Id: 'p2',
    player2Id: 'p6',
    player1: mockPlayers[1],
    player2: mockPlayers[5],
    partner1: mockPlayers[1],
    partner2: mockPlayers[5],
    partner1Name: '风间琉璃',
    partner2Name: '苏雨薇',
    loveValue: 1650,
    marryDate: '2026-04-20',
    marriageDays: 58,
    todayEvent: null,
    lastDailyClaim: '2026-06-15',
    dungeonRemaining: 0,
    weddingCount: 1,
    skills: [
      { id: 'su6', skillId: 'skill_001', skill: mockSkills[0], unlocked: true, unlockedAt: '2026-04-21', requiredLoveValue: 0, skillLevel: 2 },
      { id: 'su7', skillId: 'skill_002', skill: mockSkills[1], unlocked: true, unlockedAt: '2026-05-15', requiredLoveValue: 500, skillLevel: 1 },
      { id: 'su8', skillId: 'skill_003', skill: mockSkills[2], unlocked: false, unlockedAt: null, requiredLoveValue: 1500 },
      { id: 'su9', skillId: 'skill_004', skill: mockSkills[3], unlocked: false, unlockedAt: null, requiredLoveValue: 3000 },
      { id: 'su10', skillId: 'skill_005', skill: mockSkills[4], unlocked: false, unlockedAt: null, requiredLoveValue: 5000 },
    ],
  },
  {
    id: 'm3',
    player1Id: 'p3',
    player2Id: 'p5',
    player1: mockPlayers[2],
    player2: mockPlayers[4],
    partner1: mockPlayers[2],
    partner2: mockPlayers[4],
    partner1Name: '月清影',
    partner2Name: '叶孤城',
    loveValue: 890,
    marryDate: '2026-05-28',
    marriageDays: 20,
    todayEvent: 'coldWar',
    lastDailyClaim: '2026-06-16',
    dungeonRemaining: 1,
    weddingCount: 0,
    skills: [
      { id: 'su11', skillId: 'skill_001', skill: mockSkills[0], unlocked: true, unlockedAt: '2026-05-29', requiredLoveValue: 0, skillLevel: 1 },
      { id: 'su12', skillId: 'skill_002', skill: mockSkills[1], unlocked: false, unlockedAt: null, requiredLoveValue: 500 },
      { id: 'su13', skillId: 'skill_003', skill: mockSkills[2], unlocked: false, unlockedAt: null, requiredLoveValue: 1500 },
      { id: 'su14', skillId: 'skill_004', skill: mockSkills[3], unlocked: false, unlockedAt: null, requiredLoveValue: 3000 },
      { id: 'su15', skillId: 'skill_005', skill: mockSkills[4], unlocked: false, unlockedAt: null, requiredLoveValue: 5000 },
    ],
  },
];

export const mockWeddings: Wedding[] = [
  {
    id: 'w1',
    marriageId: 'm1',
    marriage: mockMarriages[0],
    partner1: mockPlayers[0],
    partner2: mockPlayers[3],
    partner1Name: '月影法师',
    partner2Name: '星光术士',
    style: 'starryNight',
    decorations: [
      { id: 'd1', itemId: 'i7', itemName: '水晶婚鞋', positionX: 2, positionY: 3, luxuryBonus: 95 },
      { id: 'd2', itemId: 'i8', itemName: '黄金婚礼冠', positionX: 5, positionY: 2, luxuryBonus: 85 },
      { id: 'd3', itemId: 'i1', itemName: '永恒玫瑰', positionX: 3, positionY: 5, luxuryBonus: 100 },
    ],
    luxuryScore: 280,
    startTime: '2026-06-20T19:00:00',
    status: 'ongoing',
    guests: [
      { playerId: 'p2', player: mockPlayers[1], giftAmount: 500, message: '祝你们百年好合，永结同心！', blessedAt: '2026-06-20T19:05:00' },
      { playerId: 'p3', player: mockPlayers[2], giftAmount: 300, message: '愿星光永远照耀你们！', blessedAt: '2026-06-20T19:08:00' },
      { playerId: 'p5', player: mockPlayers[4], giftAmount: 200, message: '甜蜜幸福，早生贵子！', blessedAt: '2026-06-20T19:12:00' },
    ],
    guestCount: 3,
    blessingPoints: 185,
    totalGift: 1000,
    totalGifts: 1000,
    miniGames: [
      { id: 'mg1', gameType: 'redPacket', playerId: 'p2', playerName: '烈焰战士', playerAvatar: '⚔️', score: 35, reward: 50, timestamp: '2026-06-20T19:10:00' },
      { id: 'mg2', gameType: 'dice', playerId: 'p3', playerName: '森林精灵', playerAvatar: '🧝', score: 28, reward: 35, timestamp: '2026-06-20T19:15:00' },
    ],
    createdAt: '2026-06-15',
  },
  {
    id: 'w2',
    marriageId: 'm2',
    marriage: mockMarriages[1],
    partner1: mockPlayers[1],
    partner2: mockPlayers[5],
    partner1Name: '烈焰战士',
    partner2Name: '月神祭司',
    style: 'fairyTale',
    decorations: [
      { id: 'd4', itemId: 'i4', itemName: '真爱花束', positionX: 1, positionY: 2, luxuryBonus: 45 },
      { id: 'd5', itemId: 'i5', itemName: '情侣手环', positionX: 4, positionY: 4, luxuryBonus: 40 },
    ],
    luxuryScore: 185,
    startTime: '2026-06-18T20:00:00',
    status: 'completed',
    guests: [
      { playerId: 'p1', player: mockPlayers[0], giftAmount: 500, message: '祝你们百年好合！', blessedAt: '2026-06-18T20:05:00' },
      { playerId: 'p3', player: mockPlayers[2], giftAmount: 300, message: '永结同心！', blessedAt: '2026-06-18T20:08:00' },
    ],
    blessingPoints: 1500,
    totalGift: 2800,
    createdAt: '2026-06-10',
  },
];

export const mockProposals: Proposal[] = [
  {
    id: 'prop1',
    proposerId: 'p1',
    targetId: 'p4',
    tokenItemId: 'i1',
    tokenQuality: 'legendary',
    intimacyValue: 850,
    successRate: 92.5,
    eventType: 'heavenlyBlessing',
    success: true,
    message: '天降祥瑞！求婚成功！星辰为证，日月为盟！',
    createdAt: '2026-03-14',
  },
  {
    id: 'prop2',
    proposerId: 'p2',
    targetId: 'p6',
    tokenItemId: 'i2',
    tokenQuality: 'epic',
    intimacyValue: 620,
    successRate: 78,
    eventType: null,
    success: true,
    message: '求婚成功！愿你们的爱情如钻石般永恒！',
    createdAt: '2026-04-20',
  },
  {
    id: 'prop3',
    proposerId: 'p3',
    targetId: 'p5',
    tokenItemId: 'i4',
    tokenQuality: 'rare',
    intimacyValue: 450,
    successRate: 55,
    eventType: 'loveCalamity',
    success: true,
    message: '经历情劫考验，真爱更加坚定！求婚成功！',
    createdAt: '2026-05-28',
  },
];

export const mockIntimacy: Record<string, number> = {
  'p1-p4': 850,
  'p2-p6': 620,
  'p3-p5': 450,
  'p1-p2': 300,
  'p1-p3': 200,
  'p4-p5': 250,
};

export function getPlayerById(id: string): Player | undefined {
  return mockPlayers.find(p => p.id === id);
}

export function getItemById(id: string): Item | undefined {
  return mockItems.find(i => i.id === id);
}

export function getIntimacy(player1Id: string, player2Id: string): number {
  const key1 = `${player1Id}-${player2Id}`;
  const key2 = `${player2Id}-${player1Id}`;
  return mockIntimacy[key1] || mockIntimacy[key2] || 0;
}

export function getMarriageByPlayerId(playerId: string): Marriage | undefined {
  return mockMarriages.find(m => m.player1Id === playerId || m.player2Id === playerId);
}

export function getMarriageById(id: string): Marriage | undefined {
  return mockMarriages.find(m => m.id === id);
}

export function getWeddingById(id: string): Wedding | undefined {
  return mockWeddings.find(w => w.id === id);
}

export const mockDailyLoveRecords: DailyLoveRecord[] = [
  { id: 'dlr1', marriageId: 'm1', loveGained: 50, eventType: 'sweet', createdAt: '2026-06-10' },
  { id: 'dlr2', marriageId: 'm1', loveGained: 30, eventType: null, createdAt: '2026-06-11' },
  { id: 'dlr3', marriageId: 'm1', loveGained: 80, eventType: 'sweet', createdAt: '2026-06-12' },
  { id: 'dlr4', marriageId: 'm1', loveGained: 25, eventType: 'coldWar', createdAt: '2026-06-13' },
  { id: 'dlr5', marriageId: 'm1', loveGained: 45, eventType: null, createdAt: '2026-06-14' },
  { id: 'dlr6', marriageId: 'm1', loveGained: 60, eventType: 'sweet', createdAt: '2026-06-15' },
  { id: 'dlr7', marriageId: 'm1', loveGained: 55, eventType: null, createdAt: '2026-06-16' },
  { id: 'dlr8', marriageId: 'm2', loveGained: 35, eventType: null, createdAt: '2026-06-10' },
  { id: 'dlr9', marriageId: 'm2', loveGained: 40, eventType: 'sweet', createdAt: '2026-06-11' },
  { id: 'dlr10', marriageId: 'm2', loveGained: 20, eventType: 'coldWar', createdAt: '2026-06-12' },
];

export function generateId(): string {
  return uuidv4();
}
