import { Router, Request, Response } from 'express';
import { ProposalService } from '../../shared/services/ProposalService';
import type { ProposalRequest } from '../../shared/types';

const router = Router();

router.post('/calculate', (req: Request, res: Response) => {
  try {
    const request: ProposalRequest = req.body;
    const result = ProposalService.calculateProposalRate(request);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '计算失败',
    });
  }
});

router.post('/submit', (req: Request, res: Response) => {
  try {
    const request: ProposalRequest = req.body;
    const result = ProposalService.submitProposal(request);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '求婚失败',
    });
  }
});

router.get('/history/:playerId', (req: Request, res: Response) => {
  try {
    const { playerId } = req.params;
    const history = ProposalService.getProposalHistory(playerId);
    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取历史失败',
    });
  }
});

export default router;
