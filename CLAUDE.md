# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack web application for El Shaddai FM radio station, built with a Node.js backend and Next.js frontend. The project includes features for articles, live chat, prayer requests, song requests, testimonials, and program scheduling.

## Architecture

- **Backend (`be/`)**: Node.js/Express API with TypeScript, Prisma ORM, and MySQL database
- **Frontend (`fe/`)**: Next.js 15 with React 19, TypeScript, and Tailwind CSS
- **Database**: MySQL with Prisma migrations
- **Real-time**: WebSocket support for live chat features
- **Caching**: Redis for session management and real-time features

## Common Commands

### Backend Development
```bash
# From be/ directory
npm run dev          # Start development server with auto-reload
npm run build        # Compile TypeScript to JavaScript
npm start           # Run production server
npm test            # Run Jest tests
npm run seed        # Seed database with initial data
```

### Frontend Development
```bash
# From fe/ directory
npm run dev         # Start Next.js development server with Turbopack
npm run build       # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

### Database Operations
```bash
# From be/ directory
npx prisma migrate dev       # Run migrations in development
npx prisma migrate deploy    # Run migrations in production
npx prisma generate         # Generate Prisma client
npx prisma db seed         # Run database seeding
```

## Key Architecture Patterns

### Backend Structure
- **Controllers** (`be/src/controllers/`): Handle HTTP requests and responses
- **Services** (`be/src/services/`): Business logic and data processing
- **Routes** (`be/src/routes/`): API endpoint definitions
- **Middlewares** (`be/src/middlewares/`): Authentication, validation, rate limiting
- **Validators** (`be/src/validators/`): Input validation using Zod schemas

### Frontend Structure
- **App Router** (`fe/src/app/`): Next.js 13+ app directory structure
- **Components** (`fe/src/components/`): Reusable React components organized by type
- **Hooks** (`fe/src/hooks/`): Custom React hooks for API calls
- **Stores** (`fe/src/stores/`): Zustand state management
- **API Client** (`fe/src/lib/api/`): Centralized API communication with React Query

### Database Schema
Key models include:
- **User**: Admin authentication
- **Article**: Content management with slug-based routing
- **Program/Schedule**: Radio program scheduling
- **Session/Message**: Live chat system
- **PrayerRequest/SongRequest**: User submissions
- **Testimonial**: User testimonials with moderation

## Development Workflow

### Testing
- Backend uses Jest with Supertest for API testing
- Test files are located in `be/tests/`
- Run tests before committing changes

### Authentication
- JWT-based authentication for admin users
- Session-based system for guest users in live chat
- Role-based access control implemented

### Real-time Features
- WebSocket implementation for live chat
- Message moderation system with admin controls
- Redis for session management and pub/sub

## Environment Setup

### Backend Environment Variables
Required in `be/.env`:
- `DATABASE_URL`: MySQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `REDIS_URL`: Redis connection string
- `PORT`: Server port (default: 3000)

### Frontend Configuration
- Uses `@/` path alias for `src/` directory
- Tailwind CSS with custom component library
- Next.js with Turbopack for faster development builds

## API Endpoints Structure

The API follows RESTful conventions:
- `/articles` - Article management
- `/auth` - Authentication endpoints
- `/livechat` - WebSocket and session management
- `/services` - Prayer and song request submissions
- `/testimonials` - Testimonial management
- `/programs` - Program schedule endpoints
- `/pages` - Static page content

Detailed API documentation is available in the `task/` directory with endpoint-specific markdown files.