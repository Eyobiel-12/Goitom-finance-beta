# Goitom Finance - Application Architecture

## Overview

Goitom Finance is a professional invoicing SaaS application built for freelancers. The application enables users to manage clients, track projects, generate invoices, and handle VAT reporting.

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Next.js Server Actions & Route Handlers

### Key Libraries
- `@supabase/ssr` - Server-side Supabase client
- `@supabase/supabase-js` - Client-side Supabase client
- `react-hook-form` - Form management
- `zod` - Schema validation
- `swr` - Client-side data fetching

## Project Structure

\`\`\`
goitom-finance/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group (no dashboard layout)
│   │   └── auth/
│   │       ├── login/            # Login page
│   │       ├── sign-up/          # Sign-up page
│   │       └── sign-up-success/  # Post-signup confirmation
│   ├── dashboard/                # Protected dashboard routes
│   │   ├── clients/              # Client management
│   │   ├── projects/             # Project management
│   │   ├── invoices/             # Invoice management
│   │   ├── vat-reports/          # VAT reporting
│   │   ├── settings/             # User settings
│   │   ├── layout.tsx            # Dashboard layout with sidebar
│   │   └── page.tsx              # Dashboard home
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── dashboard/                # Dashboard-specific components
│   │   ├── sidebar.tsx           # Navigation sidebar
│   │   └── user-nav.tsx          # User navigation dropdown
│   └── forms/                    # Form components
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   ├── server.ts             # Server Supabase client
│   │   └── middleware.ts         # Auth middleware client
│   ├── actions/                  # Server actions
│   └── utils.ts                  # Utility functions
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript type definitions
└── middleware.ts                 # Next.js middleware for auth
\`\`\`

## Core Features

### 1. Authentication
- **Email/Password Authentication** via Supabase Auth
- **Protected Routes** using Next.js middleware
- **Session Management** with automatic token refresh
- **User Profile** stored in Supabase auth metadata

**Flow**:
1. User signs up → Email verification sent
2. User confirms email → Redirected to dashboard
3. Middleware checks auth on protected routes
4. Server components fetch user data

### 2. Client Management
- Create, read, update, delete clients
- Store client contact information
- Link clients to projects and invoices
- Search and filter clients

**Database Schema**:
\`\`\`sql
clients (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
\`\`\`

### 3. Project Management
- Track projects for clients
- Record project details and status
- Link projects to invoices
- Monitor project progress

**Database Schema**:
\`\`\`sql
projects (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  client_id UUID REFERENCES clients,
  name TEXT,
  description TEXT,
  status TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
\`\`\`

### 4. Invoice Management
- Generate professional invoices
- Automatic VAT calculations
- PDF export functionality
- Track invoice status (draft, sent, paid)
- Link invoices to clients and projects

**Database Schema**:
\`\`\`sql
invoices (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  client_id UUID REFERENCES clients,
  project_id UUID REFERENCES projects,
  invoice_number TEXT UNIQUE,
  issue_date DATE,
  due_date DATE,
  subtotal DECIMAL,
  vat_rate DECIMAL,
  vat_amount DECIMAL,
  total DECIMAL,
  status TEXT,
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

invoice_items (
  id UUID PRIMARY KEY,
  invoice_id UUID REFERENCES invoices,
  description TEXT,
  quantity DECIMAL,
  unit_price DECIMAL,
  amount DECIMAL,
  created_at TIMESTAMP
)
\`\`\`

### 5. VAT Reporting
- Automated VAT calculations
- Generate VAT reports by period
- Export reports for tax filing
- Track VAT collected and paid

## Data Flow

### Authentication Flow
\`\`\`
User → Login Form → Supabase Auth → Session Cookie → Middleware → Dashboard
\`\`\`

### Data Fetching Patterns

**Server Components** (Preferred):
\`\`\`typescript
// app/dashboard/clients/page.tsx
export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })
  
  return <ClientsList clients={clients} />
}
\`\`\`

**Client Components with SWR**:
\`\`\`typescript
// components/dashboard/recent-invoices.tsx
'use client'
import useSWR from 'swr'

export function RecentInvoices() {
  const { data, error } = useSWR('/api/invoices/recent', fetcher)
  // ...
}
\`\`\`

### Mutations with Server Actions
\`\`\`typescript
// lib/actions/clients.ts
'use server'

export async function createClient(formData: FormData) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clients')
    .insert({ ... })
    .select()
  
  revalidatePath('/dashboard/clients', 'max')
  return { data, error }
}
\`\`\`

## Security

### Row Level Security (RLS)
All database tables use RLS policies to ensure users can only access their own data:

\`\`\`sql
-- Example RLS policy for clients table
CREATE POLICY "Users can view their own clients"
  ON clients FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients"
  ON clients FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients"
  ON clients FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients"
  ON clients FOR DELETE
  USING (auth.uid() = user_id);
\`\`\`

### Middleware Protection
\`\`\`typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const supabase = createServerClient(...)
  await supabase.auth.getUser() // Validates session
  // Redirect to login if not authenticated
}
\`\`\`

### Environment Variables
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Admin key (server-only)
- `NEXT_PUBLIC_SUPABASE_URL` - Client-side URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Client-side key

## Performance Optimizations

### Caching Strategy
- **Static Pages**: Landing page is statically generated
- **Dynamic Pages**: Dashboard pages use ISR with `revalidate`
- **Server Actions**: Use `revalidateTag()` for targeted cache invalidation

### Database Optimization
- Indexes on frequently queried columns (user_id, client_id, etc.)
- Efficient queries with proper joins
- Pagination for large datasets

### Client-Side Optimization
- SWR for client-side caching and revalidation
- Optimistic updates for better UX
- Lazy loading for heavy components

## Deployment

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Database Migrations
- SQL scripts in `/scripts` folder
- Run migrations via Supabase dashboard or CLI
- Version-controlled migration files

## Development Workflow

### Local Development
\`\`\`bash
npm install
npm run dev
\`\`\`

### Database Setup
1. Create Supabase project
2. Run migration scripts from `/scripts` folder
3. Configure environment variables

### Testing
- Unit tests for utility functions
- Integration tests for server actions
- E2E tests for critical user flows

## Future Enhancements

### Planned Features
- [ ] Multi-currency support
- [ ] Recurring invoices
- [ ] Payment gateway integration (Stripe)
- [ ] Email notifications
- [ ] Invoice templates customization
- [ ] Expense tracking
- [ ] Financial reports and analytics
- [ ] Mobile app

### Technical Improvements
- [ ] Implement comprehensive test suite
- [ ] Add error monitoring (Sentry)
- [ ] Implement rate limiting
- [ ] Add audit logs
- [ ] Optimize bundle size
- [ ] Add PWA support

## Contributing

### Code Style
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Document complex logic

### Pull Request Process
1. Create feature branch from `main`
2. Implement feature with tests
3. Update documentation
4. Submit PR with description
5. Address review feedback
6. Merge after approval

## Support

For questions or issues:
- Check documentation in `/docs`
- Review existing GitHub issues
- Contact support team

---

**Last Updated**: January 2025
**Version**: 1.0.0
