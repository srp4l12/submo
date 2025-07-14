'use client';

import { useEffect, useState } from "react";
import Input from "app/components/ui/input";
import Button from "app/components/ui/button";
import { Label } from "app/components/ui/label";

export default function MappingPage() {
  const [accounts, setAccounts] = useState<{ id: string; platform: string; username: string }[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [whopCompanyId, setWhopCompanyId] = useState<string>("");

  useEffect(() => {
    const fetchAccounts = async () => {
      const res = await fetch("/api/connect"); // ✅ Fixed route
      const data = await res.json();
      setAccounts(data.accounts);
    };

    fetchAccounts();
  }, []);

  const handleSubmit = async () => {
    if (!selectedAccount || !whopCompanyId) {
      alert("Please select an account and enter a Whop Company ID");
      return;
    }

    const res = await fetch("/api/mapping", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        connected_account_id: selectedAccount, // ✅ Fixed key name to match backend
        whop_company_id: whopCompanyId,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Mapping saved!");
      setSelectedAccount("");
      setWhopCompanyId("");
    } else {
      alert(`Failed to save mapping: ${data.error || "Unknown error"}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-sm">
      <h1 className="text-xl font-semibold mb-4">Map Your Account to a Whop Company</h1>

      <Label className="block mb-2">Select Social Media Account</Label>
      <select
        className="w-full p-2 border rounded mb-4"
        value={selectedAccount}
        onChange={(e) => setSelectedAccount(e.target.value)}
      >
        <option value="">-- Select an Account --</option>
        {accounts.map((acc) => (
          <option key={acc.id} value={acc.id}>
            [{acc.platform}] @{acc.username}
          </option>
        ))}
      </select>

      <Label className="block mb-2">Whop Company ID</Label>
      <Input
        value={whopCompanyId}
        onChange={(e) => setWhopCompanyId(e.target.value)}
        placeholder="e.g. biz_xxxxxxxxxxx"
      />

      <div className="mt-4">
        <Button onClick={handleSubmit}>Save Mapping</Button>
      </div>
    </div>
  );
}