// Prisma 7 configuration file
// Uses env() helper from prisma/config to load environment variables
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Use env() helper for proper Prisma 7 environment variable loading
    url: env("DATABASE_URL"),
  },
});
