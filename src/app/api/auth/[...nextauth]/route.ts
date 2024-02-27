import { handlers } from "@/auth";
import { NextRequest } from "next/server";

export const runtime = "edge";

const { GET: AuthGET, POST: AuthPOST } = handlers;

// Showcasing advanced initialization in Route Handlers
export async function GET(request: NextRequest) {
  // Do something with request
  const response = await AuthGET(request);
  // Do something with response
  return response;
}

export const POST = AuthPOST;
