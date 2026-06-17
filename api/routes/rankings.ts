import { Router, Request, Response } from 'express';
import { RankingService } from '../../shared/services/RankingService';
import type { RankingType } from '../../shared/types';

const router = Router();

router.get('/config', (_req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: RankingService.RANKING_CONFIG,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取配置失败',
    });
  }
});

router.get('/:type', (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;
    const rankings = RankingService.getRanking(type as RankingType, limit);
    res.json({
      success: true,
      data: rankings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取排行榜失败',
    });
  }
});

router.get('/:type/player/:playerId', (req: Request, res: Response) => {
  try {
    const { type, playerId } = req.params;
    const rank = RankingService.getPlayerRank(playerId, type as RankingType);
    if (!rank) {
      return res.json({
        success: true,
        data: null,
        message: '未找到排名信息',
      });
    }
    res.json({
      success: true,
      data: rank,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取玩家排名失败',
    });
  }
});

export default router;
