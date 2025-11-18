'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InsuredEntityType } from '@insurance-platform/shared';

interface CreateInsuredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateInsuredDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateInsuredDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    type: InsuredEntityType.FACILITY,
    name: '',
    taxId: '',
    address: '',
    phoneNumber: '',
    email: '',
    facilityType: '',
    bedCount: '',
    employeeCount: '',
    yearsInOperation: '',
    annualRevenue: '',
    hasFireSafety: false,
    hasEmergencyPlan: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const metadata: Record<string, any> = {};

      if (formData.type === InsuredEntityType.FACILITY) {
        if (formData.facilityType) metadata.facilityType = formData.facilityType;
        if (formData.bedCount) metadata.bedCount = parseInt(formData.bedCount);
        if (formData.employeeCount) metadata.employeeCount = parseInt(formData.employeeCount);
        if (formData.yearsInOperation) metadata.yearsInOperation = parseInt(formData.yearsInOperation);
        if (formData.annualRevenue) metadata.annualRevenue = parseInt(formData.annualRevenue);
        metadata.hasFireSafety = formData.hasFireSafety;
        metadata.hasEmergencyPlan = formData.hasEmergencyPlan;
      }

      await api.post('/insured', {
        type: formData.type,
        name: formData.name,
        taxId: formData.taxId || undefined,
        address: formData.address,
        phoneNumber: formData.phoneNumber || undefined,
        email: formData.email || undefined,
        metadata,
      });

      onSuccess();
      onOpenChange(false);

      // Reset form
      setFormData({
        type: InsuredEntityType.FACILITY,
        name: '',
        taxId: '',
        address: '',
        phoneNumber: '',
        email: '',
        facilityType: '',
        bedCount: '',
        employeeCount: '',
        yearsInOperation: '',
        annualRevenue: '',
        hasFireSafety: false,
        hasEmergencyPlan: false,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || '登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>新規被保険者登録</DialogTitle>
          <DialogDescription>施設・法人・個人の情報を登録します</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">種別 *</Label>
            <Select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as InsuredEntityType })}
              required
            >
              <option value={InsuredEntityType.FACILITY}>施設</option>
              <option value={InsuredEntityType.CORPORATION}>法人</option>
              <option value={InsuredEntityType.INDIVIDUAL}>個人</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">名称 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxId">法人番号</Label>
            <Input
              id="taxId"
              value={formData.taxId}
              onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">住所 *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">電話番号</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {formData.type === InsuredEntityType.FACILITY && (
            <>
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">施設詳細情報</h4>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="facilityType">施設タイプ</Label>
                    <Select
                      id="facilityType"
                      value={formData.facilityType}
                      onChange={(e) => setFormData({ ...formData, facilityType: e.target.value })}
                    >
                      <option value="">選択してください</option>
                      <option value="nursing_home">介護ホーム</option>
                      <option value="day_service">デイサービス</option>
                      <option value="visiting_nurse">訪問看護</option>
                      <option value="hospital">病院</option>
                      <option value="clinic">クリニック</option>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bedCount">ベッド数</Label>
                      <Input
                        id="bedCount"
                        type="number"
                        value={formData.bedCount}
                        onChange={(e) => setFormData({ ...formData, bedCount: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employeeCount">従業員数</Label>
                      <Input
                        id="employeeCount"
                        type="number"
                        value={formData.employeeCount}
                        onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="yearsInOperation">運営年数</Label>
                      <Input
                        id="yearsInOperation"
                        type="number"
                        value={formData.yearsInOperation}
                        onChange={(e) => setFormData({ ...formData, yearsInOperation: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="annualRevenue">年間売上（円）</Label>
                      <Input
                        id="annualRevenue"
                        type="number"
                        value={formData.annualRevenue}
                        onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.hasFireSafety}
                        onChange={(e) => setFormData({ ...formData, hasFireSafety: e.target.checked })}
                        className="h-4 w-4"
                      />
                      消防設備あり
                    </Label>

                    <Label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.hasEmergencyPlan}
                        onChange={(e) => setFormData({ ...formData, hasEmergencyPlan: e.target.checked })}
                        className="h-4 w-4"
                      />
                      緊急時対応マニュアルあり
                    </Label>
                  </div>
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '登録中...' : '登録'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
