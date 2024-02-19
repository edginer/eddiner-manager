import { Permission } from "@/interfaces";
import { authenticate } from "./authenticate";

interface SuccessfulAuthorizeResponse {
  success: true;
  userId: string;
  userEmail: string;
  roleId: number;
  ipAddr: string;
}

interface FailedAuthorizeResponse {
  success: false;
  response: Response;
}

type AuthorizeResponse = SuccessfulAuthorizeResponse | FailedAuthorizeResponse;

// TODO: `caps:{list,show,edit-password}:me` permission support
export const authorize = async (
  req: Request,
  requiredPermissions?: Permission[]
): Promise<AuthorizeResponse> => {
  try {
    const authed = await authenticate(req);
    if (requiredPermissions && !authed.permissions.includes("all")) {
      let hasPermission = false;
      for (const requiredPerm of requiredPermissions) {
        const [reqTarget, reqAction] = requiredPerm.split(":");
        for (const permission of authed.permissions) {
          const [target, action] = permission.split(":");
          if (
            reqTarget === target &&
            (reqAction === action || action === "all")
          ) {
            hasPermission = true;
            break;
          }
        }
        if (hasPermission) {
          break;
        }
      }

      if (!hasPermission) {
        return {
          success: false,
          response: new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
          }),
        };
      }
    }

    return {
      success: true,
      userId: authed.userId,
      userEmail: authed.userEmail,
      roleId: authed.roleId,
      ipAddr: authed.ipAddr,
    };
  } catch (e) {
    return {
      success: false,
      response: e as Response,
    };
  }
};
