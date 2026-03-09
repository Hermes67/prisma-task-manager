import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
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

export const metadata = { title: "New Task" };

export default async function NewTaskPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

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
        <CardHeader>
          <CardTitle>Create Task</CardTitle>
          <CardDescription>
            Add a new task to track your progress.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaskForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
