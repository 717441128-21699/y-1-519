import { Router, Request, Response } from 'express';
import { GuildService } from '../../shared/services/GuildService';

const router = Router();

router.get('/hall/:guildId', (req: Request, res: Response) => {
  try {
    const { guildId } = req.params;
    const hall = GuildService.getGuildHall(guildId);
    if (!hall) {
      return res.status(404).json({
        success: false,
        message: '公会婚庆堂不存在',
      });
    }
    res.json({
      success: true,
      data: hall,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取婚庆堂信息失败',
    });
  }
});

router.get('/hall/player/:playerId', (req: Request, res: Response) => {
  try {
    const { playerId } = req.params;
    const hall = GuildService.getGuildHallByPlayer(playerId);
    if (!hall) {
      return res.json({
        success: true,
        data: null,
        message: '该玩家暂无公会婚庆堂',
      });
    }
    res.json({
      success: true,
      data: hall,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取婚庆堂信息失败',
    });
  }
});

router.post('/hall/contribute', (req: Request, res: Response) => {
  try {
    const { playerId, amount } = req.body;
    const result = GuildService.contribute(playerId, amount);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '贡献失败',
    });
  }
});

router.post('/hall/upgrade', (req: Request, res: Response) => {
  try {
    const { playerId } = req.body;
    const result = GuildService.requestUpgrade(playerId);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '申请升级失败',
    });
  }
});

router.post('/hall/approve', (req: Request, res: Response) => {
  try {
    const { playerId, approve } = req.body;
    const result = GuildService.approveUpgrade(playerId, approve);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '审批失败',
    });
  }
});

router.get('/hall/:guildId/ranking', (req: Request, res: Response) => {
  try {
    const { guildId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    const ranking = GuildService.getContributionRanking(guildId, limit);
    res.json({
      success: true,
      data: ranking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取排行榜失败',
    });
  }
});

router.get('/halls/all', (_req: Request, res: Response) => {
  try {
    const halls = GuildService.getAllGuildHalls();
    res.json({
      success: true,
      data: halls,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取列表失败',
    });
  }
});

export default router;
