# Merge Strategy Plan

## Project Type
**Next.js 16** task manager app with:
- Prisma ORM + SQLite (better-sqlite3)
- NextAuth v5 (beta) for authentication
- React 19, TypeScript, Tailwind CSS v4, shadcn/ui
- Zod validation + react-hook-form

## Remote Configuration
- **origin**: `https://github.com/Hermes67/prisma-task-manager.git`
- **origin/main**: `dfd7d02` (initial commit — remote main is far behind local)

## Branch Overview

### Local branches (by tip commit):
| Branch | Commit | Status |
|--------|--------|--------|
| `main` | `074f4bf` | Most advanced local integration |
| `clawctl/...-build-management-pages` | `074f4bf` | Same as main (fully merged) |
| `clawctl/...-setup-authentication` | `0013f5d` | Ancestor of main |
| `clawctl/...-build-dashboard-layout` | `0013f5d` | Ancestor of main |
| `clawctl/...-build-api-routes` | `2ed1152` | Ancestor of main |
| `clawctl/...-design-database-schema` | `4e42a9d` | Ancestor of main |
| `clawctl/...-scaffold-nextjs-project` | `4e42a9d` | Ancestor of main |
| `clawctl/...-scaffold-project` | `24d499a` | Merged into merge-branches |
| `clawctl/...-project-setup` | `04fffb5` | Merged into merge-branches |
| **`clawctl/...-merge-branches`** | `5e285f3` | **Most complete — ahead of main** |

### Remote-only branches:
| Branch | Commit | Notes |
|--------|--------|-------|
| `origin/feat/prisma-schema` | `5d07a4e` | Older prisma schema work |
| `origin/feat/prisma-schema-new` | `93a7920` | Already merged into merge-branches |

## Recommended Merge Strategy

### Step 1: Merge `merge-branches` into `main`
The `clawctl/sess-1773072082705126000-merge-branches` branch (`5e285f3`) contains:
- All project-setup and scaffold work
- Richer Prisma schema (from `feat/prisma-schema-new`)
- Everything from `main` has NOT yet been merged into it

**Action:** Merge `main` → `merge-branches`, resolve any conflicts, then fast-forward `main` to `merge-branches` tip. Or merge `merge-branches` into `main`.

### Step 2: Push updated `main` to origin
Since `origin/main` is at the initial commit `dfd7d02`, a force-push or a regular push with `--allow-unrelated-histories` may be needed.

### Step 3: Clean up stale branches
All `clawctl/sess-1773068402669779000-*` branches are ancestors of `main` and can be safely deleted after the merge. Remote-only `feat/prisma-schema` and `feat/prisma-schema-new` can also be removed post-merge.

## Key Conflicts to Watch
- **Prisma schema**: `merge-branches` integrated `feat/prisma-schema-new` (richer schema); `main` has auth and API routes built on a potentially different schema version.
- **Authentication**: `main` has NextAuth setup; `merge-branches` may have diverged.
- **src/ structure**: Both branches have developed in `src/app`, `src/components`, `src/lib`.

## Priority Order
1. Compare `prisma/schema.prisma` between `main` and `merge-branches`
2. Merge `merge-branches` into `main` (keeping `main` as the integration branch)
3. Push `main` to `origin/main`
4. Open PR if remote review is needed
