'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (role: 'admin' | 'underwriter' | 'sales') => {
    const credentials: Record<string, { email: string; password: string }> = {
      admin: { email: 'admin@example.com', password: 'password123' },
      underwriter: { email: 'underwriter@example.com', password: 'password123' },
      sales: { email: 'sales@example.com', password: 'password123' },
    };

    const cred = credentials[role];
    setEmail(cred.email);
    setPassword(cred.password);

    setError('');
    setLoading(true);
    try {
      await login(cred.email, cred.password);
    } catch (err: any) {
      setError(err.message || 'ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">保険SaaS</CardTitle>
          <CardDescription>
            介護・医療系保険リスク管理プラットフォーム
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="••••••••"
                required
              />
            </div>
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'ログイン中...' : 'ログイン'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  デモアカウント
                </span>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin('admin')}
                disabled={loading}
              >
                管理者でログイン
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin('underwriter')}
                disabled={loading}
              >
                査定担当でログイン
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin('sales')}
                disabled={loading}
              >
                営業担当でログイン
              </Button>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              すべてのデモアカウントのパスワード: password123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
