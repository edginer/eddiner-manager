import { auth } from "@/auth";
import {
  BbsRepository,
  BbsRepositoryImpl,
} from "../_repositories/bbs_repository";

export const runtime = "edge";

export const GET = async () => {
  const bbsRepo: BbsRepository = new BbsRepositoryImpl();
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  const boards = await bbsRepo.getBoards();

  return new Response(JSON.stringify(boards));
};