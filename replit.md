# CRAudioVizAI — Replit MD

## Overview

CRAudioVizAI is a comprehensive AI solutions provider offering tools, apps, website creation, and immersive avatar experiences through CRVerse. The platform features Javari, an autonomous continuously learning AI assistant, and CRVerse as the avatar universe module. CRAudioVizAI serves individuals, families, small businesses, nonprofits, and governments with AI-powered solutions, personalized assistance, education, and business growth services.

The system is built as a full-stack application with a React frontend, Express/FastAPI backend, PostgreSQL database with vector extensions, and integrates multiple third-party services for avatar generation, payments, and automation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components with Radix UI primitives and Tailwind CSS for styling
- **Routing**: Wouter for client-side routing with protected routes for authenticated content
- **State Management**: React Query (TanStack Query) for server state management
- **Authentication**: Session-based authentication with protected route components

### Backend Architecture
- **Primary Backend**: Node.js with Express and TypeScript
- **Secondary Backend**: FastAPI with Python (for AI services)
- **Database**: PostgreSQL with pgvector extension for embedding storage
- **ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Passport.js with local strategy and session management
- **Session Storage**: PostgreSQL-backed session store using connect-pg-simple

### Data Storage Solutions
- **Primary Database**: Neon PostgreSQL with vector search capabilities
- **Session Storage**: PostgreSQL tables for user sessions
- **File Storage**: Initially filesystem-based, planned migration to S3-compatible storage
- **Configuration**: Environment-based secrets management with local .ini files for development

### Authentication and Authorization
- **Strategy**: Username/password authentication with session-based persistence
- **User Roles**: Admin, creator, and regular user roles with age verification system
- **Security**: Password hashing using scrypt, secure session management
- **Access Control**: Role-based permissions for different features and content zones

### Core Data Models
- **Users**: Username/email authentication with role-based permissions
- **Avatars**: AI and human avatar types with personality and capability configurations
- **Universe Zones**: Content areas with age ratings and access controls
- **Chat Sessions**: User interactions with avatars stored as JSON message histories
- **Audit Trails**: Comprehensive logging for compliance and monitoring

## External Dependencies

### AI and Avatar Services
- **Akool**: Avatar visual generation
- **ElevenLabs**: Voice synthesis for avatars
- **OpenAI/Anthropic**: Potential LLM integrations for Javari

### Payment Processing
- **Stripe**: Primary payment processor for subscriptions and one-time purchases
- **PayPal**: Alternative payment method via PayPal SDK

### Communication and Marketing
- **Mailchimp**: Email newsletter and marketing automation
- **Zapier**: Workflow automation and service integrations
- **Buffer/Social Media APIs**: Multi-platform social media posting

### Infrastructure and Hosting
- **Hostinger**: Primary hosting platform for production deployment
- **Neon**: Managed PostgreSQL database with vector search
- **GitHub**: Code repository and CI/CD via GitHub Actions

### Development and Monitoring
- **Replit**: Development environment
- **Grafana/Prometheus**: Planned monitoring and observability stack
- **Sentry**: Planned error tracking and performance monitoring

### Design and Content
- **Canva**: Design assets and marketing materials
- **Figma**: UI/UX design and prototyping
- **Gelato**: Print-on-demand merchandise fulfillment