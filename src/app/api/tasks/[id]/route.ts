import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth-guard";
import { updateTaskSchema } from "@/lib/validations/task";

type RouteContext = { params: Promise<{ id: string }> };

/** Get a single task by ID (must belong to the authenticated user). */
export async function GET(_request: NextRequest, context: RouteContext) {
  const [session, errorResponse] = await getAuthSession();
  if (errorResponse) return errorResponse;

  const { id } = await context.params;

  const task = await prisma.task.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!task) {
    return NextResponse.json(
      { error: "Task not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  return NextResponse.json(task);
}

/** Update a task by ID (must belong to the authenticated user). */
export async function PUT(request: NextRequest, context: RouteContext) {
  const [session, errorResponse] = await getAuthSession();
  if (errorResponse) return errorResponse;

  const { id } = await context.params;

  const existing = await prisma.task.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Task not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body", code: "INVALID_JSON" },
      { status: 400 },
    );
  }

  const result = updateTaskSchema.safeParse(body);
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

  const task = await prisma.task.update({
    where: { id },
    data: result.data,
  });

  return NextResponse.json(task);
}

/** Delete a task by ID (must belong to the authenticated user). */
export async function DELETE(_request: NextRequest, context: RouteContext) {
  const [session, errorResponse] = await getAuthSession();
  if (errorResponse) return errorResponse;

  const { id } = await context.params;

  const existing = await prisma.task.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Task not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  await prisma.task.delete({ where: { id } });

  return NextResponse.json({ success: true }, { status: 200 });
}
