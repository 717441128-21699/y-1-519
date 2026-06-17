import { Router, Request, Response } from 'express';
import { ReportService } from '../../shared/services/ReportService';

const router = Router();

router.get('/weekly', (_req: Request, res: Response) => {
  try {
    const report = ReportService.generateWeeklyReport();
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
