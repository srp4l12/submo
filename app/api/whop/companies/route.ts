import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  const headersList = await headers();
  const token = headersList.get("x-whop-user-token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  const query = `
    query {
      getUserMemberships {
        nodes {
          company {
            id
            title
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://api.whop.com/public-graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHOP_API_KEY}`,
        "Content-Type": "application/json",
        "x-whop-user-token": token,
      },
      body: JSON.stringify({ query }),
    });

    const json = await response.json();

    if (!json.data) {
      console.error("GraphQL error:", json.errors);
      return NextResponse.json({ error: "GraphQL query failed" }, { status: 500 });
    }

    const companies = json.data.getUserMemberships.nodes.map((node: any) => node.company);

    return NextResponse.json({ companies });
  } catch (error) {
    console.error("GraphQL Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}