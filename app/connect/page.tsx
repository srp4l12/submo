"use client";

import { useState } from "react";

export default function ConnectPage() {
  const [platform, setPlatform] = useState("");
  const [username, setUsername] = useState("");
  const [profileLink, setProfileLink] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus("Submitting...");

    const res = await fetch("/api/connect", {
      method: "POST",
      body: JSON.stringify({ platform, username, profile_link: profileLink }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      setStatus(`❌ ${data.error}`);
    } else {
      setStatus("✅ Connected successfully!");
      setPlatform("");
      setUsername("");
      setProfileLink("");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Connect Social Account</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          placeholder="Platform (TikTok / IG / YT)"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="border p-2 w-full"
        />
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
      <p className="mt-2">{status}</p>
    </div>
  );
}