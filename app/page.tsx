// app/page.tsx
import { headers } from "next/headers";
import { whopSdk } from "app/lib/whop-sdk"; // make sure this path is correct

export default async function Home() {
  const headersList = await headers();
  const { userId } = await whopSdk.verifyUserToken(headersList);

  if (!userId) {
    return (
      <div className="text-center text-red-500 mt-10">
        <h1>Welcome to Submo</h1>
        <p>Auto-submit your clips to Whop. Earn more, do less.</p>
        <p>Authenticating failed — no user token.</p>
      </div>
    );
  }

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold">Welcome to Submo</h1>
      <p className="text-lg mt-2 mb-4">
        Auto-submit your clips to Whop. Earn more, do less.
      </p>

      {/* Add button to go to /connect */}
      <a
        href="/connect"
        className="inline-block px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
      >
        Get Started
      </a>
    </div>
  );
}