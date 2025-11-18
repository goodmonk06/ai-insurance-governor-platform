'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Building2, MapPin, Phone, Mail, Plus } from 'lucide-react';
import CreateInsuredDialog from './create-insured-dialog';
import Link from 'next/link';

export default function InsuredPage() {
  const [insuredEntities, setInsuredEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadInsuredEntities();
    }
  }, [user]);

  const loadInsuredEntities = async () => {
    try {
      const tenantId = user?.tenantId || 'tenant-1';
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
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">被保険者管理</h1>
          <p className="text-muted-foreground">施設・法人・個人の管理</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新規登録
        </Button>
      </div>

      {insuredEntities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">被保険者が登録されていません</p>
            <p className="text-sm text-muted-foreground mb-4">
              新規登録ボタンから被保険者を登録してください
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              新規登録
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {insuredEntities.map((entity) => {
            const latestRisk = entity.riskAssessments?.[0];
            const activePolicies = entity.policies?.filter((p: any) => p.status === 'active');

            return (
              <Link
                key={entity.id}
                href={`/insured/${entity.id}`}
                className="block transition-transform hover:scale-[1.02]"
              >
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Building2 className="h-5 w-5 text-primary flex-shrink-0" />
                        <CardTitle className="text-lg truncate">{entity.name}</CardTitle>
                      </div>
                      {latestRisk && getRiskBadge(latestRisk.rank)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getTypeLabel(entity.type)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground line-clamp-2">{entity.address}</span>
                    </div>
                    {entity.phoneNumber && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">{entity.phoneNumber}</span>
                      </div>
                    )}
                    {entity.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground truncate">{entity.email}</span>
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
                            <span className="font-medium">スコア:</span>
                            <span className="text-muted-foreground"> {latestRisk.score.toFixed(1)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <CreateInsuredDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={loadInsuredEntities}
      />
    </div>
  );
}
