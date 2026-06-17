import type { ProposalRequest, ProposalResponse, Proposal, Quality, Marriage } from '../types';
import { getItemById, getIntimacy, getPlayerById, mockProposals, mockMarriages, mockSkills } from '../mockData';
import { generateId } from '../mockData';

export class ProposalService {
  static readonly BASE_RATE = 20;

  static calculateIntimacyFactor(intimacy: number): number {
    if (intimacy >= 800) return 45;
    if (intimacy >= 600) return 38;
    if (intimacy >= 400) return 30;
    if (intimacy >= 200) return 22;
    if (intimacy >= 100) return 15;
    return 5;
  }

  static getQualityBonus(quality: Quality): number {
    const bonuses: Record<Quality, number> = {
      common: 8,
      rare: 20,
      epic: 35,
      legendary: 50,
    };
    return bonuses[quality];
  }

  static computeBaseRate(intimacy: number, qualityBonus: number): number {
    const intimacyFactor = this.calculateIntimacyFactor(intimacy);
    return Math.min(Math.max(intimacyFactor + qualityBonus, 5), 95);
  }

  static triggerRandomEvent(): 'loveCalamity' | 'heavenlyBlessing' | null {
    const rand = Math.random() * 100;
    if (rand < 10) return 'loveCalamity';
    if (rand < 25) return 'heavenlyBlessing';
    return null;
  }

  static applyEventEffect(baseRate: number, event: 'loveCalamity' | 'heavenlyBlessing' | null): { finalRate: number; message: string } {
    switch (event) {
      case 'heavenlyBlessing':
        return {
          finalRate: Math.min(baseRate + 25, 98),
          message: '✨ 天降祥瑞！吉星高照，求婚成功率大幅提升！',
        };
      case 'loveCalamity':
        return {
          finalRate: Math.max(baseRate - 20, 5),
          message: '💔 情劫降临！前路坎坷，需要更坚定的爱情才能突破考验！',
        };
      default:
        return { finalRate: baseRate, message: '' };
    }
  }

  static calculateProposalRate(request: ProposalRequest): {
    successRate: number;
    intimacy: number;
    qualityBonus: number;
    intimacyFactor: number;
    baseRate: number;
  } {
    const intimacy = getIntimacy(request.proposerId, request.targetId);
    const item = getItemById(request.tokenItemId);
    if (!item) {
      return { successRate: 0, intimacy, qualityBonus: 0, intimacyFactor: 0, baseRate: 0 };
    }
    const qualityBonus = this.getQualityBonus(item.quality);
    const intimacyFactor = this.calculateIntimacyFactor(intimacy);
    const baseRate = this.computeBaseRate(intimacy, qualityBonus);

    return { successRate: baseRate, intimacy, qualityBonus, intimacyFactor, baseRate };
  }

  static submitProposal(request: ProposalRequest): ProposalResponse {
    const proposer = getPlayerById(request.proposerId);
    const target = getPlayerById(request.targetId);
    const item = getItemById(request.tokenItemId);

    if (!proposer || !target || !item) {
      return {
        success: false,
        successRate: 0,
        event: null,
        message: '求婚失败：无效的玩家或道具！',
        baseRate: 0,
        eventBonus: 0,
        finalRate: 0,
        rollResult: 0,
      };
    }

    if (proposer.level < 30 || target.level < 30) {
      return {
        success: false,
        successRate: 0,
        event: null,
        message: '求婚失败：双方等级需达到30级！',
        baseRate: 0,
        eventBonus: 0,
        finalRate: 0,
        rollResult: 0,
      };
    }

    const existingMarriage = mockMarriages.find(
      m => m.player1Id === request.proposerId || 
           m.player2Id === request.proposerId ||
           m.player1Id === request.targetId ||
           m.player2Id === request.targetId
    );

    if (existingMarriage) {
      return {
        success: false,
        successRate: 0,
        event: null,
        message: '求婚失败：其中一方已有婚姻关系！',
        baseRate: 0,
        eventBonus: 0,
        finalRate: 0,
        rollResult: 0,
      };
    }

    const { successRate: baseRate, intimacy } = this.calculateProposalRate(request);
    const event = this.triggerRandomEvent();
    const { finalRate, message: eventEffectMessage } = this.applyEventEffect(baseRate, event);

    let eventBonus = 0;
    if (event === 'heavenlyBlessing') eventBonus = 25;
    else if (event === 'loveCalamity') eventBonus = -20;

    const roll = Math.random();
    const rollResult = Math.round(roll * 100);
    const success = rollResult < finalRate;

    let finalMessage = '';
    if (success) {
      if (event === 'heavenlyBlessing') {
        finalMessage = `🎉 天降祥瑞！${proposer.name}向${target.name}求婚成功！星辰为证，日月为盟！`;
      } else if (event === 'loveCalamity') {
        finalMessage = `💪 经历情劫考验，${proposer.name}与${target.name}的爱情更加坚定！求婚成功！`;
      } else {
        finalMessage = `💕 ${proposer.name}向${target.name}求婚成功！愿你们的爱情如${item.name}般永恒！`;
      }

      const newMarriage: Marriage = {
        id: generateId(),
        player1Id: request.proposerId,
        player2Id: request.targetId,
        player1: proposer,
        player2: target,
        partner1: proposer,
        partner2: target,
        partner1Name: proposer.name,
        partner2Name: target.name,
        loveValue: intimacy,
        marryDate: new Date().toISOString().split('T')[0],
        marriageDays: 0,
        todayEvent: null,
        lastDailyClaim: null,
        dungeonRemaining: 1,
        weddingCount: 0,
        skills: mockSkills.map(skill => ({
          id: generateId(),
          skillId: skill.id,
          skill,
          unlocked: intimacy >= skill.requiredLove,
          unlockedAt: intimacy >= skill.requiredLove ? new Date().toISOString() : null,
          requiredLoveValue: skill.requiredLove,
          skillLevel: intimacy >= skill.requiredLove ? 1 : undefined,
        })),
      };
      mockMarriages.push(newMarriage);
    } else {
      if (event === 'loveCalamity') {
        finalMessage = `💔 情劫未能突破，${proposer.name}的求婚被${target.name}拒绝了...24小时后可再次尝试。`;
      } else {
        finalMessage = `😢 很遗憾，${proposer.name}的求婚被${target.name}拒绝了...提升亲密度或使用更高品质的信物后再试试吧！`;
      }
    }

    const proposal: Proposal = {
      id: generateId(),
      proposerId: request.proposerId,
      targetId: request.targetId,
      tokenItemId: request.tokenItemId,
      tokenQuality: item.quality,
      intimacyValue: intimacy,
      successRate: finalRate,
      eventType: event,
      success,
      message: finalMessage,
      createdAt: new Date().toISOString(),
    };
    mockProposals.push(proposal);

    return {
      success,
      successRate: finalRate,
      event,
      message: eventEffectMessage ? `${eventEffectMessage}\n${finalMessage}` : finalMessage,
      proposalId: proposal.id,
      baseRate,
      eventBonus,
      finalRate,
      rollResult,
      eventEffectMessage: eventEffectMessage || undefined,
    };
  }

  static getProposalHistory(playerId: string): Proposal[] {
    return mockProposals.filter(
      p => p.proposerId === playerId || p.targetId === playerId
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
