import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TaskStatusBadge } from "@/components/tasks/task-status-badge";
import { DeleteTaskDialog } from "@/components/tasks/delete-task-dialog";
import { ArrowLeftIcon, PencilIcon, Trash2Icon } from "lucide-react";

export const metadata = { title: "Task Details" };

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const task = await prisma.task.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!task) notFound();

  return (
    <div className="container max-w-2xl px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/dashboard/tasks" />}
        >
          <ArrowLeftIcon />
          Back to Tasks
        </Button>
      </div>

      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-2xl">{task.title}</CardTitle>
            <TaskStatusBadge status={task.status} />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              render={<Link href={`/dashboard/tasks/${task.id}/edit`} />}
            >
              <PencilIcon />
              Edit
            </Button>
            <DeleteTaskDialog taskId={task.id} taskTitle={task.title}>
              <Button variant="destructive" size="sm">
                <Trash2Icon />
                Delete
              </Button>
            </DeleteTaskDialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Description
            </p>
            <p className="text-sm whitespace-pre-wrap">
              {task.description || "No description provided."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm">
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground">Created</p>
              <p>{task.createdAt.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground">Updated</p>
              <p>{task.updatedAt.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
