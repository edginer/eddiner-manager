import { auth } from "@/auth";

export const runtime = "edge";

export const GET = async () => {
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  const { results } = await process.env.DB.prepare(
    "SELECT * FROM boards"
  ).all();

  return new Response(JSON.stringify(results));
};
