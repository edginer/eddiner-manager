// Next.js Edge API Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/router-handlers#edge-and-nodejs-runtimes

import { Database } from "@cloudflare/d1";
import type { R2Bucket } from "@cloudflare/workers-types";
import type { NextRequest } from "next/server";

export const runtime = "edge";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB: Database;
      ARCHIVE_BUCKET: R2Bucket;
    }
  }
}

type Request = NextRequest & { env: any };

export async function GET(request: Request) {
  try {
    const { results } = await process.env.DB.prepare(
      "SELECT * FROM archives LIMIT 10"
    ).all();
    return new Response(
      JSON.stringify({ name: "John Doe", results: JSON.stringify(results) })
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: JSON.stringify(e) }));
  }
}
