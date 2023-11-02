import { auth } from "@/auth";

export const runtime = "edge";

export const GET = async (
  _request: Request,
  { params }: { params: { boardKey: string } }
) => {
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  try {
    const { results } = await process.env.DB.prepare(
      "SELECT * FROM threads WHERE board_id = ?"
    )
      .bind(params.boardKey)
      .all();
    return new Response(JSON.stringify(results));
  } catch (e) {
    return new Response(JSON.stringify({ error: JSON.stringify(e) }));
  }
};
