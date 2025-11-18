import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI保険ガバナンスプラットフォーム',
  description: '介護・医療系保険リスク管理SaaS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
