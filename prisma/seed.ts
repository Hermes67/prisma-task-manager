import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient, Role, ProjectStatus, TaskStatus, Priority } from "../generated/prisma";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  // ── Users ─────────────────────────────────────────────────────────────────
  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      email: "alice@example.com",
      name: "Alice Nguyen",
      role: Role.ADMIN,
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      email: "bob@example.com",
      name: "Bob Carter",
      role: Role.USER,
    },
  });

  const carol = await prisma.user.upsert({
    where: { email: "carol@example.com" },
    update: {},
    create: {
      email: "carol@example.com",
      name: "Carol Smith",
      role: Role.MODERATOR,
    },
  });

  // ── Tags ──────────────────────────────────────────────────────────────────
  const tagBug = await prisma.tag.upsert({
    where: { name: "bug" },
    update: {},
    create: { name: "bug", color: "#EF4444" },
  });

  const tagFeature = await prisma.tag.upsert({
    where: { name: "feature" },
    update: {},
    create: { name: "feature", color: "#3B82F6" },
  });

  const tagDocs = await prisma.tag.upsert({
    where: { name: "docs" },
    update: {},
    create: { name: "docs", color: "#10B981" },
  });

  // ── Project ───────────────────────────────────────────────────────────────
  const project = await prisma.project.upsert({
    where: { id: "seed-project-001" },
    update: {},
    create: {
      id: "seed-project-001",
      name: "Task Manager MVP",
      description: "Build the core task management features",
      status: ProjectStatus.ACTIVE,
      dueDate: new Date("2026-06-01"),
      ownerId: alice.id,
    },
  });

  // Add Bob and Carol as members
  await prisma.projectMember.upsert({
    where: { userId_projectId: { userId: bob.id, projectId: project.id } },
    update: {},
    create: { userId: bob.id, projectId: project.id, role: Role.USER },
  });

  await prisma.projectMember.upsert({
    where: { userId_projectId: { userId: carol.id, projectId: project.id } },
    update: {},
    create: { userId: carol.id, projectId: project.id, role: Role.MODERATOR },
  });

  // ── Tasks ─────────────────────────────────────────────────────────────────
  const task1 = await prisma.task.upsert({
    where: { id: "seed-task-001" },
    update: {},
    create: {
      id: "seed-task-001",
      title: "Set up Prisma schema",
      description: "Design models for User, Project, and Task with relations",
      status: TaskStatus.DONE,
      priority: Priority.HIGH,
      projectId: project.id,
      creatorId: alice.id,
      assigneeId: alice.id,
      completedAt: new Date(),
      tags: { create: [{ tagId: tagFeature.id }] },
    },
  });

  const task2 = await prisma.task.upsert({
    where: { id: "seed-task-002" },
    update: {},
    create: {
      id: "seed-task-002",
      title: "Implement task CRUD API",
      description: "REST endpoints for creating, reading, updating, and deleting tasks",
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      projectId: project.id,
      creatorId: alice.id,
      assigneeId: bob.id,
      dueDate: new Date("2026-04-01"),
      tags: { create: [{ tagId: tagFeature.id }] },
    },
  });

  // Subtask of task2
  await prisma.task.upsert({
    where: { id: "seed-task-003" },
    update: {},
    create: {
      id: "seed-task-003",
      title: "Write API documentation",
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      projectId: project.id,
      creatorId: alice.id,
      assigneeId: carol.id,
      parentId: task2.id,
      tags: { create: [{ tagId: tagDocs.id }] },
    },
  });

  await prisma.task.upsert({
    where: { id: "seed-task-004" },
    update: {},
    create: {
      id: "seed-task-004",
      title: "Fix pagination bug on task list",
      description: "Tasks beyond page 2 return incorrect results",
      status: TaskStatus.TODO,
      priority: Priority.URGENT,
      projectId: project.id,
      creatorId: bob.id,
      assigneeId: bob.id,
      dueDate: new Date("2026-03-20"),
      tags: { create: [{ tagId: tagBug.id }] },
    },
  });

  // ── Comments ──────────────────────────────────────────────────────────────
  await prisma.taskComment.upsert({
    where: { id: "seed-comment-001" },
    update: {},
    create: {
      id: "seed-comment-001",
      content: "Schema looks good! Reviewed and approved.",
      taskId: task1.id,
      authorId: carol.id,
    },
  });

  console.log("Seed completed:", {
    users: [alice.email, bob.email, carol.email],
    project: project.name,
    tasks: 4,
    tags: 3,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
