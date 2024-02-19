import { DbRes } from "@/interfaces";
import { addAuditLog } from "@/logger";
import { authorize } from "../../authorize";
import {
  BbsRepository,
  BbsRepositoryImpl,
} from "../../_repositories/bbs_repository";

export const runtime = "edge";

// Get single response by id
export const GET = async (
  request: Request,
  { params }: { params: { responseId: string } }
) => {
  return new Response(JSON.stringify({ error: "Not implemented" }));

  // const authed = await authorize(request, ["responses:show"]);
  // if (!authed.success) {
  //   return authed.response;
  // }

  // try {
  //   const response = await process.env.DB_RESPONSES.prepare(
  //     "SELECT * FROM responses WHERE id = ?"
  //   )
  //     .bind(params.responseId)
  //     .first();
  //   if (!response) {
  //     return new Response(JSON.stringify({ error: "Response not found" }), {
  //       status: 404,
  //     });
  //   }

  //   return new Response(JSON.stringify(response));
  // } catch (e) {
  //   return new Response(JSON.stringify({ error: JSON.stringify(e) }), {
  //     status: 500,
  //   });
  // }
};

// Update single response by id
export const PUT = async (
  request: Request,
  { params }: { params: { responseId: string } }
) => {
  return new Response(JSON.stringify({ error: "Not implemented" }));

  // const authed = await authorize(request, ["responses:edit"]);
  // if (!authed.success) {
  //   return authed.response;
  // }
  // const { userEmail, ipAddr } = authed;

  // try {
  //   const res: Res = await request.json();
  //   const { name, mail, body, is_abone } = res;

  //   const beforeRes = (await process.env.DB_RESPONSES.prepare(
  //     "SELECT * FROM responses WHERE id = ?"
  //   )
  //     .bind(params.responseId)
  //     .first()) as Res;
  //   let changedProp = {};
  //   if (beforeRes.name !== name) {
  //     changedProp = { ...changedProp, name: [beforeRes.name, name] };
  //   }
  //   if (beforeRes.mail !== mail) {
  //     changedProp = { ...changedProp, mail: [beforeRes.mail, mail] };
  //   }
  //   if (beforeRes.body !== body) {
  //     changedProp = { ...changedProp, body: [beforeRes.body, body] };
  //   }
  //   if (beforeRes.is_abone !== is_abone) {
  //     changedProp = {
  //       ...changedProp,
  //       is_abone: [beforeRes.is_abone, is_abone],
  //     };
  //   }

  //   await addAuditLog({
  //     user_email: userEmail,
  //     used_permission: "responses:edit",
  //     info: JSON.stringify({
  //       changedProperties: changedProp,
  //       responseId: params.responseId,
  //     }),
  //     ip_addr: ipAddr,
  //   });

  //   await process.env.DB_RESPONSES.prepare(
  //     `UPDATE responses SET name = ?, mail = ?, body = ?, is_abone = ? WHERE id = ?`
  //   )
  //     .bind(name, mail, body, is_abone, Number(params.responseId))
  //     .run();
  // } catch (e) {
  //   return new Response(JSON.stringify({ error: JSON.stringify(e) }), {
  //     status: 500,
  //   });
  // }

  // return new Response(JSON.stringify({ success: true }));
};

export const DELETE = async (
  request: Request,
  { params }: { params: { responseId: string } }
) => {
  return new Response(JSON.stringify({ error: "Not implemented" }));

  // const authed = await authorize(request, ["responses:delete"]);
  // if (!authed.success) {
  //   return authed.response;
  // }
  // const { userEmail, ipAddr } = authed;

  // try {
  //   const res = await process.env.DB_RESPONSES.prepare(
  //     "SELECT * FROM responses WHERE id = ?"
  //   )
  //     .bind(params.responseId)
  //     .first();
  //   if (!res) {
  //     return new Response(JSON.stringify({ error: "Response not found" }), {
  //       status: 404,
  //     });
  //   }

  //   await addAuditLog({
  //     user_email: userEmail,
  //     used_permission: "responses:delete",
  //     info: JSON.stringify({
  //       responseId: params.responseId,
  //     }),
  //     ip_addr: ipAddr,
  //   });

  //   await process.env.DB_RESPONSES.prepare(
  //     "UPDATE responses SET is_abone = 1 WHERE id = ?"
  //   )
  //     .bind(params.responseId)
  //     .run();
  // } catch (e) {
  //   return new Response(JSON.stringify({ error: JSON.stringify(e) }), {
  //     status: 500,
  //   });
  // }

  // return new Response(JSON.stringify({ success: true }));
};
