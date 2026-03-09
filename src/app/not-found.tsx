import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center gap-4 px-4 py-16 text-center">
      <h2 className="text-2xl font-bold">Not Found</h2>
      <p className="text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
      >
        Go home
      </Link>
    </div>
  );
}
