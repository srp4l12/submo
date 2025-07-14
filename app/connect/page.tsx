"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ConnectPage() {
  const [platform, setPlatform] = useState("TikTok");
  const [username, setUsername] = useState("");
  const [profileLink, setProfileLink] = useState("");
  const [status, setStatus] = useState("");
  const [accounts, setAccounts] = useState<any[]>([]);
  const router = useRouter();

  const fetchAccounts = async () => {
    const res = await fetch("/api/connect");
    const data = await res.json();
    if (res.ok) {
      setAccounts(data.accounts ?? []);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus("Submitting...");

    const res = await fetch("/api/connect", {
      method: "POST",
      body: JSON.stringify({
        platform,
        username,
        profile_link: profileLink,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      setStatus(`❌ ${data.error}`);
    } else {
      setStatus("✅ Connected successfully!");
      setUsername("");
      setProfileLink("");
      fetchAccounts(); // refresh account list
    }
  };

  const handleVerify = async (acc: any) => {
    setStatus("Verifying bio...");

    const form = new FormData();
    form.append("platform", acc.platform);
    form.append("username", acc.username);
    form.append("code", acc.code);

    const res = await fetch("/api/verify", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    if (!res.ok) {
      setStatus(`❌ ${data.error}`);
    } else {
      setStatus("✅ Verified!");
      fetchAccounts(); // refresh status
    }
  };

  const verifiedAccounts = accounts.filter((acc) => acc.verified);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Connect Social Account</h1>

      <form onSubmit={handleSubmit} className="space-y-2">
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="TikTok">TikTok</option>
          <option value="Instagram">Instagram</option>
          <option value="YouTube">YouTube</option>
        </select>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          placeholder="Full profile link"
          value={profileLink}
          onChange={(e) => setProfileLink(e.target.value)}
          className="border p-2 w-full"
        />

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Connect
        </button>
      </form>

      <p className="text-sm">{status}</p>

      {accounts.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold mt-4">Connected Accounts:</h2>
          {accounts.map((acc: any) => (
            <div key={acc.id} className="border p-3 rounded bg-neutral-900">
              <p>
                <b>{acc.platform}</b> — @{acc.username}
              </p>
              <p>
                Verification code:{" "}
                <span className="font-mono bg-neutral-800 px-2 py-0.5 rounded">
                  {acc.code}
                </span>
              </p>
              <p>
                Status:{" "}
                {acc.verified ? (
                  <span className="text-green-500 font-semibold">✅ Verified</span>
                ) : (
                  <span className="text-yellow-400 font-semibold">
                    Not verified
                  </span>
                )}
              </p>
              {!acc.verified && (
                <button
                  onClick={() => handleVerify(acc)}
                  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Verify Bio
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {verifiedAccounts.length > 0 && (
        <button
          onClick={() => router.push("/mapping")}
          className="bg-green-600 text-white px-4 py-2 rounded mt-6"
        >
          Next Step: Map Your Account
        </button>
      )}
    </div>
  );
}