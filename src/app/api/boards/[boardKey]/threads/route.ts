import {
  BbsRepository,
  BbsRepositoryImpl,
} from "@/app/api/_repositories/bbs_repository";
import { auth } from "@/auth";

export const runtime = "edge";

export const GET = async (
  _request: Request,
  { params }: { params: { boardKey: string } }
) => {
  const bbsRepo: BbsRepository = new BbsRepositoryImpl();
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  try {
    const results = await bbsRepo.getThreads(parseInt(params.boardKey));

    return new Response(JSON.stringify(results));
  } catch (e) {
    return new Response(JSON.stringify({ error: JSON.stringify(e) }));
  }
};
