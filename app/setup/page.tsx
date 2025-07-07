'use client';

import { useState } from 'react';

type SocialAccount = {
  id: string;
  platform: "TikTok" | "Instagram" | "YouTube";
  name: string;
};

export default function SetupPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);

  // Simulated fetch logic (you’ll replace this later)
  const handleAddDummy = () => {
    setAccounts([
      { id: "1", platform: "TikTok", name: "srptok" },
      { id: "2", platform: "Instagram", name: "srpgram" }
    ]);
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl mb-4">Setup Social Pages</h1>
      <button onClick={handleAddDummy} className="bg-blue-500 px-4 py-2 rounded">Load Dummy Accounts</button>
      <ul className="mt-4 space-y-2">
        {accounts.map(account => (
          <li key={account.id} className="bg-gray-800 p-2 rounded">
            {account.name} — {account.platform}
          </li>
        ))}
      </ul>
    </div>
  );
}
