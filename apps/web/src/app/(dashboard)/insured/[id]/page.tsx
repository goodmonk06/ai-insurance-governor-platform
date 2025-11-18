'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate, formatCurrency } from '@/lib/utils';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  FileText,
  TrendingUp,
} from 'lucide-react';

export default function InsuredDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [entity, setEntity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadEntity();
    }
  }, [params.id]);

  const loadEntity = async () => {
    try {
      const response = await api.get(`/insured/${params.id}`);
      setEntity(response.data);
    } catch (error) {
      console.error('Failed to load entity:', error);
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

  const getRiskBadge = (rank: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    };
    const labels: Record<string, string> = {
      low: '低リスク',
      medium: '中リスク',
      high: '高リスク',
      critical: '危険',
    };
    return (
      <span className={`rounded-full px-3 py-1 text-sm font-medium ${colors[rank]}`}>
        {labels[rank]}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      expired: 'bg-orange-100 text-orange-800',
    };
    const labels: Record<string, string> = {
      draft: '下書き',
      active: '有効',
      cancelled: '解約',
      expired: '期限切れ',
    };
    return (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${colors[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <p className="text-lg font-medium mb-4">被保険者が見つかりません</p>
        <Button onClick={() => router.back()}>戻る</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">{entity.name}</h1>
              <p className="text-muted-foreground">{getTypeLabel(entity.type)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {entity.taxId && (
              <div>
                <p className="text-sm font-medium">法人番号</p>
                <p className="text-sm text-muted-foreground">{entity.taxId}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                住所
              </p>
              <p className="text-sm text-muted-foreground">{entity.address}</p>
            </div>
            {entity.phoneNumber && (
              <div>
                <p className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  電話番号
                </p>
                <p className="text-sm text-muted-foreground">{entity.phoneNumber}</p>
              </div>
            )}
            {entity.email && (
              <div>
                <p className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  メールアドレス
                </p>
                <p className="text-sm text-muted-foreground">{entity.email}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                登録日
              </p>
              <p className="text-sm text-muted-foreground">{formatDate(entity.createdAt)}</p>
            </div>
          </CardContent>
        </Card>

        {entity.metadata && Object.keys(entity.metadata).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>詳細情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {entity.metadata.facilityType && (
                <div>
                  <p className="text-sm font-medium">施設タイプ</p>
                  <p className="text-sm text-muted-foreground">{entity.metadata.facilityType}</p>
                </div>
              )}
              {entity.metadata.bedCount && (
                <div>
                  <p className="text-sm font-medium">ベッド数</p>
                  <p className="text-sm text-muted-foreground">{entity.metadata.bedCount}床</p>
                </div>
              )}
              {entity.metadata.employeeCount && (
                <div>
                  <p className="text-sm font-medium">従業員数</p>
                  <p className="text-sm text-muted-foreground">{entity.metadata.employeeCount}名</p>
                </div>
              )}
              {entity.metadata.yearsInOperation !== undefined && (
                <div>
                  <p className="text-sm font-medium">運営年数</p>
                  <p className="text-sm text-muted-foreground">{entity.metadata.yearsInOperation}年</p>
                </div>
              )}
              {entity.metadata.annualRevenue && (
                <div>
                  <p className="text-sm font-medium">年間売上</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(entity.metadata.annualRevenue)}
                  </p>
                </div>
              )}
              <div className="pt-2 border-t space-y-2">
                <p className="text-sm font-medium">安全対策</p>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className={entity.metadata.hasFireSafety ? 'text-green-600' : 'text-gray-400'}>
                      {entity.metadata.hasFireSafety ? '✓' : '×'}
                    </span>
                    <span className="text-muted-foreground">消防設備</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={entity.metadata.hasEmergencyPlan ? 'text-green-600' : 'text-gray-400'}>
                      {entity.metadata.hasEmergencyPlan ? '✓' : '×'}
                    </span>
                    <span className="text-muted-foreground">緊急時対応マニュアル</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {entity.riskAssessments && entity.riskAssessments.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                リスク評価
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {entity.riskAssessments.slice(0, 3).map((assessment: any) => (
                <div key={assessment.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{assessment.scenarioType}</p>
                      <p className="text-sm text-muted-foreground">
                        評価日: {formatDate(assessment.assessedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      {getRiskBadge(assessment.rank)}
                      <p className="text-2xl font-bold mt-1">{assessment.score.toFixed(1)}</p>
                    </div>
                  </div>
                  {assessment.detailJson?.recommendations && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm font-medium mb-2">推奨事項:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {assessment.detailJson.recommendations.slice(0, 2).map((rec: string, idx: number) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {entity.policies && entity.policies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              保険契約
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {entity.policies.map((policy: any) => (
                <div key={policy.id} className="flex items-center justify-between border rounded-lg p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{policy.policyNumber}</p>
                      {getStatusBadge(policy.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{policy.productName}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(policy.startDate)} 〜 {formatDate(policy.endDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{formatCurrency(policy.premium)}</p>
                    <p className="text-sm text-muted-foreground">年間保険料</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
