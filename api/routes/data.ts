import { Router, Request, Response } from 'express';
import { mockPlayers, mockItems, mockSkills, getPlayerById, getItemById } from '../../shared/mockData';

const router = Router();

router.get('/players', (_req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: mockPlayers,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取玩家列表失败',
    });
  }
});

router.get('/players/:playerId', (req: Request, res: Response) => {
  try {
    const { playerId } = req.params;
    const player = getPlayerById(playerId);
    if (!player) {
      return res.status(404).json({
        success: false,
        message: '玩家不存在',
      });
    }
    res.json({
      success: true,
      data: player,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取玩家信息失败',
    });
  }
});

router.get('/items', (_req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: mockItems,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取道具列表失败',
    });
  }
});

router.get('/items/:itemId', (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const item = getItemById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: '道具不存在',
      });
    }
    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取道具信息失败',
    });
  }
});

router.get('/skills', (_req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: mockSkills,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取技能列表失败',
    });
  }
});

router.get('/current-player', (_req: Request, res: Response) => {
  try {
    const player = mockPlayers[0];
    res.json({
      success: true,
      data: player,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取当前玩家失败',
    });
  }
});

export default router;
