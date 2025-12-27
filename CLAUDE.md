# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Virtuoso is a music practice web application built with Next.js 16. It provides interactive exercises for music theory, ear training, and instrument practice (piano, guitar, voice) with progress tracking and gamification.

## Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Generate Prisma client + build Next.js
npm run lint         # Run ESLint
```

Database commands:
```bash
npx prisma generate  # Regenerate Prisma client after schema changes
npx prisma db push   # Push schema changes to database (dev)
npx prisma studio    # Open Prisma database GUI
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Database**: PostgreSQL with Prisma 7 + `@prisma/adapter-pg`
- **Auth**: NextAuth v5 beta with credentials provider (JWT sessions)
- **Styling**: Tailwind CSS v4 with CSS variables (Spotify-inspired dark theme)
- **State**: Zustand + TanStack Query
- **Audio**: Web Audio API for sound synthesis, `pitchfinder` for pitch detection

### Route Structure
- `src/app/(auth)/` - Login/register pages (public)
- `src/app/(main)/` - Protected app routes with sidebar layout
- `src/app/api/` - API routes (auth handlers, registration)

### Key Directories
- `src/components/ui/` - Base UI components (Button, Card, Input, Modal)
- `src/components/layout/` - Header, Sidebar, MainLayout
- `src/components/exercises/` - All interactive exercise components
- `src/components/audio/` - Metronome, Tuner, PracticeTimer
- `src/lib/` - Auth config (`auth.ts`), Prisma client (`prisma.ts`), utilities

### Authentication Flow
Auth is configured in `src/lib/auth.ts` using NextAuth with PrismaAdapter. Protected routes are in `src/app/(main)/` which checks session in layout and redirects to `/login` if unauthenticated.

### Styling System
CSS variables defined in `src/app/globals.css` control theming:
- Primary: `#1DB954` (Spotify green)
- Background: `#121212`, Card: `#181818`
- All components use these variables via Tailwind classes

### Audio Pattern
Exercise components that use audio follow this pattern:
```typescript
const audioContextRef = useRef<AudioContext | null>(null);
// Initialize on user interaction
if (!audioContextRef.current) {
  audioContextRef.current = new AudioContext();
}
```

### Database Schema
Prisma schema at `prisma/schema.prisma` includes:
- User/Account/Session (NextAuth models)
- UserProfile, UserProgress, Streak, UserGoal (gamification)
- Module, Lesson, Exercise (content)
- ExerciseAttempt, LessonProgress (tracking)

## Environment Variables

Required in `.env.local`:
```
DATABASE_URL=postgresql://...
AUTH_SECRET=... (generate with: openssl rand -base64 32)
```
