"use client";

import { useState } from "react";

export default function MappingPage() {
  const [accountId, setAccountId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus("Submitting...");

    const res = await fetch("/api/mapping", {
      method: "POST",
      body: JSON.stringify({
        connected_account_id: accountId,
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
      setAccountId("");
      setCompanyId("");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Map Connected Account to Whop Company</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          placeholder="Connected Account ID"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="border p-2 w-full"
        />
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
      <p className="mt-2">{status}</p>
    </div>
  );
}