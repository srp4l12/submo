import { NextResponse } from "next/server";
import { ApolloClient, InMemoryCache, createHttpLink, gql } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://api.whop.com/graphql", // This is V5 GraphQL
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${process.env.WHOP_API_KEY!}`,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const GET_COMPANIES = gql`
  query {
    viewer {
      memberships {
        nodes {
          company {
            id
            title
          }
        }
      }
    }
  }
`;

export async function GET() {
  try {
    const { data } = await client.query({ query: GET_COMPANIES });

    const companies = data.viewer.memberships.nodes
      .filter((node: any) => node.company?.id && node.company?.title)
      .map((node: any) => ({
        id: node.company.id,
        name: node.company.title,
      }));

    return NextResponse.json({ companies });
  } catch (error) {
    console.error("Apollo Error:", error);
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}