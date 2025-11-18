'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Building2, MapPin, Phone, AlertTriangle } from 'lucide-react';

export default function InsuredPage() {
  const [insuredEntities, setInsuredEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsuredEntities();
  }, []);

  const loadInsuredEntities = async () => {
    try {
      const tenantId = 'tenant-1';
      const response = await api.get(`/insured/tenant/${tenantId}`);
      setInsuredEntities(response.data);
    } catch (error) {
      console.error('Failed to load insured entities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      facility: '施設',
      corporation: '法人',
      individual: '個人',
    };
    return labels[type] || type;
  };

  const getRiskBadge = (rank?: string) => {
    if (!rank) return null;
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    };
    const labels: Record<string, string> = {
      low: '低',
      medium: '中',
      high: '高',
      critical: '危険',
    };
    return (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${colors[rank]}`}>
        {labels[rank]}
      </span>
    );
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">被保険者管理</h1>
          <p className="text-muted-foreground">施設・法人・個人の管理</p>
        </div>
        <Button>新規登録</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {insuredEntities.map((entity) => {
          const latestRisk = entity.riskAssessments?.[0];
          const activePolicies = entity.policies?.filter((p: any) => p.status === 'active');

          return (
            <Card key={entity.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{entity.name}</CardTitle>
                  </div>
                  {latestRisk && getRiskBadge(latestRisk.rank)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getTypeLabel(entity.type)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">{entity.address}</span>
                </div>
                {entity.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{entity.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <div className="text-sm">
                    <span className="font-medium">{activePolicies?.length || 0}</span>
                    <span className="text-muted-foreground"> 有効契約</span>
                  </div>
                  {latestRisk && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <div className="text-sm">
                        <span className="font-medium">リスクスコア:</span>
                        <span className="text-muted-foreground"> {latestRisk.score.toFixed(1)}</span>
                      </div>
                    </>
                  )}
                </div>
                <Button variant="outline" className="w-full mt-2">
                  詳細を見る
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
