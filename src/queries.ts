/**
 * Example Prisma queries for the Task Manager application.
 * All database access is wrapped in service functions — never use prisma directly in route handlers.
 */

import { TaskStatus, Priority, ProjectStatus } from "../generated/prisma";
import { prisma } from "./db";

// ─── User Queries ──────────────────────────────────────────────────────────

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
    },
  });
}

export async function getUserWithProjects(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      ownedProjects: {
        select: { id: true, name: true, status: true, dueDate: true },
        where: { status: { not: ProjectStatus.ARCHIVED } },
      },
      memberships: {
        include: {
          project: { select: { id: true, name: true, status: true } },
        },
      },
    },
  });
}

// ─── Project Queries ───────────────────────────────────────────────────────

export async function getProjectWithTasks(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      members: {
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      },
      tasks: {
        where: { parentId: null }, // only top-level tasks
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
          assignee: { select: { id: true, name: true } },
          _count: { select: { subtasks: true, comments: true } },
        },
        orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
      },
    },
  });
}

export async function getProjectsByStatus(status: ProjectStatus) {
  return prisma.project.findMany({
    where: { status },
    select: {
      id: true,
      name: true,
      dueDate: true,
      owner: { select: { name: true } },
      _count: { select: { tasks: true, members: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ─── Task Queries ──────────────────────────────────────────────────────────

export async function getTaskById(taskId: string) {
  return prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: { select: { id: true, name: true } },
      creator: { select: { id: true, name: true } },
      assignee: { select: { id: true, name: true, avatarUrl: true } },
      subtasks: {
        select: { id: true, title: true, status: true, priority: true },
      },
      comments: {
        include: { author: { select: { id: true, name: true } } },
        orderBy: { createdAt: "asc" },
      },
      tags: { include: { tag: true } },
    },
  });
}

export async function getTasksByAssignee(
  assigneeId: string,
  status?: TaskStatus
) {
  return prisma.task.findMany({
    where: {
      assigneeId,
      ...(status ? { status } : { status: { not: TaskStatus.CANCELLED } }),
    },
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      dueDate: true,
      project: { select: { id: true, name: true } },
    },
    orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
  });
}

export async function getTasksPaginated(
  projectId: string,
  cursor?: string,
  take = 20
) {
  return prisma.task.findMany({
    where: { projectId },
    take,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      dueDate: true,
      assignee: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ─── Task Mutations ────────────────────────────────────────────────────────

export async function createTask(data: {
  title: string;
  description?: string;
  projectId: string;
  creatorId: string;
  assigneeId?: string;
  priority?: Priority;
  dueDate?: Date;
  parentId?: string;
}) {
  return prisma.task.create({
    data: {
      ...data,
      priority: data.priority ?? Priority.MEDIUM,
    },
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      createdAt: true,
    },
  });
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus
) {
  return prisma.task.update({
    where: { id: taskId },
    data: {
      status,
      completedAt:
        status === TaskStatus.DONE ? new Date() : null,
    },
    select: { id: true, status: true, completedAt: true },
  });
}

export async function bulkAssignTasks(
  taskIds: string[],
  assigneeId: string
) {
  return prisma.task.updateMany({
    where: { id: { in: taskIds } },
    data: { assigneeId },
  });
}

// ─── Transactional Operations ──────────────────────────────────────────────

/**
 * Move a task to a different project and remove its parent if it doesn't belong
 * to the target project. Done atomically.
 */
export async function moveTaskToProject(
  taskId: string,
  targetProjectId: string
) {
  return prisma.$transaction(async (tx) => {
    const task = await tx.task.findUniqueOrThrow({
      where: { id: taskId },
      select: { parentId: true, parent: { select: { projectId: true } } },
    });

    const parentBelongsToTarget =
      task.parent?.projectId === targetProjectId;

    return tx.task.update({
      where: { id: taskId },
      data: {
        projectId: targetProjectId,
        parentId: parentBelongsToTarget ? task.parentId : null,
      },
      select: { id: true, projectId: true, parentId: true },
    });
  });
}

/**
 * Archive a project and cancel all its open tasks.
 */
export async function archiveProject(projectId: string) {
  return prisma.$transaction([
    prisma.task.updateMany({
      where: {
        projectId,
        status: { notIn: [TaskStatus.DONE, TaskStatus.CANCELLED] },
      },
      data: { status: TaskStatus.CANCELLED },
    }),
    prisma.project.update({
      where: { id: projectId },
      data: { status: ProjectStatus.ARCHIVED },
    }),
  ]);
}

// ─── Aggregate / Stats ─────────────────────────────────────────────────────

export async function getProjectTaskStats(projectId: string) {
  const groups = await prisma.task.groupBy({
    by: ["status"],
    where: { projectId },
    _count: { id: true },
  });

  return groups.reduce<Record<string, number>>((acc, g) => {
    acc[g.status] = g._count.id;
    return acc;
  }, {});
}
