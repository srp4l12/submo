export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gradient-to-br from-blue-500 to-green-400 text-white">
      <h1 className="text-5xl font-bold mb-4">Welcome to Submo 🎬</h1>
      <p className="text-lg max-w-xl mb-8">
        Submo automates your clip submissions to Whop Creator Rewards. 
        Link your accounts, map them to clients, and we’ll handle the rest. 
        Sit back, upload, and earn.
      </p>
      <a
        href="/connect"
        className="bg-white text-blue-700 px-6 py-3 rounded shadow hover:bg-blue-100 transition"
      >
        Get Started →
      </a>
    </main>
  );
}