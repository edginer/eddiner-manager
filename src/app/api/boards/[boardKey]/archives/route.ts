import { auth } from "@/auth";

export const runtime = "edge";

export const GET = async (
  request: Request,
  { params }: { params: { boardKey: string } }
) => {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  const parsedPage = parseInt(page ?? "");

  const query = searchParams.get("query");

  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  try {
    if (query) {
      const { results } = await process.env.DB.prepare(
        "SELECT * FROM archives WHERE board_id = ? AND title LIKE ? LIMIT 25 OFFSET ?"
      )
        .bind(
          params.boardKey,
          `%${query}%`,
          isNaN(parsedPage) ? 0 : parsedPage * 25
        )
        .all();
      return new Response(JSON.stringify(results));
    } else {
      const { results } = await process.env.DB.prepare(
        "SELECT * FROM archives WHERE board_id = ? LIMIT 25 OFFSET ?"
      )
        .bind(params.boardKey, isNaN(parsedPage) ? 0 : parsedPage * 25)
        .all();
      return new Response(JSON.stringify(results));
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: JSON.stringify(e) }));
  }
};
