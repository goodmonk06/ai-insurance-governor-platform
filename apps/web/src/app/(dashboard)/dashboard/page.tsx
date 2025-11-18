'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Building2, FileText, AlertTriangle, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalInsured: 0,
    activePolicies: 0,
    expiringPolicies: 0,
    highRiskEntities: 0,
    totalPremium: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const tenantId = 'tenant-1'; // 実際にはログインユーザーから取得

      const [insuredRes, policiesRes, expiringRes, riskRes] = await Promise.all([
        api.get(`/insured/tenant/${tenantId}`),
        api.get(`/policies/tenant/${tenantId}`),
        api.get(`/policies/tenant/${tenantId}/expiring?days=30`),
        api.get(`/risk/tenant/${tenantId}/portfolio-summary`),
      ]);

      const activePolicies = policiesRes.data.filter((p: any) => p.status === 'active');
      const totalPremium = activePolicies.reduce((sum: number, p: any) => sum + p.premium, 0);

      setStats({
        totalInsured: insuredRes.data.length,
        activePolicies: activePolicies.length,
        expiringPolicies: expiringRes.data.length,
        highRiskEntities: riskRes.data.byRank.high + riskRes.data.byRank.critical,
        totalPremium,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">ダッシュボード</h1>
        <p className="text-muted-foreground">保険ポートフォリオの概要</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">被保険者数</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInsured}</div>
            <p className="text-xs text-muted-foreground">管理中の施設・法人</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">有効契約数</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePolicies}</div>
            <p className="text-xs text-muted-foreground">
              30日以内更新: {stats.expiringPolicies}件
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">高リスク施設</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highRiskEntities}</div>
            <p className="text-xs text-muted-foreground">要注意リスクレベル</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総保険料</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalPremium)}</div>
            <p className="text-xs text-muted-foreground">年間合計</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>最近の活動</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium">新規見積もり作成</p>
                  <p className="text-sm text-muted-foreground">
                    あおぞら訪問看護ステーション
                  </p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">2時間前</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium">リスク評価完了</p>
                  <p className="text-sm text-muted-foreground">さくら介護ホーム</p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">5時間前</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium">契約更新</p>
                  <p className="text-sm text-muted-foreground">
                    ひまわりデイサービスセンター
                  </p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">1日前</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>リスク分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>低リスク</span>
                  <span className="font-medium">33%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-1/3 rounded-full bg-green-500" />
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>中リスク</span>
                  <span className="font-medium">50%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-1/2 rounded-full bg-yellow-500" />
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>高リスク</span>
                  <span className="font-medium">17%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-1/6 rounded-full bg-red-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
