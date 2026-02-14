# GitHub Copilot Instructions - Braid Core Web Dashboard

## Project Overview

This is a **Next.js 15+ fintech dashboard application** for managing financial operations including accounts, ACH processing, wire transfers, compliance, and transaction management. The application is built with TypeScript, React 18, and uses AWS Amplify for authentication.

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript (strict mode)
- **UI Libraries**: Material-UI (MUI), Radix UI, Tailwind CSS
- **State Management**: Redux Toolkit
- **Data Fetching**: TanStack Query (React Query), Axios
- **Authentication**: AWS Amplify (Cognito)
- **Styling**: Tailwind CSS + MUI custom theme
- **Forms**: React Hook Form + Zod/Hookform Resolvers
- **Charts**: Recharts, D3
- **Date Handling**: date-fns, dayjs, moment-timezone

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── accounts/          # Account management
│   ├── ach/              # ACH processing
│   ├── businesses/       # Business entity management
│   ├── compliance/       # Compliance features (OFAC, 314a, limits)
│   ├── configuration/    # System configuration
│   ├── individuals/      # Individual entity management
│   ├── transactions/     # Transaction management
│   └── wire/            # Wire transfer processing
├── core/                 # Core shared utilities
│   ├── api/             # API client & types
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── providers/       # Context providers
│   ├── repos/           # Data repositories
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── features/            # Feature-specific code
└── redux/              # Redux store & slices
```

## Code Style & Conventions

### File Naming

- **Components**: PascalCase (e.g., `MyComponent.tsx`)
- **Utilities**: camelCase (e.g., `formatters.ts`)
- **Types**: camelCase (e.g., `transaction.ts`)
- **Pages**: lowercase with underscores (e.g., `transaction_history/page.tsx`)

### Component Patterns

1. **Use "use client" directive** for client-side components that use hooks, state, or browser APIs
2. **Server components by default** unless client interactivity is needed
3. **Functional components only** - no class components
4. **Props interface naming**: Use `ComponentNameProps` pattern

```typescript
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  // Implementation
};
```

### TypeScript Guidelines

- **Always use strict typing** - avoid `any` unless absolutely necessary
- **Define interfaces for all props and API responses**
- **Use type aliases for union types** (e.g., `type Status = "PENDING" | "POSTED"`)
- **Export types from `src/core/types/`** directory
- **Use generics for reusable utilities**

### API Integration

Use the singleton `ApiClient` pattern:

```typescript
import ApiClient, { Method } from "@/core/api/ApiClient";

const client = ApiClient.getInstance();

// GET request
const data = await client.http<ResponseType>(
  Method.GET,
  "/endpoint"
);

// POST request
const result = await client.http<ResponseType>(
  Method.POST,
  "/endpoint",
  requestBody
);
```

**Key Points:**
- API client automatically handles authentication via AWS Amplify tokens
- API client includes request interceptors for auth tokens
- API client resets inactivity tracker on each request
- Define response types in `src/core/api/ApiTypes.ts`

### Authentication & Authorization

- **Authentication**: AWS Amplify Authenticator component (already configured)
- **Authorization**: Use `RequireRole` HOC for role-based access control

```typescript
import RequireRole from "@/core/components/RequireRole";

export default RequireRole(MyComponent, ["ADMIN", "SUPPORT"]);
```

**Available User Roles:**
- ADMIN
- SUPPORT
- ANALYST
- (check Redux store for current user's role)

### State Management

**Redux Toolkit** for global state:
- Store is in `src/redux/store/store.ts`
- Slices are in `src/redux/slices/`
- Use Redux for: auth state, user preferences, shared UI state
- Access state with `useSelector` hook
- Dispatch actions with `useDispatch` hook

**TanStack Query** for server state:
- Use for API data fetching and caching
- Wrap app in `QueryProvider` (already done)
- Prefer React Query over Redux for server data

### Styling Guidelines

**Tailwind CSS is primary** - use utility classes for most styling:

```typescript
<div className="flex items-center justify-between p-4 bg-primary-500 rounded-lg">
```

**Custom Tailwind Colors** (defined in `tailwind.config.ts`):
- Primary: `primary-50` to `primary-900`
- Success: `success-50` to `success-900`
- Error: `error-50` to `error-900`
- Neutral: `neutral-0` to `neutral-900`
- Pending: `pending-50`, `pending-100`

**MUI Components** for complex UI elements:
- Use MUI DataGrid for tables
- Use MUI date pickers for date inputs
- Apply Tailwind classes to MUI components via `className`

**Custom Fonts:**
- Gilroy: `font-gilroy`, `font-gilroy-semi-bold`, `font-gilroy-bold`, `font-gilroy-medium`
- Avenir: `font-avenir`, `font-avenir-regular`, `font-avenir-light`

### Component Architecture

**Reusable Components** in `src/core/components/`:
- `Button/` - Custom button components
- `Table/` - Table components
- `TextField/` - Input components
- `Text/` - Typography components
- `DateTimePicker/` - Date/time selection
- `Drawer/` - Navigation drawer
- `Autocomplete/` - Autocomplete inputs

**Feature-Specific Components** in respective `app/[feature]/components/`:
- Keep feature components co-located with their pages
- Extract to `core/components/` only when used in multiple features

### Forms

Use **React Hook Form** with schema validation:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

### Date & Time Handling

- **Use `date-fns`** for date formatting and calculations (preferred)
- **Use `moment-timezone`** for timezone-aware operations
- **Use `dayjs`** for lightweight date parsing
- Application supports timezone awareness (see `TimezoneProvider`)

### Error Handling

- **Try-catch blocks** for all async operations
- **Display errors** using `notistack` (already configured):

```typescript
import { enqueueSnackbar } from "notistack";

try {
  // API call
} catch (error) {
  enqueueSnackbar("Error message", { variant: "error" });
}
```

**Variants:**
- `success` - Green notification
- `error` - Red notification
- `warning` - Yellow notification
- `info` - Blue notification

### Loading States

- Use `nprogress` for page navigation (automatically configured)
- Use MUI `CircularProgress` for component-level loading
- Use React Suspense for code splitting and lazy loading

### Common Patterns

#### Pagination

```typescript
interface PaginatedResponse<T> {
  results: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
```

#### Master-Detail Views

Use components from `src/core/components/master_detail_view/`

#### Data Tables

Use MUI DataGrid with custom column definitions:

```typescript
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "name", headerName: "Name", flex: 1 },
];
```

### Constants

Define constants in `src/core/constants.ts` for:
- API endpoints
- Configuration values
- Enum values
- Regex patterns

### Imports

- **Use absolute imports** with `@/` alias (configured in `tsconfig.json`)
- **Group imports**: 
  1. React & Next.js
  2. Third-party libraries
  3. Local components & utilities
  4. Types
  5. Styles

```typescript
import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@mui/material";
import { enqueueSnackbar } from "notistack";

import MyComponent from "@/core/components/MyComponent";
import { formatDate } from "@/core/utils/dateUtils";

import type { Transaction } from "@/core/types/transaction";

import styles from "./styles.module.css";
```

### Performance

- **Use React.memo** for expensive components
- **Use useMemo and useCallback** to prevent unnecessary rerenders
- **Code split routes** with dynamic imports
- **Optimize images** with Next.js Image component
- **Lazy load heavy components**

### Security

- **Never log sensitive data** to console in production
- **Sanitize user inputs** before rendering
- **Use environment variables** for configuration (not hardcoded values)
- **Authentication tokens** are handled automatically by ApiClient
- **Session management** via AWS Amplify with session storage

### Testing

- Write tests for utility functions
- Test API integration with mocked responses
- Test critical user flows

### Docker

Build command:
```bash
docker build -f .aws/code_build/Dockerfile -t braid_web_dashboard:latest .
```

### Environment Variables

Required environment variables:
- `AWS_PROJECT_REGION`
- `AWS_COGNITO_REGION`
- `AWS_USER_POOLS_ID`
- `AWS_USER_POOLS_WEB_CLIENT_ID`
- `API_URL`

### Common Terminology

- **Business**: Business entity customer
- **Individual**: Individual customer
- **Account**: Financial account
- **Transaction**: Financial transaction
- **ACH**: Automated Clearing House payment
- **Wire**: Wire transfer
- **OFAC**: Office of Foreign Assets Control (compliance)
- **314a**: USA PATRIOT Act Section 314(a) (compliance)
- **NOC**: Notification of Change
- **Settlement**: Transaction settlement process

### Additional Notes

- **Remove console logs** in production (configured in `next.config.js`)
- **Use server-only imports** where appropriate
- **Optimize bundle size** - check imports and tree-shaking
- **Follow accessibility** best practices (ARIA labels, semantic HTML)
- **Mobile responsive** - all components should work on mobile devices

## Development Workflow

1. **Local development**: `npm run dev`
2. **Build for production**: `npm run build`
3. **Run production build**: `npm start`
4. **Lint code**: `npm run lint`

## Questions?

When uncertain about patterns, refer to existing implementations in:
- `src/core/` for utilities and shared code
- `src/app/accounts/` for a representative feature example
- `src/core/components/` for reusable UI patterns
