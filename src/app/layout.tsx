import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { UserButton } from "@/components/auth/user-button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Task Tracker",
    template: "%s | Task Tracker",
  },
  description:
    "A modern task tracking application built with Next.js and shadcn/ui",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                  <Link href="/" className="text-lg font-semibold">
                    Task Tracker
                  </Link>
                  <nav className="flex items-center gap-4 text-sm">
                    <Link
                      href="/dashboard"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/tasks"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Tasks
                    </Link>
                  </nav>
                </div>
                <UserButton />
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
