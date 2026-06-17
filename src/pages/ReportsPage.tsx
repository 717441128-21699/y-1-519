import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download, Calendar, TrendingUp, Heart, Sparkles, FileText, Coins } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { MagicCard } from '../components/MagicCard';
import { MagicButton } from '../components/MagicButton';
import { ProgressBar } from '../components/ProgressBar';
import ReactECharts from 'echarts-for-react';
import html2pdf from 'html2pdf.js';
import type { EChartsOption } from 'echarts';

export default function ReportsPage() {
  const { weeklyReport, loadWeeklyReport, loading } = useGameStore();
  const reportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadWeeklyReport();
  }, [loadWeeklyReport]);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    
    setExporting(true);
    try {
      const opt = {
        margin: 10,
        filename: '姻缘周报.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };
      await html2pdf().set(opt).from(reportRef.current).save();
    } catch (error) {
      console.error('导出PDF失败', error);
    } finally {
      setExporting(false);
    }
  };

  const heatmapData = weeklyReport?.report?.weddingStyleHeatmap || {};
  const loveTrendData = weeklyReport?.report?.loveValueTrend || [];
  const transactionTrendData = weeklyReport?.report?.transactionTrend || [];
  const radarData = (weeklyReport?.report?.radarData || {}) as {
    proposalSuccess: number;
    marriageHappiness: number;
    weddingLuxury: number;
    loveIndex: number;
    guildActivity: number;
    sweetness: number;
    guildContribution: number;
    activityLevel: number;
  };
  const summary = (weeklyReport?.report?.summary || {}) as {
    totalProposals: number;
    successRate: number;
    totalWeddings: number;
    avgLuxuryScore: number;
    totalGuildContribution: number;
    totalGifts: string | number;
  };

  const styleNames: Record<string, { name: string; icon: string }> = {
    fairyTale: { name: '梦幻童话', icon: '🏰' },
    darkFantasy: { name: '黑暗幻想', icon: '🌙' },
    xianxia: { name: '仙侠情缘', icon: '⛩️' },
    starryNight: { name: '星空主题', icon: '✨' },
    oceanDream: { name: '海洋之梦', icon: '🌊' },
    forestWonder: { name: '森林奇幻', icon: '🌲' },
  };

  const heatmapChartOption: EChartsOption = {
    tooltip: { trigger: 'item' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: Object.keys(heatmapData).map(k => styleNames[k]?.name || k), axisLabel: { color: '#9CA3AF' } },
    yAxis: { type: 'value', axisLabel: { color: '#9CA3AF' } },
    series: [{
      type: 'bar',
      data: Object.values(heatmapData),
      itemStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#EC4899' },
            { offset: 1, color: '#6B46C1' },
          ],
        },
        borderRadius: [8, 8, 0, 0],
      },
    }],
    backgroundColor: 'transparent',
  };

  const trendChartOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: loveTrendData.map(d => d.date),
      axisLabel: { color: '#9CA3AF' }
    },
    yAxis: { type: 'value', axisLabel: { color: '#9CA3AF' } },
    series: [{
      type: 'line',
      data: loveTrendData.map(d => d.avg),
      smooth: true,
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(236, 72, 153, 0.3)' },
            { offset: 1, color: 'rgba(107, 70, 193, 0.05)' },
          ],
        },
      },
      lineStyle: { color: '#EC4899', width: 3 },
      itemStyle: { color: '#F59E0B' },
    }],
    backgroundColor: 'transparent',
  };

  const radarChartOption: EChartsOption = {
    tooltip: {},
    radar: {
      indicator: [
        { name: '求婚成功率', max: 100 },
        { name: '婚姻幸福度', max: 100 },
        { name: '婚礼豪华度', max: 100 },
        { name: '恩爱指数', max: 100 },
        { name: '公会活跃度', max: 100 },
        { name: '甜蜜指数', max: 100 },
      ],
      axisName: { color: '#9CA3AF' },
      splitLine: { lineStyle: { color: 'rgba(139, 92, 246, 0.3)' } },
      splitArea: { areaStyle: { color: ['rgba(139, 92, 246, 0.05)', 'rgba(139, 92, 246, 0.1)'] } },
    },
    series: [{
      type: 'radar',
      data: [{
      value: [
          radarData.proposalSuccess || 75,
          radarData.marriageHappiness || 80,
          radarData.weddingLuxury || 70,
          radarData.loveIndex || 85,
          radarData.guildActivity || 65,
          radarData.sweetness || 90,
        ],
        name: '本周数据',
        areaStyle: { color: 'rgba(236, 72, 153, 0.3)' },
        lineStyle: { color: '#EC4899' },
        itemStyle: { color: '#F59E0B' },
      }],
    }],
    backgroundColor: 'transparent',
  };

  const transactionChartOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: transactionTrendData.map(d => d.date),
      axisLabel: { color: '#9CA3AF' }
    },
    yAxis: { type: 'value', axisLabel: { color: '#9CA3AF' } },
    series: [{
      type: 'line',
      data: transactionTrendData.map(d => d.amount),
      smooth: true,
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(245, 158, 11, 0.3)' },
            { offset: 1, color: 'rgba(107, 70, 193, 0.05)' },
          ],
        },
      },
      lineStyle: { color: '#F59E0B', width: 3 },
      itemStyle: { color: '#EC4899' },
    }],
    backgroundColor: 'transparent',
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl font-bold mb-2 flex items-center gap-3">
              <BarChart3 className="w-10 h-10 text-magic-green" />
              姻缘周报
            </h1>
            <p className="text-gray-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {weeklyReport?.report?.weekStart || '2024-01-01'} ~ {weeklyReport?.report?.weekEnd || '2024-01-07'}
            </p>
          </motion.div>
          
          <MagicButton onClick={handleExportPDF} loading={exporting}>
            <Download className="w-5 h-5" />
            导出PDF
          </MagicButton>
        </div>

        <div ref={reportRef}>
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <MagicCard hover={false} className="text-center p-6">
              <div className="text-3xl mb-2">💍</div>
              <p className="text-3xl font-bold text-magic-purple">{summary.totalProposals || 156}</p>
              <p className="text-sm text-gray-400">求婚总数</p>
            </MagicCard>
            <MagicCard hover={false} className="text-center p-6">
              <div className="text-3xl mb-2">💖</div>
              <p className="text-3xl font-bold text-magic-pink">{summary.successRate || 78}%</p>
              <p className="text-sm text-gray-400">成功率</p>
            </MagicCard>
            <MagicCard hover={false} className="text-center p-6">
              <div className="text-3xl mb-2">💒</div>
              <p className="text-3xl font-bold text-magic-gold">{summary.totalWeddings || 89}</p>
              <p className="text-sm text-gray-400">婚礼数</p>
            </MagicCard>
            <MagicCard hover={false} className="text-center p-6">
              <div className="text-3xl mb-2">💰</div>
              <p className="text-3xl font-bold text-magic-green">{summary.totalGifts || '12.5K'}</p>
              <p className="text-sm text-gray-400">礼金总额</p>
            </MagicCard>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <MagicCard hover={false}>
              <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-magic-pink" />
                婚礼风格热力图
              </h3>
              <div className="h-64">
                <ReactECharts option={heatmapChartOption} style={{ height: '100%' }} />
              </div>
            </MagicCard>

            <MagicCard hover={false}>
              <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-magic-gold" />
                恩爱值趋势
              </h3>
              <div className="h-64">
                <ReactECharts option={trendChartOption} style={{ height: '100%' }} />
              </div>
            </MagicCard>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <MagicCard hover={false}>
              <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <Coins className="w-5 h-5 text-magic-gold" />
                交易走势
              </h3>
              <div className="h-64">
                <ReactECharts option={transactionChartOption} style={{ height: '100%' }} />
              </div>
            </MagicCard>

            <MagicCard hover={false}>
              <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-magic-purple" />
                综合雷达图
              </h3>
              <div className="h-64">
                <ReactECharts option={radarChartOption} style={{ height: '100%' }} />
              </div>
            </MagicCard>
          </div>

          <div className="mb-8">
            <MagicCard hover={false}>
              <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-magic-blue" />
                数据洞察
              </h3>
              <div className="space-y-4">
                {weeklyReport?.insights?.map((insight: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-magic-darker/50 rounded-xl"
                  >
                    <span className="text-2xl">{insight.icon || '📊'}</span>
                    <div>
                      <p className="font-semibold">{insight.title}</p>
                      <p className="text-sm text-gray-400">{insight.description}</p>
                    </div>
                  </motion.div>
                ))}
                {!weeklyReport?.insights?.length && (
                  <>
                    <div className="flex items-start gap-3 p-3 bg-magic-darker/50 rounded-xl">
                      <span className="text-2xl">📈</span>
                      <div>
                        <p className="font-semibold">恩爱值持续上升</p>
                        <p className="text-sm text-gray-400">本周平均恩爱值较上周增长15%，婚姻系统活跃度提升</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-magic-darker/50 rounded-xl">
                      <span className="text-2xl">🏰</span>
                      <div>
                        <p className="font-semibold">星空主题最受欢迎</p>
                        <p className="text-sm text-gray-400">星空主题婚礼占比35%，成为最受新人喜爱</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-magic-darker/50 rounded-xl">
                      <span className="text-2xl">💝</span>
                      <div>
                        <p className="font-semibold">情劫事件触发率降低</p>
                        <p className="text-sm text-gray-400">本周情劫事件触发率8%，低于平均水平10%</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </MagicCard>
          </div>

          <MagicCard hover={false}>
            <h3 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-magic-pink" />
              本周最佳情侣
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                <tr className="text-left text-gray-400 border-b border-magic-purple/30">
                  <th className="pb-3">排名</th>
                  <th className="pb-3">情侣</th>
                  <th className="pb-3">恩爱值</th>
                  <th className="pb-3">婚礼风格</th>
                  <th className="pb-3 text-right">甜蜜事件</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { rank: 1, p1: '月影法师', p2: '星光术士', love: 15680, style: '✨ 星空主题', events: 12 },
                  { rank: 2, p1: '烈焰战士', p2: '森林精灵', love: 12450, style: '🏰 梦幻童话', events: 9 },
                  { rank: 3, p1: '暗影刺客', p2: '月神祭司', love: 10230, style: '🌙 黑暗幻想', events: 15 },
                ].map((couple, index) => (
                  <motion.tr
                    key={couple.rank}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-magic-purple/10"
                  >
                    <td className="py-3">
                      <span className={`font-bold ${
                        couple.rank === 1 ? 'text-yellow-400' :
                        couple.rank === 2 ? 'text-gray-300' :
                        couple.rank === 3 ? 'text-amber-600' : 'text-gray-500'
                      }`}>
                        #{couple.rank}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="font-semibold">{couple.p1}</span>
                      <span className="mx-2 text-magic-pink">💖</span>
                      <span className="font-semibold">{couple.p2}</span>
                    </td>
                    <td className="py-3 text-magic-gold font-bold">{couple.love.toLocaleString()}</td>
                    <td className="py-3">{couple.style}</td>
                    <td className="py-3 text-right text-magic-pink">{couple.events} 🌸</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            </div>
          </MagicCard>
        </div>
      </div>
    </div>
  );
}
