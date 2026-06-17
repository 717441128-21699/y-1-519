import { create } from 'zustand';
import type { Player, Item, Marriage, Wedding, GuildWeddingHall, WeeklyReport, RankingEntry, BlessingMessage, ProposalResponse, Guild, WeddingStyle, MiniGameResult } from '../../shared/types';
import { dataApi, marriageApi, weddingApi, guildApi, reportsApi, rankingsApi, proposalApi } from '../utils/apiClient';

interface GameState {
  currentPlayer: Player | null;
  players: Player[];
  items: Item[];
  marriage: Marriage | null;
  wedding: Wedding | null;
  guildHall: GuildWeddingHall | null;
  weeklyReport: { report: WeeklyReport; insights: unknown[] } | null;
  guilds: Guild[];
  styles: WeddingStyle[];
  rankings: Record<string, RankingEntry[]>;
  blessingMessages: BlessingMessage[];
  blessing: number;
  loading: Record<string, boolean>;
  error: string | null;
  notifications: { id: string; type: string; message: string }[];

  setCurrentPlayer: (player: Player | null) => void;
  loadCurrentPlayer: () => Promise<void>;
  loadPlayers: () => Promise<void>;
  loadItems: () => Promise<void>;
  loadMarriage: (playerId: string) => Promise<void>;
  loadWedding: (weddingId: string) => Promise<void>;
  loadGuildHall: (playerId: string) => Promise<void>;
  loadWeeklyReport: (params?: { guildId?: string; style?: string; weekOffset?: number }) => Promise<void>;
  loadGuilds: () => Promise<void>;
  loadStyles: () => Promise<void>;
  loadRankings: (type: string) => Promise<void>;

  submitProposal: (data: { proposerId: string; targetId: string; tokenItemId: string }) => Promise<ProposalResponse | null>;
  claimDailyLove: (marriageId: string) => Promise<boolean>;
  enterDungeon: (marriageId: string) => Promise<boolean>;
  contributeGuild: (playerId: string, amount: number) => Promise<boolean>;
  approveUpgrade: (playerId: string, approve: boolean, rejectReason?: string) => Promise<boolean>;
  sendBlessing: (weddingId: string, playerId: string, message: string, giftAmount: number) => Promise<boolean>;
  addBlessingMessage: (message: BlessingMessage) => void;
  loadBlessingMessages: (weddingId: string) => Promise<void>;
  playMiniGame: (weddingId: string, playerId: string, gameType: string) => Promise<MiniGameResult | null>;

  addNotification: (type: string, message: string) => void;
  removeNotification: (id: string) => void;
  clearError: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentPlayer: null,
  players: [],
  items: [],
  marriage: null,
  wedding: null,
  guildHall: null,
  weeklyReport: null,
  guilds: [],
  styles: [],
  rankings: {},
  blessingMessages: [],
  blessing: 0,
  loading: {},
  error: null,
  notifications: [],

  setCurrentPlayer: (player) => set({ currentPlayer: player }),

  loadCurrentPlayer: async () => {
    try {
      set({ loading: { ...get().loading, currentPlayer: true } });
      const response = await dataApi.getCurrentPlayer();
      if (response.success) {
        set({ currentPlayer: response.data as Player });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '加载失败' });
    } finally {
      set({ loading: { ...get().loading, currentPlayer: false } });
    }
  },

  loadPlayers: async () => {
    try {
      set({ loading: { ...get().loading, players: true } });
      const response = await dataApi.getPlayers();
      if (response.success) {
        set({ players: response.data as Player[] });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '加载失败' });
    } finally {
      set({ loading: { ...get().loading, players: false } });
    }
  },

  loadItems: async () => {
    try {
      set({ loading: { ...get().loading, items: true } });
      const response = await dataApi.getItems();
      if (response.success) {
        set({ items: response.data as Item[] });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '加载失败' });
    } finally {
      set({ loading: { ...get().loading, items: false } });
    }
  },

  loadMarriage: async (playerId: string) => {
    try {
      set({ loading: { ...get().loading, marriage: true } });
      const response = await marriageApi.getByPlayer(playerId);
      if (response.success) {
        set({ marriage: response.data as Marriage | null });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '加载失败' });
    } finally {
      set({ loading: { ...get().loading, marriage: false } });
    }
  },

  loadWedding: async (weddingId: string) => {
    try {
      set({ loading: { ...get().loading, wedding: true } });
      const response = await weddingApi.getById(weddingId);
      if (response.success) {
        set({ wedding: response.data as Wedding });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '加载失败' });
    } finally {
      set({ loading: { ...get().loading, wedding: false } });
    }
  },

  loadGuildHall: async (playerId: string) => {
    try {
      set({ loading: { ...get().loading, guildHall: true } });
      const response = await guildApi.getHallByPlayer(playerId);
      if (response.success) {
        set({ guildHall: response.data as GuildWeddingHall | null });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '加载失败' });
    } finally {
      set({ loading: { ...get().loading, guildHall: false } });
    }
  },

  loadWeeklyReport: async (params) => {
    try {
      set({ loading: { ...get().loading, weeklyReport: true } });
      const response = await reportsApi.getWeekly(params);
      if (response.success) {
        set({ weeklyReport: response.data as { report: WeeklyReport; insights: unknown[] } });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '加载失败' });
    } finally {
      set({ loading: { ...get().loading, weeklyReport: false } });
    }
  },

  loadGuilds: async () => {
    try {
      set({ loading: { ...get().loading, guilds: true } });
      const response = await reportsApi.getGuilds();
      if (response.success) {
        set({ guilds: response.data as Guild[] });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '加载失败' });
    } finally {
      set({ loading: { ...get().loading, guilds: false } });
    }
  },

  loadStyles: async () => {
    try {
      set({ loading: { ...get().loading, styles: true } });
      const response = await reportsApi.getStyles();
      if (response.success) {
        set({ styles: response.data as WeddingStyle[] });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '加载失败' });
    } finally {
      set({ loading: { ...get().loading, styles: false } });
    }
  },

  loadRankings: async (type: string) => {
    try {
      set({ loading: { ...get().loading, [`ranking_${type}`]: true } });
      const response = await rankingsApi.getRanking(type);
      if (response.success) {
        set({
          rankings: {
            ...get().rankings,
            [type]: response.data as RankingEntry[],
          },
        });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '加载失败' });
    } finally {
      set({ loading: { ...get().loading, [`ranking_${type}`]: false } });
    }
  },

  submitProposal: async (data) => {
    try {
      set({ loading: { ...get().loading, proposal: true } });
      const response = await proposalApi.submit(data);
      if (response.success) {
        const result = response.data as ProposalResponse;
        get().addNotification(result.success ? 'success' : 'error', result.message);
        return result;
      }
      return null;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '求婚失败' });
      return null;
    } finally {
      set({ loading: { ...get().loading, proposal: false } });
    }
  },

  claimDailyLove: async (marriageId: string) => {
    try {
      const response = await marriageApi.claimDailyLove(marriageId);
      if (response.success) {
        const result = response.data as { success: boolean; message: string; loveGained: number };
        get().addNotification(result.success ? 'success' : 'info', result.message);
        if (result.success) {
          const marriage = get().marriage;
          if (marriage) {
            set({
              marriage: {
                ...marriage,
                loveValue: marriage.loveValue + result.loveGained,
                lastDailyClaim: new Date().toISOString().split('T')[0],
              },
            });
          }
        }
        return result.success;
      }
      return false;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '领取失败' });
      return false;
    }
  },

  enterDungeon: async (marriageId: string) => {
    try {
      const response = await marriageApi.enterDungeon(marriageId);
      if (response.success) {
        const result = response.data as { success: boolean; message: string };
        get().addNotification(result.success ? 'success' : 'error', result.message);
        if (result.success) {
          const marriage = get().marriage;
          if (marriage) {
            set({
              marriage: {
                ...marriage,
                dungeonRemaining: marriage.dungeonRemaining - 1,
              },
            });
          }
        }
        return result.success;
      }
      return false;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '挑战失败' });
      return false;
    }
  },

  contributeGuild: async (playerId: string, amount: number) => {
    try {
      const response = await guildApi.contribute({ playerId, amount });
      if (response.success) {
        const result = response.data as { success: boolean; message: string; hall?: GuildWeddingHall };
        get().addNotification('success', result.message);
        if (result.hall) {
          set({ guildHall: result.hall });
        }
        return result.success;
      }
      return false;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '贡献失败' });
      return false;
    }
  },

  approveUpgrade: async (playerId: string, approve: boolean, rejectReason?: string) => {
    try {
      const response = await guildApi.approveUpgrade({ playerId, approve, rejectReason });
      if (response.success) {
        const result = response.data as { success: boolean; message: string; hall?: GuildWeddingHall };
        get().addNotification(result.success ? 'info' : 'error', result.message);
        if (result.hall) {
          set({ guildHall: result.hall });
        }
        return result.success;
      }
      return false;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '审批失败' });
      return false;
    }
  },

  sendBlessing: async (weddingId: string, playerId: string, message: string, giftAmount: number) => {
    try {
      const response = await weddingApi.sendBlessing(weddingId, { playerId, message, giftAmount });
      if (response.success) {
        const result = response.data as { success: boolean; message: string; blessing?: BlessingMessage };
        get().addNotification('success', result.message);
        if (result.blessing) {
          get().addBlessingMessage(result.blessing);
        }
        set({ blessing: get().blessing + 1 });
        return result.success;
      }
      return false;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '发送失败' });
      return false;
    }
  },

  addBlessingMessage: (message) => {
    set({
      blessingMessages: [...get().blessingMessages, message].slice(-50),
    });
  },

  loadBlessingMessages: async (weddingId: string) => {
    try {
      const response = await weddingApi.getBlessings(weddingId);
      if (response.success) {
        set({ blessingMessages: (response.data as BlessingMessage[]).slice(-50) });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '加载祝福消息失败' });
    }
  },

  playMiniGame: async (weddingId: string, playerId: string, gameType: string) => {
    try {
      set({ loading: { ...get().loading, miniGame: true } });
      const response = await weddingApi.playMiniGame(weddingId, { playerId, gameType });
      if (response.success) {
        const result = response.data as { success: boolean; result?: MiniGameResult; message: string };
        get().addNotification(result.success ? 'success' : 'error', result.message);
        if (result.success && result.result) {
          return result.result;
        }
      }
      return null;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '玩小游戏失败' });
      return null;
    } finally {
      set({ loading: { ...get().loading, miniGame: false } });
    }
  },

  addNotification: (type, message) => {
    const id = Date.now().toString();
    set({
      notifications: [...get().notifications, { id, type, message }],
    });
    setTimeout(() => {
      get().removeNotification(id);
    }, 5000);
  },

  removeNotification: (id) => {
    set({
      notifications: get().notifications.filter((n) => n.id !== id),
    });
  },

  clearError: () => set({ error: null }),
}));
