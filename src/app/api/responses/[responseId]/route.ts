import { auth } from "@/auth";
import { Res } from "@/interfaces";

export const runtime = "edge";

// Get single response by id
export const GET = async (
  _request: Request,
  { params }: { params: { responseId: string } }
) => {
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  try {
    const response = await process.env.DB.prepare(
      "SELECT * FROM threads WHERE id = ?"
    )
      .bind(params.responseId)
      .first();
    if (!response) {
      return new Response(JSON.stringify({ error: "Response not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(response));
  } catch (e) {
    return new Response(JSON.stringify({ error: JSON.stringify(e) }), {
      status: 500,
    });
  }
};

// Update single response by id
export const PUT = async (
  request: Request,
  { params }: { params: { responseId: string } }
) => {
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  try {
    const { name, mail, date, author_id, body, is_abone }: Res =
      await request.json();
    await process.env.DB.prepare(
      `
        UPDATE responses SET name = ?, mail = ?, date = ?, author_id = ?, body = ?, is_abone = ? WHERE id = ?
    `
    )
      .bind(
        name,
        mail,
        date,
        author_id,
        body,
        is_abone,
        Number(params.responseId)
      )
      .run();
  } catch (e) {
    return new Response(JSON.stringify({ error: JSON.stringify(e) }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: true }));
};
