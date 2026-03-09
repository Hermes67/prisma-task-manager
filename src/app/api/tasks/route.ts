import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth-guard";
import { createTaskSchema } from "@/lib/validations/task";

/** List all tasks for the authenticated user. */
export async function GET(request: NextRequest) {
  const [session, errorResponse] = await getAuthSession();
  if (errorResponse) return errorResponse;

  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");

  const where: { userId: string; status?: string } = {
    userId: session.user.id,
  };
  if (status) {
    where.status = status;
  }

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tasks);
}

/** Create a new task for the authenticated user. */
export async function POST(request: NextRequest) {
  const [session, errorResponse] = await getAuthSession();
  if (errorResponse) return errorResponse;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body", code: "INVALID_JSON" },
      { status: 400 },
    );
  }

  const result = createTaskSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: result.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const task = await prisma.task.create({
    data: {
      ...result.data,
      userId: session.user.id,
    },
  });

  return NextResponse.json(task, { status: 201 });
}
