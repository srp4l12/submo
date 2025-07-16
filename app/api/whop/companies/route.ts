// app/api/whop/companies/route.ts
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { whopSdk } from "app/lib/whop-sdk";

export async function GET() {
  try {
    const headersList = await headers();

    // ✅ Extract and verify the user from the x-whop-user-token header
    const { userId } = await whopSdk.verifyUserToken(headersList);

    // ❗Here you should have a list of companies you want to check for user access.
    // For now, let’s hardcode a few company IDs you own or test with:
    const knownCompanyIds = [
      "biz_4j1aKXjudxeCRt", // Example Company 1
      "biz_abc1234567890", // Add more real ones here as needed
    ];

    const companiesWithAccess = [];

    for (const companyId of knownCompanyIds) {
      const result = await whopSdk.access.checkIfUserHasAccessToCompany({
        companyId,
        userId,
      });

      if (result.hasAccess) {
        companiesWithAccess.push({
          id: companyId,
          name: `${companyId} (${result.accessLevel})`, // optional - improve this later
        });
      }
    }

    return NextResponse.json({ companies: companiesWithAccess });
  } catch (err) {
    console.error("Whop Company Fetch Error:", err);
    return NextResponse.json({ error: "Unauthorized or failed" }, { status: 401 });
  }
}