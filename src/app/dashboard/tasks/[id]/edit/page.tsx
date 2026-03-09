import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TaskForm } from "@/components/tasks/task-form";
import { ArrowLeftIcon } from "lucide-react";

export const metadata = { title: "Edit Task" };

export default async function EditTaskPage({
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
          render={<Link href={`/dashboard/tasks/${task.id}`} />}
        >
          <ArrowLeftIcon />
          Back to Task
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Task</CardTitle>
          <CardDescription>Update the details for this task.</CardDescription>
        </CardHeader>
        <CardContent>
          <TaskForm
            mode="edit"
            taskId={task.id}
            defaultValues={{
              title: task.title,
              description: task.description,
              status: task.status,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
