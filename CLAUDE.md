# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application built with React 19, TypeScript, and Tailwind CSS v4. The project uses the App Router architecture and includes shadcn/ui components for the UI layer, with Prisma as the database ORM.

## Commands

### Development

- `pnpm dev` - Start the Next.js development server (runs on http://localhost:3000)
- `pnpm build` - Build the production application
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint

### Prisma

The project uses Prisma 7 with a custom configuration file (`prisma.config.ts`). Generated client outputs to `src/generated/prisma/`.

To work with Prisma:

- `pnpm prisma generate` - Generate Prisma Client
- `pnpm prisma migrate dev` - Create and apply migrations in development
- `pnpm prisma migrate deploy` - Apply migrations in production
- `pnpm prisma studio` - Open Prisma Studio to view/edit data
- `pnpm prisma db push` - Push schema changes without migrations (development only)

Database connection is configured via `DATABASE_URL` environment variable in `.env`.

## Architecture

### Technology Stack

- **Framework**: Next.js 16.1.1 with App Router
- **React**: 19.2.3 (with new React JSX transform)
- **Styling**: Tailwind CSS v4 with CSS variables, using `@tailwindcss/postcss`
- **UI Components**: shadcn/ui (New York style) with lucide-react icons
- **Database**: PostgreSQL via Prisma ORM
- **Package Manager**: pnpm with workspace configuration
- **TypeScript**: 5.x with strict mode enabled

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with Geist fonts
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles and Tailwind directives
├── components/
│   └── ui/                # shadcn/ui components (Button, Card, Carousel, etc.)
├── lib/
│   └── utils.ts           # Utility functions (cn for className merging)
└── generated/
    └── prisma/            # Generated Prisma Client (gitignored)

prisma/
├── schema.prisma          # Database schema (custom output path configured)
└── migrations/            # Database migrations
```

### Key Configurations

**Path Aliases** (tsconfig.json):

- `@/*` maps to `./src/*`
- shadcn/ui uses additional aliases defined in `components.json`:
  - `@/components` - UI components
  - `@/lib` - Utility functions
  - `@/hooks` - React hooks (not yet created)
  - `@/ui` - Alias for `@/components/ui`

**Prisma Configuration**:

- Custom output path: `src/generated/prisma` (not the default `node_modules`)
- Schema location: `prisma/schema.prisma`
- Migrations path: `prisma/migrations`
- Configuration file: `prisma.config.ts` (uses Prisma 7 config format)

**shadcn/ui Configuration** (components.json):

- Style: "new-york"
- RSC enabled (React Server Components)
- Base color: neutral
- CSS variables enabled
- Icon library: lucide-react
- Components install to: `src/components/ui/`

### Styling System

- Tailwind CSS v4 with PostCSS integration
- CSS variables for theming (defined in `globals.css`)
- `cn()` utility function combines clsx and tailwind-merge for className handling
- Dark mode support configured via CSS variables
- Geist Sans and Geist Mono fonts loaded via next/font

### Database Integration

- Prisma Client is generated to `src/generated/prisma/` (non-standard location)
- Import Prisma Client: `import { PrismaClient } from '@/generated/prisma'`
- Database provider: PostgreSQL
- Connection string from `process.env.DATABASE_URL`

## Development Patterns

### Adding shadcn/ui Components

Use the shadcn CLI to add new components:

```bash
pnpx shadcn@latest add <component-name>
```

This automatically:

- Downloads the component to `src/components/ui/`
- Installs required dependencies
- Respects the project's configuration (New York style, path aliases)

### Working with Prisma

1. Edit `prisma/schema.prisma` to define models
2. Run `pnpm prisma migrate dev --name <migration-name>` to create migration
3. Prisma Client auto-generates to `src/generated/prisma/`
4. Import and use: `import { PrismaClient } from '@/generated/prisma'`

### Environment Variables

Required environment variables should be documented but the actual `.env` file is gitignored. The project uses `dotenv` loaded via `prisma.config.ts`.
