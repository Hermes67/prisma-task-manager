# prisma-task-manager

A modern task tracking application built with Next.js, Tailwind CSS, shadcn/ui, and Prisma.

## Getting Started

First, install dependencies and generate the Prisma client:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database

This project uses Prisma with SQLite. To set up the database:

```bash
cp .env.example .env
npm run db:migrate
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
