import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="container flex flex-col items-center gap-8 px-4 py-16">
      <div className="flex flex-col items-center gap-3 text-center">
        <Badge variant="secondary">Next.js + shadcn/ui</Badge>
        <h1 className="text-4xl font-bold tracking-tight">Task Tracker</h1>
        <p className="max-w-md text-lg text-muted-foreground">
          A modern task tracking application built with Next.js, TypeScript,
          Tailwind CSS, and shadcn/ui.
        </p>
      </div>

      <div className="flex gap-3">
        <Button render={<Link href="/dashboard" />}>Get Started</Button>
        <Button variant="outline" render={<Link href="/register" />}>
          Create Account
        </Button>
      </div>

      <Separator className="my-2 max-w-2xl" />

      <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Authentication</CardTitle>
            <CardDescription>
              Secure login and registration with Auth.js.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Role-Based Access</CardTitle>
            <CardDescription>
              User roles with protected routes and middleware.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Database</CardTitle>
            <CardDescription>
              Prisma ORM with SQLite for data persistence.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Ready to build</CardTitle>
          <CardDescription>
            This project is configured with authentication, database, and
            protected routes.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge>App Router</Badge>
          <Badge variant="outline">Auth.js v5</Badge>
          <Badge variant="outline">Prisma</Badge>
          <Badge variant="outline">SQLite</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
