'use client';

import { useEffect, useState } from "react";

export default function MappingPage() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [message, setMessage] = useState("");

  const companies = [
    { id: "biz_4j1aKXjudxeCRt", name: "Ambro" },
    { id: "biz_abc123", name: "TJR" },
    { id: "biz_xyz456", name: "Khyzr" },
    { id: "biz_srp4l", name: "SRP Test Whop" },
  ];

  useEffect(() => {
    fetch("/api/connect")
      .then((res) => res.json())
      .then((data) => {
        const verified = data.accounts.filter((a: any) => a.verified);
        setAccounts(verified);
        if (verified.length > 0) setSelectedAccount(verified[0].id);
        if (companies.length > 0) setSelectedCompanyId(companies[0].id);
      });
  }, []);

  const handleSubmit = async () => {
    const res = await fetch("/api/mapping", {
      method: "POST",
      body: JSON.stringify({
        connected_account_id: selectedAccount,
        whop_company_id: selectedCompanyId,
      }),
    });

    const result = await res.json();
    if (res.ok) {
      setMessage("✅ Account mapped successfully!");
    } else {
      setMessage(`❌ ${result.error || "Something went wrong."}`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Map Verified Account to Creator</h2>

      <label className="block mb-2 text-sm font-semibold text-white">Select Verified Social Account</label>
      <select
        value={selectedAccount}
        onChange={(e) => setSelectedAccount(e.target.value)}
        className="w-full mb-4 p-2 rounded bg-black border border-white text-white"
      >
        {accounts.map((acc: any) => (
          <option key={acc.id} value={acc.id}>
            {acc.platform} — @{acc.username}
          </option>
        ))}
      </select>

      <label className="block mb-2 text-sm font-semibold text-white">Select Creator Whop</label>
      <select
        value={selectedCompanyId}
        onChange={(e) => setSelectedCompanyId(e.target.value)}
        className="w-full mb-2 p-2 rounded bg-black border border-white text-white"
      >
        {companies.map((comp) => (
          <option key={comp.id} value={comp.id}>
            {comp.name}
          </option>
        ))}
      </select>

      <p className="text-xs text-gray-400 mb-4">
        Can’t find the creator? DM @srp4l to request their Whop.
      </p>

      <button
        onClick={handleSubmit}
        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
      >
        Map Account
      </button>

      {message && <p className="mt-4 text-white">{message}</p>}
    </div>
  );
}