'use client';

import ConnectPage from './components/ConnectPage';

export default function SetupPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Setup Your Clipping Pages</h1>
      <ConnectPage />
    </div>
  );
}