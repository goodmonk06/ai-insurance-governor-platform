'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      const tenantId = 'tenant-1';
      const response = await api.get(`/quotes/tenant/${tenantId}`);
      setQuotes(response.data);
    } catch (error) {
      console.error('Failed to load quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string; icon: any }> = {
      pending: { label: '査定中', color: 'bg-blue-100 text-blue-800', icon: Clock },
      quoted: { label: '見積済', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      accepted: { label: '受諾', color: 'bg-purple-100 text-purple-800', icon: CheckCircle },
      rejected: { label: '却下', color: 'bg-red-100 text-red-800', icon: XCircle },
      expired: { label: '期限切れ', color: 'bg-gray-100 text-gray-800', icon: Clock },
    };
    const cfg = config[status] || config.pending;
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${cfg.color}`}>
        <Icon className="h-3 w-3" />
        {cfg.label}
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
          <h1 className="text-3xl font-bold">見積もり管理</h1>
          <p className="text-muted-foreground">見積もりリクエストと査定状況</p>
        </div>
        <Button>新規見積もり作成</Button>
      </div>

      <div className="space-y-4">
        {quotes.map((quote) => (
          <Card key={quote.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">
                      {quote.insuredEntity?.name || '不明'}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      申請日: {formatDate(quote.createdAt)}
                    </p>
                  </div>
                </div>
                {getStatusBadge(quote.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-medium">申請者</p>
                  <p className="text-sm text-muted-foreground">
                    {quote.requestedBy?.name || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">見積保険料</p>
                  <p className="text-sm text-muted-foreground">
                    {quote.quotedPremium ? formatCurrency(quote.quotedPremium) : '査定中'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">有効期限</p>
                  <p className="text-sm text-muted-foreground">
                    {quote.expiresAt ? formatDate(quote.expiresAt) : '-'}
                  </p>
                </div>
              </div>
              {quote.quotedCoverage && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium mb-2">補償内容</p>
                  <div className="grid gap-2 md:grid-cols-2">
                    {Object.entries(quote.quotedCoverage).map(([key, value]) => (
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
                {quote.status === 'pending' && (
                  <Button size="sm">査定する</Button>
                )}
                {quote.status === 'quoted' && (
                  <Button size="sm">契約に進む</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
