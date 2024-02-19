import { auth } from "@/auth";
import {
  BbsRepository,
  BbsRepositoryImpl,
} from "../../_repositories/bbs_repository";

export const runtime = "edge";

// Delete authed cookie by token (or all cookies with the same origin ip)
export const DELETE = async (
  request: Request,
  { params }: { params: { token: string } }
) => {
  const bbsRepo: BbsRepository = new BbsRepositoryImpl();
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const url = new URL(request.url);
  const useAssociatedOriginIp = url.searchParams.get("useOriginIp") === "true";

  try {
    await bbsRepo.deleteAuthedToken(params.token, useAssociatedOriginIp);

    return new Response(JSON.stringify({ success: true }));
  } catch (e) {
    return new Response(JSON.stringify({ error: JSON.stringify(e) }), {
      status: 500,
    });
  }
};
