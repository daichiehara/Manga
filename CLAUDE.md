# CLAUDE.md
必ず日本語で回答してください。
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack manga trading platform called "トカエル" (Tocaeru) built with ASP.NET Core backend and React frontend. Users can buy, sell, and exchange manga with features like identity verification, messaging, wish lists, and secure transactions.

## Development Commands

### Frontend (manga.client/)
```bash
# Development server
npm run dev

# Build for production
npm run build

# Lint TypeScript/React code
npm run lint

# Preview production build
npm run preview
```

### Backend (Manga.Server/)
```bash
# Run development server
dotnet run

# Build solution
dotnet build

# Run with hot reload
dotnet watch

# Database migrations
dotnet ef migrations add <MigrationName>
dotnet ef database update

# Run from solution root
dotnet run --project Manga.Server
```

### Full Solution
```bash
# Build entire solution
dotnet build Manga.sln

# Run backend (will also serve frontend via SPA proxy)
cd Manga.Server && dotnet run
```

## Architecture Overview

### Backend Architecture
- **Framework**: ASP.NET Core 8.0 with Entity Framework Core
- **Database**: PostgreSQL with Identity framework for user management
- **Authentication**: JWT tokens + Google OAuth, with cookie-based token storage
- **Cloud Services**: AWS S3 (images), SES (email), Secrets Manager (config)
- **Key Services**:
  - `S3Service`: Image upload/management
  - `AmazonSESEmailSender`: Email notifications
  - `ReCaptchaService`: Bot protection

### Database Design
Core entities managed by `ApplicationDbContext`:
- `UserAccount`: Identity-based user system with roles
- `Sell`: Manga listings with images, condition, pricing
- `Request`: Purchase/exchange requests with matching system
- `WishList`/`OwnedList`: User collection management
- `Reply`: Messaging between users
- `Notification`: In-app notifications
- `Report`: Content/user reporting system
- `Match`: Automated buyer-seller matching
- `BlockedUser`: User blocking functionality

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite
- **UI Library**: Material-UI (MUI) with custom theme
- **Routing**: React Router v6 with nested routes
- **State Management**: Context API for auth, notifications, and global state
- **Key Contexts**:
  - `AuthContext`: Authentication state management
  - `NotificationContext`: Push notifications and alerts
  - `SnackbarContext`: Toast notifications
  - `UserContext`: Current user data
  - `BookContext`: Manga-specific state

### Component Structure
- `components/common/`: Reusable UI components
- `components/context/`: React Context providers
- `components/item/`: Manga/book-specific components
- `pages/`: Route-level page components
- `hooks/`: Custom React hooks
- `api/`: API service layer with axios

## Development Guidelines

### Backend Development
- Controllers follow RESTful conventions with proper HTTP status codes
- All sensitive configuration stored in AWS Secrets Manager
- Entity relationships configured in `ApplicationDbContext.OnModelCreating`
- Use dependency injection for services
- Authentication required for most endpoints except public registration/login

### Frontend Development
- Components use Material-UI theming system
- API calls handled through centralized `authService` with axios interceptors
- Image handling optimized with compression before upload
- Mobile-first responsive design
- Japanese localization support built-in

### Database Operations
- All migrations are in `Migrations/` folder
- Use EF Core conventions for entity configuration
- Foreign key relationships properly configured with cascade deletes
- Search functionality uses PostgreSQL full-text search

### Security Considerations
- JWT tokens stored in httpOnly cookies
- reCAPTCHA integration for form submissions
- Input validation on both client and server
- AWS IAM roles for service authentication
- User blocking and reporting systems implemented

### Deployment Configuration
- Frontend builds to `dist/` and is served by backend as SPA
- Backend configured for both development (localhost) and production (tocaeru.com)
- CORS properly configured for allowed origins
- PWA configuration for mobile app experience

## Common Development Patterns

### Adding New API Endpoints
1. Create DTO models in `Models/`
2. Add controller action with proper authorization
3. Update `ApplicationDbContext` if new entities needed
4. Add migration if database changes required
5. Update frontend service in `api/authService.ts`

### Adding New Frontend Pages
1. Create page component in `pages/`
2. Add route in `App.tsx` router configuration
3. Add navigation links in appropriate components
4. Update context providers if global state needed

### Image Upload Workflow
1. Frontend compresses images using `browser-image-compression`
2. Images uploaded to AWS S3 via `S3Service`
3. S3 URLs stored in database entities
4. Frontend displays images with optimization and zoom features