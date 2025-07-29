import { WhopServerSdk, makeUserTokenVerifier } from "@whop/api";
import { cookies } from "next/headers";

export const whopSdk = WhopServerSdk({
  appId: process.env.NEXT_PUBLIC_WHOP_APP_ID!,
  appApiKey: process.env.WHOP_API_KEY!,
  onBehalfOfUserId: process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID!,
  companyId: process.env.NEXT_PUBLIC_WHOP_COMPANY_ID!,
});