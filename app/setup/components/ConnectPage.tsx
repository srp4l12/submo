'use client';

import { useState } from 'react';

export default function ConnectPage() {
  const [username, setUsername] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleVerify = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, platform }),
      });

      const data = await res.json();
      setResult(data.message || 'Verified!');
    } catch (err) {
      console.error('Verification error:', err);
      setResult('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Connect a Clipping Page</h2>

      <label className="block mb-2 font-medium">Platform</label>
      <select
        className="border px-3 py-2 mb-4 rounded w-full"
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
      >
        <option value="TikTok">TikTok</option>
        <option value="Instagram">Instagram</option>
        <option value="YouTube">YouTube</option>
      </select>

      <label className="block mb-2 font-medium">Username</label>
      <input
        type="text"
        className="border px-3 py-2 mb-4 rounded w-full"
        placeholder="@clipz.tiktok"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button
        onClick={handleVerify}
        disabled={loading || !username}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>

      {result && <p className="mt-4 text-center">{result}</p>}
    </div>
  );
}