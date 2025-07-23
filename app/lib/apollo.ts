'use client';

import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: "https://api.whop.com/public-graphql",
});

const authLink = setContext((_, { headers }) => {
  if (typeof document === "undefined") return { headers }; // SSR guard

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("whop_access_token="))
    ?.split("=")[1];

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const apollo = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});