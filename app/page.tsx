// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/debug');
        const data = await res.json();
        if (data?.userId) {
          setUserId(data.userId);
        }
      } catch (err) {
        console.error('Failed to fetch user ID:', err);
      }
    };

    fetchUser();
  }, []);

  const goToConnect = () => {
    router.push('/connect');
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome to Submo</h1>
      <p className="text-lg mb-8">Auto-submit your clips to Whop. Earn more, do less.</p>

      {userId ? (
        <button
          onClick={goToConnect}
          className="px-6 py-3 bg-white text-black rounded-xl text-lg hover:bg-gray-200 transition"
        >
          🚀 Connect Your Social Account
        </button>
      ) : (
        <p className="text-red-400">Authenticating...</p>
      )}
    </main>
  );
}