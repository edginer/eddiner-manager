import { auth } from "@/auth";

export const runtime = "edge";

export const GET = async (
  _request: Request,
  { params }: { params: { boardKey: string; threadId: string } }
) => {
  const boardId = 1;
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  try {
    const thread = await process.env.DB.prepare(
      "SELECT * FROM threads WHERE board_id = ? AND thread_number = ?"
    )
      .bind(boardId, params.threadId)
      .first();
    if (!thread) {
      return new Response(JSON.stringify({ error: "Thread not found" }), {
        status: 404,
      });
    }

    const { results: responses } = await process.env.DB.prepare(
      "SELECT * FROM responses WHERE board_id = ? AND thread_id = ?"
    )
      .bind(boardId, params.threadId)
      .all();

    return new Response(JSON.stringify({ thread, responses }));
  } catch (e) {
    return new Response(JSON.stringify({ error: JSON.stringify(e) }), {
      status: 500,
    });
  }
};
