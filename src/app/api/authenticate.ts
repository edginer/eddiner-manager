import { auth } from "@/auth";

export interface Authentication {
  userId: string;
  userEmail: string;
  roleId: number;
  permissions: string[];
  ipAddr: string;
}

export const authenticate = async (req: Request): Promise<Authentication> => {
  const ipAddr = req.headers.get("cf-connecting-ip");
  if (!ipAddr) {
    throw new Response(JSON.stringify({ error: "Invalid ip address" }), {
      status: 400,
    });
  }
  const session = await auth();
  console.log(session);
  if (!session || !session.user || !session.user.email) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const { results: users } = await process.env.ADMIN_DB.prepare(
      "SELECT * FROM users"
    ).all();

    // SAFETY: ref admin-migrations/0000_d1-adapter.sql and use users.id and users.email
    const usersAny = users as unknown as any[];
    await initialize(usersAny);

    const targetUser = usersAny.find(
      (user) => user.email === session?.user?.email
    );
    if (!targetUser) {
      throw new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const userId = targetUser.id as string;
    const roleId = (await process.env.ADMIN_DB.prepare(
      "SELECT role_id FROM users_by_roles WHERE user_id = ?"
    )
      .bind(userId)
      .first()) as { role_id: number };
    const { results: permissionResult } = await process.env.ADMIN_DB.prepare(
      "SELECT permission_name FROM roles_by_permissions WHERE role_id = ?"
    )
      .bind(roleId.role_id)
      .all();
    const permissions = permissionResult as unknown as {
      permission_name: string;
    }[];

    return {
      userId,
      userEmail: session.user.email,
      roleId: roleId.role_id,
      permissions: permissions.map((permission) => permission.permission_name),
      ipAddr,
    };
  } catch {
    throw new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};

const initialize = async (users: any) => {
  if (users.length !== 1) {
    return false;
  }

  const usersByRolesCount = (await process.env.ADMIN_DB.prepare(
    "SELECT COUNT(*) FROM users_by_roles"
  ).first()) as { "COUNT(*)": number };
  if (usersByRolesCount["COUNT(*)"] !== 0) {
    return false;
  }

  // Add admin role to the first user
  await process.env.ADMIN_DB.prepare(
    "INSERT INTO users_by_roles (user_id, role_id) VALUES (?, 1)"
  )
    .bind(users[0].id)
    .run();

  return true;
};
