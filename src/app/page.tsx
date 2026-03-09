import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container flex flex-col items-center gap-8 px-4 py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Task Tracker
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          A modern task tracking application built with Next.js, Tailwind CSS,
          shadcn/ui, and Prisma.
        </p>
      </div>
      <Button size="lg">Get Started</Button>
    </div>
  );
}
