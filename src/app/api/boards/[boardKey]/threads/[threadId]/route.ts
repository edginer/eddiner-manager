import {
  BbsRepository,
  BbsRepositoryImpl,
} from "@/app/api/_repositories/bbs_repository";
import { auth } from "@/auth";

export const runtime = "edge";

export const GET = async (
  _request: Request,
  { params }: { params: { boardKey: string; threadId: string } }
) => {
  const bbsRepo: BbsRepository = new BbsRepositoryImpl();
  const boardId = 1;
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  try {
    const thread = await bbsRepo.getThread(boardId, params.threadId);
    if (!thread) {
      return new Response(JSON.stringify({ error: "Thread not found" }), {
        status: 404,
      });
    }

    const responses = await bbsRepo.getResponses(
      boardId,
      params.threadId,
      thread.modulo
    );

    return new Response(JSON.stringify({ thread, responses }));
  } catch (e) {
    return new Response(JSON.stringify({ error: JSON.stringify(e) }), {
      status: 500,
    });
  }
};
