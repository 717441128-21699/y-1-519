import { Router, Request, Response } from 'express';
import { MarriageService } from '../../shared/services/MarriageService';

const router = Router();

router.get('/player/:playerId', (req: Request, res: Response) => {
  try {
    const { playerId } = req.params;
    const marriage = MarriageService.getMarriageByPlayer(playerId);
    if (!marriage) {
      return res.json({
        success: true,
        data: null,
        message: '该玩家暂无婚姻关系',
      });
    }
    res.json({
      success: true,
      data: marriage,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取婚姻信息失败',
    });
  }
});

router.get('/:marriageId', (req: Request, res: Response) => {
  try {
    const { marriageId } = req.params;
    const marriage = MarriageService.getMarriageById(marriageId);
    if (!marriage) {
      return res.status(404).json({
        success: false,
        message: '婚姻关系不存在',
      });
    }
    res.json({
      success: true,
      data: marriage,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取婚姻信息失败',
    });
  }
});

router.get('/:marriageId/skills', (req: Request, res: Response) => {
  try {
    const { marriageId } = req.params;
    const marriage = MarriageService.getMarriageById(marriageId);
    if (!marriage) {
      return res.status(404).json({
        success: false,
        message: '婚姻关系不存在',
      });
    }
    res.json({
      success: true,
      data: marriage.skills,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取技能列表失败',
    });
  }
});

router.post('/:marriageId/daily-love', (req: Request, res: Response) => {
  try {
    const { marriageId } = req.params;
    const result = MarriageService.claimDailyLove(marriageId);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '领取恩爱值失败',
    });
  }
});

router.post('/:marriageId/dungeon', (req: Request, res: Response) => {
  try {
    const { marriageId } = req.params;
    const result = MarriageService.enterDungeon(marriageId);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '挑战副本失败',
    });
  }
});

router.get('/:marriageId/records', (req: Request, res: Response) => {
  try {
    const { marriageId } = req.params;
    const days = parseInt(req.query.days as string) || 7;
    const records = MarriageService.getDailyRecords(marriageId, days);
    res.json({
      success: true,
      data: records,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取记录失败',
    });
  }
});

router.get('/all', (_req: Request, res: Response) => {
  try {
    const marriages = MarriageService.getAllMarriages();
    res.json({
      success: true,
      data: marriages,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取列表失败',
    });
  }
});

export default router;
