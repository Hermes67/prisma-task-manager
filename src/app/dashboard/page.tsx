import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, PlusIcon } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [totalCount, todoCount, inProgressCount, doneCount] = await Promise.all(
    [
      prisma.task.count({ where: { userId: session.user.id } }),
      prisma.task.count({
        where: { userId: session.user.id, status: "todo" },
      }),
      prisma.task.count({
        where: { userId: session.user.id, status: "in_progress" },
      }),
      prisma.task.count({
        where: { userId: session.user.id, status: "done" },
      }),
    ],
  );

  return (
    <div className="container max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user.name ?? session.user.email}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span>{session.user.name ?? "Not set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span>{session.user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role</span>
              <Badge variant="secondary">{session.user.role}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tasks</CardTitle>
            <CardDescription>Your task overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {totalCount === 0 ? (
              <p className="text-sm text-muted-foreground">
                No tasks yet. Start by creating your first task.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-md bg-muted p-2">
                  <p className="text-lg font-semibold">{todoCount}</p>
                  <p className="text-muted-foreground">To Do</p>
                </div>
                <div className="rounded-md bg-muted p-2">
                  <p className="text-lg font-semibold">{inProgressCount}</p>
                  <p className="text-muted-foreground">In Progress</p>
                </div>
                <div className="rounded-md bg-muted p-2">
                  <p className="text-lg font-semibold">{doneCount}</p>
                  <p className="text-muted-foreground">Done</p>
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/dashboard/tasks" />}
              >
                View Tasks
                <ArrowRightIcon />
              </Button>
              <Button size="sm" render={<Link href="/dashboard/tasks/new" />}>
                <PlusIcon />
                New Task
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
