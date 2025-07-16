'use client';

import { useEffect, useState } from "react";

export default function MappingPage() {
  const [accounts, setAccounts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [message, setMessage] = useState("");

  // Fetch verified connected accounts
  useEffect(() => {
    fetch("/api/connect")
      .then(res => res.json())
      .then(data => {
        const verified = data.accounts.filter((a: any) => a.verified);
        setAccounts(verified);
        if (verified.length > 0) {
          setSelectedAccount(verified[0].id);
        }
      });
  }, []);

  // Fetch companies from the Whop company route
  useEffect(() => {
    fetch("/api/whop/companies")
      .then(res => res.json())
      .then(data => {
        setCompanies(data.companies || []);
        if (data.companies?.length > 0) {
          setSelectedCompanyId(data.companies[0].id);
        }
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
      <h2 className="text-2xl font-bold mb-4">Map Verified Account to Whop Creator</h2>

      {/* Verified Social Accounts Dropdown */}
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

      {/* Whop Companies Dropdown */}
      <label className="block mb-2 text-sm font-semibold text-white">Select Creator Whop</label>
      <select
        value={selectedCompanyId}
        onChange={(e) => setSelectedCompanyId(e.target.value)}
        className="w-full mb-4 p-2 rounded bg-black border border-white text-white"
      >
        {companies.map((comp: any) => (
          <option key={comp.id} value={comp.id}>
            {comp.title}
          </option>
        ))}
      </select>

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