import { Router, Request, Response } from 'express';
import { ReportService } from '../../shared/services/ReportService';
import type { WeddingStyle } from '../../shared/types';

const router = Router();

router.get('/weekly', (req: Request, res: Response) => {
  try {
    const { guildId, style, weekOffset } = req.query;

    const filter = {
      guildId: typeof guildId === 'string' ? guildId : undefined,
      style: typeof style === 'string' ? (style as WeddingStyle) : undefined,
      weekOffset: typeof weekOffset === 'string' ? parseInt(weekOffset, 10) : undefined,
    };

    const report = ReportService.generateWeeklyReport(filter);
    const insights = ReportService.getReportInsights(report);
    res.json({
      success: true,
      data: {
        report,
        insights,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '生成周报告失败',
    });
  }
});

router.get('/guilds', (_req: Request, res: Response) => {
  try {
    const guilds = ReportService.getAllGuilds();
    res.json({
      success: true,
      data: guilds,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取公会列表失败',
    });
  }
});

router.get('/styles', (_req: Request, res: Response) => {
  try {
    const styles = ReportService.getAllStyles();
    res.json({
      success: true,
      data: styles,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '获取婚礼风格列表失败',
    });
  }
});

router.post('/weekly/export', (req: Request, res: Response) => {
  try {
    const { report } = req.body;
    const jsonData = ReportService.exportPDF(report);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=weekly-report.json');
    res.json({
      success: true,
      data: jsonData,
      message: '报告导出成功',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '导出报告失败',
    });
  }
});

export default router;
