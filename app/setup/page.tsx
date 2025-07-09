'use client';

import { useEffect, useState } from 'react';

type SocialAccount = {
  id: string;
  platform: 'TikTok' | 'Instagram' | 'YouTube';
  name: string;
};

export default function SetupPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    { id: '1', platform: 'TikTok', name: 'Clipz.TikTok' },
    { id: '2', platform: 'Instagram', name: 'Clipz.Insta' },
    { id: '3', platform: 'YouTube', name: 'Clipz.YT' },
  ]);

  // 👇 This tests the WhopContext
  useEffect(() => {
    console.log('WhopContext:', (window as any).WhopContext);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Connected Pages</h1>
      <ul className="space-y-2">
        {accounts.map((account) => (
          <li
            key={account.id}
            className="border p-4 rounded bg-white shadow-sm"
          >
            <div className="font-medium">{account.name}</div>
            <div className="text-gray-500 text-sm">{account.platform}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
