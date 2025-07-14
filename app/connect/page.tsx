'use client';

import { useState, useEffect } from 'react';

type Platform = 'TikTok' | 'Instagram' | 'YouTube';
type ConnectedAccount = {
  id: string;
  platform: Platform;
  username: string;
  profile_link: string;
  code: string;
  verified: boolean;
};

export default function ConnectPage() {
  const [platform, setPlatform] = useState<Platform>('TikTok');
  const [username, setUsername] = useState('');
  const [profileLink, setProfileLink] = useState('');
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/connect')
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setAccounts(data.accounts || []);
      })
      .catch((err) => {
        console.error('Failed to fetch accounts:', err);
        setError('Failed to load accounts.');
      });
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, username, profile_link: profileLink }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || 'Unknown error');

      setAccounts(prev => [...prev, result.account]);
      setUsername('');
      setProfileLink('');
      setSuccess('✅ Account added!');
    } catch (err: any) {
      setError(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const verifiedAccounts = accounts.filter((acc) => acc.verified);

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Connect Your Social Media</h1>

      <div className="mb-4">
        <label>Platform</label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value as Platform)}
          className="w-full p-2 border"
        >
          <option value="TikTok">TikTok</option>
          <option value="Instagram">Instagram</option>
          <option value="YouTube">YouTube</option>
        </select>
      </div>

      <div className="mb-4">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border"
        />
      </div>

      <div className="mb-4">
        <label>Profile Link</label>
        <input
          type="text"
          value={profileLink}
          onChange={(e) => setProfileLink(e.target.value)}
          className="w-full p-2 border"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white px-4 py-2"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Your Connected Accounts</h2>
        {accounts.map((acc, i) => (
          <div key={i} className="p-3 border mb-2">
            <p><strong>Platform:</strong> {acc.platform}</p>
            <p><strong>Username:</strong> {acc.username}</p>
            <p><strong>Link:</strong> <a href={acc.profile_link} target="_blank" className="text-blue-600">{acc.profile_link}</a></p>
            <p><strong>Code:</strong> {acc.code}</p>
            <p><strong>Verified:</strong> {acc.verified ? '✅' : '❌'}</p>
            {!acc.verified && (
              <form method="POST" action="/api/verify" className="mt-2">
                <input type="hidden" name="code" value={acc.code} />
                <input type="hidden" name="platform" value={acc.platform} />
                <input type="hidden" name="profileLink" value={acc.profile_link} />
                <button type="submit" className="text-sm bg-blue-500 text-white px-2 py-1">Verify</button>
              </form>
            )}
          </div>
        ))}
      </div>

      {verifiedAccounts.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.href = '/mapping'}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Continue to Mapping
          </button>
        </div>
      )}
    </div>
  );
}