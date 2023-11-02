import { auth } from "@/auth";

export const runtime = "edge";

// Delete authed cookie by token (or all cookies with the same origin ip)
export const DELETE = async (
  request: Request,
  { params }: { params: { token: string } }
) => {
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const url = new URL(request.url);
  const useAssociatedOriginIp = url.searchParams.get("useOriginIp") === "true";

  try {
    if (useAssociatedOriginIp) {
      await process.env.DB.prepare(
        `DELETE FROM authed_cookies WHERE origin_ip 
        IN (SELECT origin_ip FROM authed_cookies WHERE cookie = ?)`
      )
        .bind(params.token)
        .run();
    } else {
      await process.env.DB.prepare(
        "DELETE FROM authed_cookies WHERE cookie = ?"
      )
        .bind(params.token)
        .run();
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: JSON.stringify(e) }), {
      status: 500,
    });
  }
};
