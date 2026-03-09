import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Returns the authenticated session or a 401 JSON response.
 * Usage: `const [session, errorResponse] = await getAuthSession();`
 */
export async function getAuthSession() {
  const session = await auth();

  if (!session?.user?.id) {
    return [
      null,
      NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 },
      ),
    ] as const;
  }

  return [session, null] as const;
}
