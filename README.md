# CONECT EDU - Frontend Application

A comprehensive digital admissions platform for Nigerian secondary schools built with Next.js, TypeScript, and Tailwind CSS.

## Local Backend

The Next.js app now includes API routes for authentication, schools, applications, and payments. It automatically seeds six schools and stores local development data in `.data/conect-edu.json`, which is excluded from Git. This storage is intended for local development and demos; replace it with a managed database before production deployment.

Copy `.env.example` to `.env.local`, set a unique `AUTH_SECRET`, and add `PAYSTACK_SECRET_KEY` to enable live payments. Configure Paystack to send successful-payment events to `POST /api/payments/webhook`.

## Project Overview

CONECT EDU is a three-sided platform connecting:
- **Parents/Students** - Discover, compare, and apply to schools
- **School Administrators** - Manage applications and school information
- **CONECT Admins** - Oversee the platform and manage schools

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── (auth)/            # Auth pages
│   │   ├── login/
│   │   └── register/
│   ├── schools/           # School discovery
│   │   ├── page.tsx
│   │   └── [id]/
│   ├── dashboard/         # User dashboard
│   ├── admin/             # School admin dashboard
│   └── conect/            # Platform admin dashboard
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── Loading.tsx
│   │   └── StatusBadge.tsx
│   └── layout/            # Layout components
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── AdminLayout.tsx
├── services/              # API services
│   ├── api.ts             # Axios instance
│   ├── auth.ts            # Auth endpoints
│   ├── schools.ts         # School endpoints
│   ├── applications.ts    # Application endpoints
│   └── payments.ts        # Payment endpoints
├── store/                 # Zustand stores
│   └── auth.ts            # Authentication store
├── hooks/                 # Custom React hooks
│   └── index.ts
├── types/                 # TypeScript types
│   └── index.ts
├── utils/                 # Utility functions
│   └── index.ts
├── constants/             # App constants
│   └── index.ts
└── styles/
    └── globals.css        # Global styles
```

## Features Implemented

### ✅ Core Features
- [x] Responsive design (mobile, tablet, desktop)
- [x] Modern UI component library
- [x] Authentication system (login/register)
- [x] Role-based access control
- [x] School discovery with filters
- [x] School detail pages
- [x] User dashboard
- [x] School admin dashboard
- [x] Platform admin dashboard

### 🚀 In Progress / Coming Soon
- [ ] Application form (7-step process)
- [ ] Document upload
- [ ] Payment integration (Paystack)
- [ ] Application tracking
- [ ] School profile management
- [ ] Admin application management
- [ ] Messaging system
- [ ] Virtual tours
- [ ] Physical tour requests
- [ ] Saved schools comparison
- [ ] Advanced analytics
- [ ] Email notifications

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   cd "c:\Users\sadiq\OneDrive\Documents\CONECT EDU"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## Key Components

### UI Components
All UI components are built with Tailwind CSS and follow the design system:
- Customizable through props (variant, size, color)
- Fully typed with TypeScript
- Accessible and responsive
- Consistent styling across the app

### Authentication Flow
1. User registers/logs in
2. JWT token stored in localStorage
3. Automatic token injection in API requests
4. 401 responses trigger logout and redirect to login

### API Integration
- Centralized Axios instance with interceptors
- Automatic token attachment to requests
- Error handling and logging
- Mock data structure for development

## Color Scheme

The app uses a carefully designed color palette:

**Primary**: Dark Purple (#7c3aed - #2e0854)
**Secondary**: Neutral grays (#111827 - #f9fafb)
**Accent Colors**: Green (success), Yellow (warning), Red (error), Blue (info)

## Development Workflow

1. **Component Development**
   - Create in `src/components/`
   - Import and use in pages
   - Props are fully typed

2. **Page Creation**
   - Create in `src/app/` following Next.js file-based routing
   - Use existing components
   - Add types in `src/types/`

3. **API Integration**
   - Add endpoint in `src/services/`
   - Use in components with hooks
   - Handle loading and error states

## Styling Guidelines

- Use Tailwind classes for styling
- Use `cn()` utility for conditional classes
- Follow the design system colors and spacing
- Maintain responsive design with Tailwind breakpoints

## Best Practices

1. **Type Safety**: Always use TypeScript types
2. **Component Reusability**: Create generic components
3. **Error Handling**: Wrap API calls in try-catch
4. **Loading States**: Show loading indicators during async operations
5. **Responsive Design**: Test on mobile, tablet, desktop

## Building Features

### Adding a New Page
1. Create file in `src/app/` (e.g., `src/app/new-page/page.tsx`)
2. Use existing components
3. Add types in `src/types/index.ts`

### Adding a New Component
1. Create in `src/components/`
2. Export with proper TypeScript types
3. Add to component library docs

### Adding API Endpoint
1. Create service in `src/services/`
2. Use Axios instance with proper types
3. Add error handling

## Performance Optimization

- Image optimization with Next.js Image component
- Code splitting with dynamic imports
- Lazy loading for heavy components
- CSS-in-JS with Tailwind (minimal bundle)

## Deployment

The app can be deployed to:
- Vercel (recommended for Next.js)
- AWS Amplify
- Firebase Hosting
- Docker containers

## Contributing

1. Follow the project structure
2. Use TypeScript strictly
3. Test components locally
4. Create meaningful commits
5. Update documentation

## License

© 2026 CONECT EDU. All rights reserved.

## Support

For issues and questions, contact the development team.
