import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { ApolloClient, InMemoryCache, createHttpLink, gql } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://api.whop.com/public-graphql",
});

export async function GET() {
  const headersList = await headers();
  const token = headersList.get("x-whop-user-token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${process.env.WHOP_API_KEY}`,
        "x-whop-user-token": token,
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  const GET_USER_MEMBERSHIPS = gql`
    query GetUserMemberships {
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
    const { data } = await client.query({ query: GET_USER_MEMBERSHIPS });
    const companies = data.getUserMemberships.nodes.map((node: any) => node.company);
    return NextResponse.json({ companies });
  } catch (error) {
    console.error("Apollo Error:", error);
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}