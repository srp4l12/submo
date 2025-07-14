"use client";

import { useEffect, useState } from "react";

export default function MappingPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [status, setStatus] = useState("");

  const fetchVerifiedAccounts = async () => {
    const res = await fetch("/api/connect");
    const data = await res.json();
    if (res.ok) {
      const verified = data.accounts.filter((acc: any) => acc.verified);
      setAccounts(verified);
    }
  };

  useEffect(() => {
    fetchVerifiedAccounts();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus("Submitting...");

    const res = await fetch("/api/mapping", {
      method: "POST",
      body: JSON.stringify({
        connected_account_id: selectedAccount,
        whop_company_id: companyId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      setStatus(`❌ ${data.error}`);
    } else {
      setStatus("✅ Mapping successful!");
      setSelectedAccount("");
      setCompanyId("");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Map Account to Whop Creator</h1>

      <form onSubmit={handleSubmit} className="space-y-2">
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Select Verified Account</option>
          {accounts.map((acc: any) => (
            <option key={acc.id} value={acc.id}>
              {acc.platform} — @{acc.username}
            </option>
          ))}
        </select>

        <input
          placeholder="Whop Company ID"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          className="border p-2 w-full"
        />

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Map Account
        </button>
      </form>

      <p className="text-sm">{status}</p>
    </div>
  );
}