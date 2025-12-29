# PackPlanet

A modern, minimalistic web application for a packaging company featuring a product catalog, price list management, and a comprehensive admin dashboard.

## Overview

PackPlanet is a full-stack Next.js application designed to streamline packaging product management and customer interactions. The application provides a beautiful, responsive interface for browsing products, downloading price lists, and managing inventory through a secure admin panel.

Built with the latest web technologies including Next.js 16, React 19, and Tailwind CSS v4, PackPlanet demonstrates modern web development practices while maintaining simplicity and performance.

## Features

### Customer-Facing Features

- **Product Catalog** - Browse and search through a comprehensive catalog of packaging products
  - Advanced filtering by categories
  - Product search functionality
  - Detailed product pages with specifications
  - Image galleries for products
  - Wholesale pricing information
  - Related/linked products

- **Price List Downloads** - Easy access to current pricing information
  - Download up-to-date price lists from the homepage
  - Automatic price list versioning
  - File management through admin panel

- **Partner Showcase** - Display trusted partners and collaborators
  - Partner profiles with descriptions
  - Partner branding and imagery

### Admin Panel

Secure authentication system powered by Lucia Auth with session management:

- **Product Management**
  - Create, edit, and delete products
  - SKU-based inventory tracking
  - Product categorization
  - Image uploads and management
  - Wholesale pricing configuration
  - Product linking/relationships
  - Heat product flagging for featured items
  - Bulk operations support

- **Category Management**
  - Create and organize product categories
  - Category-based product organization
  - Easy category editing and deletion

- **Partner Management**
  - Add and manage business partners
  - Partner profile customization
  - Image management for partner logos

- **Price List Management**
  - Upload new price list files
  - Track price list versions and upload dates
  - Manage downloadable files

- **Dashboard Analytics**
  - Product statistics
  - Category distribution
  - Recent activity tracking

## Tech Stack

### Frontend

- **[Next.js 16.1.1](https://nextjs.org/)** - React framework with App Router
- **[React 19.2.3](https://react.dev/)** - UI library with latest features
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality component library (New York style)
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[TanStack Table](https://tanstack.com/table)** - Powerful table components
- **[Recharts](https://recharts.org/)** - Chart library for analytics

### Backend & Database

- **[Prisma 7](https://www.prisma.io/)** - Next-generation ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[Lucia Auth](https://lucia-auth.com/)** - Authentication library
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** - Password hashing
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

### Additional Libraries

- **[@dnd-kit](https://dndkit.com/)** - Drag and drop functionality
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[cmdk](https://cmdk.paco.me/)** - Command menu interface
- **[Embla Carousel](https://www.embla-carousel.com/)** - Carousel component

## Why This Project Is Valuable

### For Packaging Businesses

1. **Streamlined Operations** - Centralize product management, pricing, and customer information in one platform
2. **Professional Presence** - Modern, mobile-responsive website showcasing your products professionally
3. **Efficient Updates** - Quickly update prices, products, and catalogs without technical expertise
4. **Customer Self-Service** - Enable customers to browse products and download price lists 24/7
5. **Scalability** - Built on enterprise-grade technologies that grow with your business

### For Developers

1. **Modern Stack** - Demonstrates best practices with Next.js 16, React 19, and Tailwind CSS v4
2. **Type Safety** - Full TypeScript implementation with Prisma for end-to-end type safety
3. **Production Ready** - Includes Docker configuration, authentication, and database management
4. **Component Architecture** - Reusable components built with shadcn/ui
5. **Performance** - Optimized with Next.js App Router, React Server Components, and caching strategies

### For Learning

1. **Authentication Patterns** - Production-ready implementation of Lucia Auth
2. **File Upload Handling** - Best practices for managing uploaded files
3. **Admin Dashboards** - Complete example of CRUD operations and data management
4. **Database Design** - Well-structured Prisma schema with relationships and indexes
5. **Modern React** - Usage of React 19 features and patterns

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** 18.x or later
- **pnpm** 8.x or later (recommended package manager)
- **PostgreSQL** 14.x or later (or use Docker)
- **Git**

## How to Reproduce

### 1. Clone the Repository

```bash
git clone https://github.com/per4atku/packplanet.git
cd packplanet
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# PostgreSQL Database Configuration
POSTGRES_DB=packplanet
POSTGRES_USER=packplanet_user
POSTGRES_PASSWORD=your_secure_password_here

# Database URL for Prisma
# For local development, use localhost instead of postgres
DATABASE_URL=postgres://packplanet_user:your_secure_password_here@localhost:5432/packplanet

# Admin Panel Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_admin_password

# Node Environment
NODE_ENV=development
```

### 4. Database Setup

#### Option A: Using Docker (Recommended)

Start PostgreSQL using Docker Compose:

```bash
docker-compose up -d postgres
```

#### Option B: Local PostgreSQL

Create a PostgreSQL database manually:

```bash
createdb packplanet
```

### 5. Run Database Migrations

Generate Prisma Client and run migrations:

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

### 6. Seed Database (Optional)

If you have seed data:

```bash
pnpm prisma db seed
```

### 7. Start Development Server

```bash
pnpm dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

### 8. Create Admin User

On first run, you'll need to create an admin user. You can use the admin credentials from your `.env` file to log in at `/admin/login`.

## Project Structure

```
packplanet/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (main)/              # Main public routes
│   │   │   ├── page.tsx         # Homepage
│   │   │   └── products/        # Product catalog
│   │   ├── admin/               # Admin panel
│   │   │   ├── (auth)/          # Admin authentication
│   │   │   └── (protected)/     # Protected admin routes
│   │   │       ├── categories/  # Category management
│   │   │       ├── partners/    # Partner management
│   │   │       ├── products/    # Product management
│   │   │       └── price-list/  # Price list management
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   └── ui/                  # shadcn/ui components
│   ├── lib/
│   │   └── utils.ts             # Utility functions
│   └── generated/
│       └── prisma/              # Generated Prisma Client
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
├── public/                      # Static assets
├── docker-compose.yml           # Docker configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind configuration
└── components.json              # shadcn/ui configuration
```

## Database Schema

The application uses the following main models:

- **Product** - Core product information with SKU, pricing, categories, images
- **Category** - Product categorization
- **Partner** - Business partner information
- **PriceList** - Uploaded price list files with versioning
- **User** - Admin users with authentication
- **Session** - User session management (Lucia Auth)

See `prisma/schema.prisma` for the complete schema definition.

## Available Scripts

### Development

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Prisma

```bash
pnpm prisma generate         # Generate Prisma Client
pnpm prisma migrate dev      # Create and apply migrations
pnpm prisma migrate deploy   # Apply migrations (production)
pnpm prisma studio          # Open Prisma Studio
pnpm prisma db push         # Push schema without migrations
pnpm prisma db seed         # Seed database with data
```

### Adding shadcn/ui Components

```bash
pnpx shadcn@latest add <component-name>
```

## Deployment

### Docker Deployment

Build and run with Docker Compose:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Considerations

1. **Environment Variables** - Ensure all production environment variables are set
2. **Database Migrations** - Run `pnpm prisma migrate deploy` in production
3. **File Uploads** - Configure persistent volume mounts for uploaded files
4. **SSL/TLS** - Use a reverse proxy (nginx) for HTTPS
5. **Security** - Change default admin credentials immediately
6. **Backups** - Implement regular database backups

## File Upload Directories

The application uses mounted volumes for file uploads:

- `/app/uploads/partners/` - Partner images
- `/app/uploads/products/` - Product images
- `/app/uploads/pricelist/` - Price list files

These directories are created by the Dockerfile with appropriate permissions and mounted as a Docker volume.


---

Built with ❤️ using Next.js, React, and Tailwind CSS
