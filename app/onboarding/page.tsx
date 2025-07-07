'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const platforms = ['tiktok', 'instagram', 'youtube']

export default function OnboardingWizard() {
  const [step, setStep] = useState(1)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [accounts, setAccounts] = useState<Record<string, { handle: string, creator: string, whopUserId: string }[]>>({})

  const togglePlatform = (platform: string) => {
	 setSelectedPlatforms((prev) =>
		prev.includes(platform)
		  ? prev.filter((p) => p !== platform)
		  : [...prev, platform]
	 )
  }

  const addAccount = (platform: string) => {
	 setAccounts((prev) => ({
		...prev,
		[platform]: [...(prev[platform] || []), { handle: '', creator: '', whopUserId: '' }],
	 }))
  }

  const updateAccount = (platform: string, index: number, field: string, value: string) => {
	 const updated = [...(accounts[platform] || [])]
	 updated[index] = { ...updated[index], [field]: value }
	 setAccounts({ ...accounts, [platform]: updated })
  }

  const submit = async () => {
	 const payload = Object.entries(accounts).flatMap(([platform, accs]) =>
		accs.map(({ handle, creator, whopUserId }) => ({
		  platform,
		  handle,
		  creatorName: creator,
		  whopUserId,
		}))
	 )

	 const res = await fetch('/api/clipping-mapping', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ accounts: payload }),
	 })

	 if (res.ok) {
		toast.success('Mapping saved!')
		setStep(4)
	 } else {
		toast.error('Something went wrong')
	 }
  }

  return (
	 <div className="max-w-xl mx-auto py-12 space-y-8">
		{step === 1 && (
		  <div>
			 <h2 className="text-xl font-semibold mb-4">What platforms do you clip on?</h2>
			 <div className="space-y-2">
				{platforms.map((p) => (
				  <label key={p} className="flex items-center space-x-2">
					 <input
						type="checkbox"
						checked={selectedPlatforms.includes(p)}
						onChange={() => togglePlatform(p)}
					 />
					 <span className="capitalize">{p}</span>
				  </label>
				))}
			 </div>
			 <Button className="mt-4" onClick={() => setStep(2)}>
				Next
			 </Button>
		  </div>
		)}

		{step === 2 && (
		  <div className="space-y-6">
			 <h2 className="text-xl font-semibold">Enter your clipping pages</h2>
			 {selectedPlatforms.map((platform) => (
				<div key={platform} className="border p-4 rounded-xl space-y-2">
				  <h3 className="font-medium capitalize">{platform}</h3>
				  {(accounts[platform] || []).map((acc, i) => (
					 <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2">
						<Input
						  placeholder="@handle"
						  value={acc.handle}
						  onChange={(e) => updateAccount(platform, i, 'handle', e.target.value)}
						/>
						<Input
						  placeholder="Creator Name"
						  value={acc.creator}
						  onChange={(e) => updateAccount(platform, i, 'creator', e.target.value)}
						/>
						<Input
						  placeholder="Whop User ID"
						  value={acc.whopUserId}
						  onChange={(e) => updateAccount(platform, i, 'whopUserId', e.target.value)}
						/>
					 </div>
				  ))}
				  <Button variant="secondary" onClick={() => addAccount(platform)}>
					 + Add another {platform} page
				  </Button>
				</div>
			 ))}
			 <Button onClick={submit}>Submit Mapping</Button>
		  </div>
		)}

		{step === 4 && <h2 className="text-2xl font-bold text-center">🎉 You're all set!</h2>}
	 </div>
  )
}