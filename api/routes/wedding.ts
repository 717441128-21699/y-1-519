import { Router, Request, Response } from 'express';
import { WeddingService } from '../../shared/services/WeddingService';
import type { WeddingStyle } from '../../shared/types';

const router = Router();

router.get('/styles', (_req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: WeddingService.WEDDING_STYLES,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取风格列表失败',
    });
  }
});

router.post('/calculate-luxury', (req: Request, res: Response) => {
  try {
    const { style, decorations } = req.body;
    const result = WeddingService.calculateLuxury(style as WeddingStyle, decorations || []);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '计算豪华度失败',
    });
  }
});

router.post('/create', (req: Request, res: Response) => {
  try {
    const { marriageId, style, decorations, startTime, luxuryScore, estimatedGift } = req.body;
    const result = WeddingService.createCompleteWedding(
      marriageId,
      style as WeddingStyle,
      decorations || [],
      startTime,
      luxuryScore,
      estimatedGift
    );
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: result.message,
      });
      return;
    }
    res.json({
      success: true,
      data: result.wedding,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '创建婚礼失败',
    });
  }
});

router.post('/prepare', (req: Request, res: Response) => {
  try {
    const { marriageId, style, startTime } = req.body;
    const result = WeddingService.createWedding(marriageId, style as WeddingStyle, startTime);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '创建婚礼失败',
    });
  }
});

router.get('/:weddingId', (req: Request, res: Response) => {
  try {
    const { weddingId } = req.params;
    const wedding = WeddingService.getWeddingById(weddingId);
    if (!wedding) {
      return res.status(404).json({
        success: false,
        message: '婚礼不存在',
      });
    }
    res.json({
      success: true,
      data: wedding,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取婚礼信息失败',
    });
  }
});

router.put('/:weddingId/decorate', (req: Request, res: Response) => {
  try {
    const { weddingId } = req.params;
    const { itemId, positionX, positionY } = req.body;
    const result = WeddingService.addDecoration(weddingId, itemId, positionX, positionY);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '添加装饰失败',
    });
  }
});

router.delete('/:weddingId/decoration/:decorationId', (req: Request, res: Response) => {
  try {
    const { weddingId, decorationId } = req.params;
    const result = WeddingService.removeDecoration(weddingId, decorationId);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '移除装饰失败',
    });
  }
});

router.get('/:weddingId/calculate-luxury', (req: Request, res: Response) => {
  try {
    const { weddingId } = req.params;
    const wedding = WeddingService.getWeddingById(weddingId);
    if (!wedding) {
      return res.status(404).json({
        success: false,
        message: '婚礼不存在',
      });
    }
    res.json({
      success: true,
      data: {
        luxuryScore: wedding.luxuryScore,
        style: wedding.style,
        decorations: wedding.decorations,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '计算豪华度失败',
    });
  }
});

router.post('/:weddingId/start', (req: Request, res: Response) => {
  try {
    const { weddingId } = req.params;
    const result = WeddingService.startWedding(weddingId);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '开始婚礼失败',
    });
  }
});

router.post('/:weddingId/blessing', (req: Request, res: Response) => {
  try {
    const { weddingId } = req.params;
    const { playerId, message, giftAmount } = req.body;
    const result = WeddingService.sendBlessing(weddingId, playerId, message, giftAmount);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '发送祝福失败',
    });
  }
});

router.post('/:weddingId/complete', (req: Request, res: Response) => {
  try {
    const { weddingId } = req.params;
    const result = WeddingService.completeWedding(weddingId);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '完成婚礼失败',
    });
  }
});

router.get('/marriage/:marriageId', (req: Request, res: Response) => {
  try {
    const { marriageId } = req.params;
    const weddings = WeddingService.getWeddingsByMarriage(marriageId);
    res.json({
      success: true,
      data: weddings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取婚礼列表失败',
    });
  }
});

router.get('/ongoing', (_req: Request, res: Response) => {
  try {
    const weddings = WeddingService.getOngoingWeddings();
    res.json({
      success: true,
      data: weddings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取进行中婚礼失败',
    });
  }
});

export default router;
