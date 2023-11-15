import { auth } from "@/auth";
import { Res } from "@/interfaces";

export const runtime = "edge";

const convertAdminDatFileToAdminRes = (
  boardId: number,
  threadId: number,
  adminDatFile: string
): Res[] => {
  return (
    adminDatFile
      .split("\n")
      .map((line, idx) => {
        const split = line.split("<>");
        if (split.length < 6) {
          return null;
        }

        const [name, mail, dateAndauthorId, ipAddr, authedToken, body] = split;
        const dateAndauthorIdSplit = dateAndauthorId.split(" ID:");
        const res: Res = {
          name,
          mail,
          date: dateAndauthorIdSplit[0],
          author_id: dateAndauthorIdSplit[1],
          ip_addr: ipAddr,
          authed_token: authedToken,
          body,
          timestamp: 0,
          thread_id: threadId.toString(),
          is_abone: 0,
          board_id: boardId,
          id: idx,
        };
        return res;
      })
      // SAFETY: null is filtered out
      .filter((res) => res != null) as Res[]
  );
};

export const GET = async (
  request: Request,
  { params }: { params: { boardKey: string; threadId: string } }
) => {
  const { searchParams } = new URL(request.url);
  const headParam = searchParams.get("head");
  const head = headParam === "true";

  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  try {
    let boardId = 1;
    if (params.boardKey === "liveedge") {
      boardId = 1;
    }
    const thread = await process.env.DB.prepare(
      "SELECT * FROM archives WHERE board_id = ? AND thread_number = ?"
    )
      .bind(boardId, params.threadId)
      .first();
    if (head) {
      return new Response(JSON.stringify({ thread }));
    }

    if (!thread) {
      return new Response(
        JSON.stringify({ error: "Specified thread is not found in archives" }),
        {
          status: 404,
        }
      );
    }

    const adminDatFile = await process.env.ARCHIVE_BUCKET.get(
      `${params.boardKey}/admin/${params.threadId}.dat`
    );
    if (adminDatFile == null) {
      return new Response(
        JSON.stringify({
          error: `Admin dat file is not found: ${params.boardKey}/admin/${params.threadId}.dat`,
        }),
        {
          status: 404,
        }
      );
    }
    const adminDat = await adminDatFile.text();
    const adminDatLines = adminDat.split("\n");
    const archiveResponses = adminDatLines
      .map((line, idx) => {
        const split = line.split("<>");
        if (split.length < 6) {
          return null;
        }

        const [name, mail, dateAndauthorId, ipAddr, authedToken, body] = split;
        const dateAndauthorIdSplit = dateAndauthorId.split(" ID:");
        const res: Res = {
          name,
          mail,
          date: dateAndauthorIdSplit[0],
          author_id: dateAndauthorIdSplit[1],
          ip_addr: ipAddr,
          authed_token: authedToken,
          body,
          timestamp: 0,
          thread_id: params.threadId,
          is_abone: 0,
          board_id: boardId,
          id: idx,
        };
        return res;
      })
      .filter((res) => res !== null);

    return new Response(
      JSON.stringify({ thread, responses: archiveResponses })
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: JSON.stringify(e) }));
  }
};

interface ResOfArchivedThreadUpdating {
  res_number: number;
  name?: string;
  mail?: string;
  body?: string;
  to_abone: boolean;
}

export const PUT = async (
  request: Request,
  { params }: { params: { boardKey: string; threadId: string } }
) => {
  const boardId = 1;
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { responses } = await request.json();
  if (!responses) {
    return new Response(JSON.stringify({ error: "Request body is empty" }), {
      status: 400,
    });
  }

  const updateRequest: ResOfArchivedThreadUpdating = responses;

  const thread = await process.env.DB.prepare(
    "SELECT * FROM archives WHERE board_id = ? AND thread_number = ?"
  )
    .bind(boardId, params.threadId)
    .first();
  if (!thread) {
    return new Response(
      JSON.stringify({ error: "Specified thread is not found in archives" }),
      {
        status: 404,
      }
    );
  }

  const adminDatFile = await process.env.ARCHIVE_BUCKET.get(
    `${params.boardKey}/admin/${params.threadId}.dat`
  );
  if (adminDatFile == null) {
    return new Response(
      JSON.stringify({
        error: `Admin dat file is not found: ${params.boardKey}/admin/${params.threadId}.dat`,
      }),
      {
        status: 404,
      }
    );
  }

  const datFile = await process.env.ARCHIVE_BUCKET.get(
    `${params.boardKey}/admin/${params.threadId}.dat`
  );
  if (datFile == null) {
    return new Response(
      JSON.stringify({
        error: `Admin dat file is not found: ${params.boardKey}/admin/${params.threadId}.dat`,
      }),
      {
        status: 404,
      }
    );
  }
};
