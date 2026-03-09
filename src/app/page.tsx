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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16">
      <main className="flex w-full max-w-2xl flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Badge variant="secondary">Next.js + shadcn/ui</Badge>
          <h1 className="text-4xl font-bold tracking-tight">Task Tracker</h1>
          <p className="max-w-md text-lg text-muted-foreground">
            A modern task tracking application built with Next.js, TypeScript,
            Tailwind CSS, and shadcn/ui.
          </p>
        </div>

        <div className="flex gap-3">
          <Button>Get Started</Button>
          <Button variant="outline">Documentation</Button>
        </div>

        <Separator className="my-2" />

        <div className="grid w-full gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">TypeScript</CardTitle>
              <CardDescription>
                Strict mode enabled for type-safe development.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Tailwind CSS</CardTitle>
              <CardDescription>
                Utility-first styling with CSS variables for theming.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">shadcn/ui</CardTitle>
              <CardDescription>
                Accessible components you can copy and customize.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Ready to build</CardTitle>
            <CardDescription>
              This project is configured and ready for development. Start by
              editing{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
                src/app/page.tsx
              </code>
              .
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge>App Router</Badge>
            <Badge variant="outline">React Server Components</Badge>
            <Badge variant="outline">Turbopack</Badge>
            <Badge variant="outline">ESLint</Badge>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
