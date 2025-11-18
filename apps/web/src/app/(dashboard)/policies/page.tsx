'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ScrollText, Calendar, AlertCircle } from 'lucide-react';

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      const tenantId = 'tenant-1';
      const response = await api.get(`/policies/tenant/${tenantId}`);
      setPolicies(response.data);
    } catch (error) {
      console.error('Failed to load policies:', error);
    } finally {
      setLoading(false);
    }
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

  const isExpiringSoon = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  };

  const filteredPolicies = policies.filter((policy) => {
    if (filter === 'all') return true;
    if (filter === 'expiring') return isExpiringSoon(policy.endDate);
    return policy.status === filter;
  });

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">契約管理</h1>
          <p className="text-muted-foreground">保険契約の一覧と管理</p>
        </div>
        <Button>新規契約</Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          すべて ({policies.length})
        </Button>
        <Button
          variant={filter === 'active' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('active')}
        >
          有効 ({policies.filter((p) => p.status === 'active').length})
        </Button>
        <Button
          variant={filter === 'expiring' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('expiring')}
        >
          更新期限間近 ({policies.filter((p) => isExpiringSoon(p.endDate)).length})
        </Button>
        <Button
          variant={filter === 'draft' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('draft')}
        >
          下書き ({policies.filter((p) => p.status === 'draft').length})
        </Button>
      </div>

      <div className="space-y-4">
        {filteredPolicies.map((policy) => (
          <Card key={policy.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ScrollText className="h-5 w-5 text-primary" />
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{policy.policyNumber}</CardTitle>
                      {getStatusBadge(policy.status)}
                      {policy.status === 'active' && isExpiringSoon(policy.endDate) && (
                        <span className="inline-flex items-center gap-1 text-orange-600 text-xs">
                          <AlertCircle className="h-3 w-3" />
                          更新期限間近
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {policy.insuredEntity?.name || '不明'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{formatCurrency(policy.premium)}</p>
                  <p className="text-sm text-muted-foreground">年間保険料</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 mb-4">
                <div>
                  <p className="text-sm font-medium">商品名</p>
                  <p className="text-sm text-muted-foreground">{policy.productName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    契約期間
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(policy.startDate)} 〜 {formatDate(policy.endDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">施設住所</p>
                  <p className="text-sm text-muted-foreground">
                    {policy.insuredEntity?.address || '-'}
                  </p>
                </div>
              </div>
              {policy.coverageJson && Object.keys(policy.coverageJson).length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">補償内容</p>
                  <div className="grid gap-2 md:grid-cols-2">
                    {Object.entries(policy.coverageJson).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="font-medium">{key}:</span>{' '}
                        <span className="text-muted-foreground">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm">
                  詳細
                </Button>
                {policy.status === 'draft' && (
                  <Button size="sm">有効化</Button>
                )}
                {policy.status === 'active' && (
                  <>
                    <Button variant="outline" size="sm">
                      更新
                    </Button>
                    <Button variant="destructive" size="sm">
                      解約
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
