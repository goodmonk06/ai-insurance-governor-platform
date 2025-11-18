'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { AlertTriangle, TrendingUp, Shield, Activity } from 'lucide-react';

export default function RiskPage() {
  const [portfolioSummary, setPortfolioSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRiskData();
  }, []);

  const loadRiskData = async () => {
    try {
      const tenantId = 'tenant-1';
      const response = await api.get(`/risk/tenant/${tenantId}/portfolio-summary`);
      setPortfolioSummary(response.data);
    } catch (error) {
      console.error('Failed to load risk data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (rank: string) => {
    const colors: Record<string, string> = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      critical: 'text-red-600',
    };
    return colors[rank] || 'text-gray-600';
  };

  const getRiskBgColor = (rank: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    };
    return colors[rank] || 'bg-gray-100 text-gray-800';
  };

  const getRiskLabel = (rank: string) => {
    const labels: Record<string, string> = {
      low: '低リスク',
      medium: '中リスク',
      high: '高リスク',
      critical: '危険',
    };
    return labels[rank] || rank;
  };

  const getScenarioLabel = (type: string) => {
    const labels: Record<string, string> = {
      nursing_home_fire: '施設火災',
      medical_malpractice: '医療過誤',
      employee_injury: '従業員災害',
      equipment_failure: '設備故障',
      infection_outbreak: '感染症流行',
      natural_disaster: '自然災害',
    };
    return labels[type] || type;
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (!portfolioSummary) {
    return <div>データの読み込みに失敗しました</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">リスク評価</h1>
          <p className="text-muted-foreground">ポートフォリオ全体のリスク分析</p>
        </div>
        <Button>一括再評価</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">評価済み施設</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioSummary.total}</div>
            <p className="text-xs text-muted-foreground">リスク評価完了</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均リスクスコア</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {portfolioSummary.averageScore.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">100点満点中</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">高リスク施設</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {portfolioSummary.byRank.high}
            </div>
            <p className="text-xs text-muted-foreground">要注意</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">危険施設</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {portfolioSummary.byRank.critical}
            </div>
            <p className="text-xs text-muted-foreground">緊急対応必要</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>リスク分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">低リスク</span>
                <span className="text-sm text-muted-foreground">
                  {portfolioSummary.byRank.low}施設 (
                  {((portfolioSummary.byRank.low / portfolioSummary.total) * 100).toFixed(0)}
                  %)
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted">
                <div
                  className="h-3 rounded-full bg-green-500"
                  style={{
                    width: `${(portfolioSummary.byRank.low / portfolioSummary.total) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">中リスク</span>
                <span className="text-sm text-muted-foreground">
                  {portfolioSummary.byRank.medium}施設 (
                  {((portfolioSummary.byRank.medium / portfolioSummary.total) * 100).toFixed(0)}
                  %)
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted">
                <div
                  className="h-3 rounded-full bg-yellow-500"
                  style={{
                    width: `${(portfolioSummary.byRank.medium / portfolioSummary.total) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">高リスク</span>
                <span className="text-sm text-muted-foreground">
                  {portfolioSummary.byRank.high}施設 (
                  {((portfolioSummary.byRank.high / portfolioSummary.total) * 100).toFixed(0)}
                  %)
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted">
                <div
                  className="h-3 rounded-full bg-orange-500"
                  style={{
                    width: `${(portfolioSummary.byRank.high / portfolioSummary.total) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">危険</span>
                <span className="text-sm text-muted-foreground">
                  {portfolioSummary.byRank.critical}施設 (
                  {((portfolioSummary.byRank.critical / portfolioSummary.total) * 100).toFixed(0)}
                  %)
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted">
                <div
                  className="h-3 rounded-full bg-red-500"
                  style={{
                    width: `${(portfolioSummary.byRank.critical / portfolioSummary.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">施設別リスク評価</h2>
        {portfolioSummary.assessments.map((assessment: any) => (
          <Card key={assessment.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {assessment.insuredEntity?.name || '不明'}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {getScenarioLabel(assessment.scenarioType)}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getRiskBgColor(assessment.rank)}`}
                  >
                    {getRiskLabel(assessment.rank)}
                  </span>
                  <p className={`mt-1 text-2xl font-bold ${getRiskColor(assessment.rank)}`}>
                    {assessment.score.toFixed(1)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {assessment.detailJson?.recommendations && (
                <div>
                  <p className="text-sm font-medium mb-2">推奨事項</p>
                  <ul className="list-disc list-inside space-y-1">
                    {assessment.detailJson.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm">
                  詳細レポート
                </Button>
                <Button size="sm">再評価</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
