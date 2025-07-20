# LMS SaaS Admin Dashboard

A comprehensive Learning Management System (LMS) admin dashboard built with modern React technologies. This frontend application provides a full-featur## 🧩 Module Development

### Creating New Modules
Follow the standardized module pattern for consistency:

1. **Define Data Schema** - Zod schemas and TypeScript types
2. **Create API Service** - RESTful API integration
3. **Build Components** - Table, dialogs, stats, and forms
4. **Setup Context** - Module-specific state management
5. **Add Routing** - TanStack Router configuration

Refer to the [Module Design Guide](MODULE_DESIGN_GUIDE.md) for detailed instructions.

### Component Standards
- **TypeScript** - Full type safety
- **Responsive Design** - Mobile-first approach
- **Accessibility** - ARIA labels and keyboard navigation
- **Performance** - Lazy loading and memoization
- **Consistency** - Shared design patterns

## 🎨 Theming & Customization

### Multi-tenant Theming
- **Per-tenant Themes** - Custom branding for each tenant
- **Color Palettes** - Customizable color schemes
- **Logo Management** - Tenant-specific logos and branding
- **CSS Variables** - Dynamic theme switching
- **Dark/Light Mode** - System and manual theme control

### Design System
- **ShadcnUI Components** - Consistent component library
- **TailwindCSS** - Utility-first styling
- **Custom Components** - Extended UI components
- **Icon System** - Lucide React icons

## 🔒 Security Features

- **Authentication** - Clerk-based user management
- **Authorization** - Role-based access control
- **Multi-tenancy** - Complete tenant isolation
- **API Security** - Token-based authentication
- **XSS Protection** - Input sanitization
- **CSRF Protection** - Request validation

## 🚀 Performance Optimizations

- **Code Splitting** - Route-based lazy loading
- **Bundle Optimization** - Tree shaking and dead code elimination
- **Caching Strategy** - TanStack Query with optimized cache
- **Image Optimization** - Responsive images and lazy loading
- **Debounced Search** - Optimized search interactions
- **Virtual Scrolling** - Large dataset handling

## 🧪 Testing Strategy

- **Unit Tests** - Component testing with Jest/Vitest
- **Integration Tests** - Feature workflow testing
- **Type Safety** - TypeScript compile-time checks
- **Linting** - ESLint for code quality
- **Format Checking** - Prettier for consistent formatting

## 📈 Analytics & Monitoring

- **User Analytics** - Engagement and usage tracking
- **Performance Metrics** - Course completion and progress
- **System Health** - Error tracking and monitoring
- **Custom Dashboards** - Configurable analytics views

## 🔄 Backend Integration

### API Endpoints
- **Base URL:** `http://localhost:8000/api`
- **Authentication:** Bearer token
- **Multi-tenant:** X-Tenant-ID header
- **Versioning:** `/v1/` prefix

### Supported Operations
- **CRUD Operations** - Full create, read, update, delete
- **Pagination** - Server-side pagination support
- **Filtering** - Advanced filtering capabilities
- **Search** - Full-text search integration
- **Batch Operations** - Multiple item operations

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Follow coding standards
4. Add tests for new features
5. Submit a pull request

### Code Standards
- **TypeScript** - Strict mode enabled
- **ESLint** - Airbnb configuration
- **Prettier** - Consistent formatting
- **Conventional Commits** - Semantic commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Development Team:** [sanukhandev](https://github.com/sanukhandev)

**Project Type:** Learning Management System SaaS Platform

---

## 🔗 Related Projects

- **[LMS Backend API](../lms-be/)** - Laravel-based backend API
- **Module Design Guide** - Frontend architecture documentation
- **Tenant Theme System** - Multi-tenant theming implementation

For questions, issues, or contributions, please reach out through GitHub issues or contact the development team.managing courses, users, categories, analytics, and multi-tenant configurations.

![alt text](public/images/shadcn-admin.png)

This admin dashboard is part of a larger LMS SaaS platform that includes multi-tenant support, theme customization, advanced analytics, and comprehensive course management capabilities. The application follows a feature-based architecture with consistent patterns across all modules.

## 🚀 Key Features

### Core Features
- **Multi-tenant Architecture** - Complete tenant isolation with custom themes
- **User Management** - Role-based access control (Admin, Instructor, Student)
- **Course Management** - Comprehensive course creation and management
- **Category Management** - Hierarchical course categorization
- **Analytics Dashboard** - Advanced analytics and reporting
- **Theme Customization** - Per-tenant theme and branding
- **Real-time Chat** - Integrated communication system
- **Content Builder** - Visual course content creation tools

### Technical Features
- **Light/Dark Mode** - System and manual theme switching
- **Responsive Design** - Mobile-first responsive layouts
- **Accessibility** - WCAG compliant interface
- **Advanced Data Tables** - Sortable, filterable, paginated tables
- **Global Search** - Command palette for quick navigation
- **Optimized Performance** - Lazy loading and caching strategies
- **Type Safety** - Full TypeScript implementation
- **Real-time Updates** - WebSocket integration for live data

### Module Architecture
- **Feature-based Structure** - Self-contained modules
- **Consistent Patterns** - Standardized component architecture
- **Reusable Components** - Shared UI components across modules
- **State Management** - Context + TanStack Query pattern

## 🛠️ Tech Stack

**Frontend Framework:** [React 18](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)

**UI Components:** [ShadcnUI](https://ui.shadcn.com) (TailwindCSS + RadixUI)

**Build Tool:** [Vite](https://vitejs.dev/) with Hot Module Replacement

**Routing:** [TanStack Router](https://tanstack.com/router/latest) - Type-safe routing

**State Management:** 
- [TanStack Query](https://tanstack.com/query/latest) - Server state management
- [Zustand](https://zustand-demo.pmnd.rs/) - Client state management
- React Context - Module-specific state

**Data Tables:** [TanStack Table](https://tanstack.com/table/latest) - Headless table library

**Form Handling:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation

**HTTP Client:** [Axios](https://axios-http.com/) with interceptors and retry logic

**Styling:** [TailwindCSS](https://tailwindcss.com/) with custom design system

**Icons:** [Lucide React](https://lucide.dev/) + [Tabler Icons](https://tabler.io/icons)

**Authentication:** [Clerk](https://clerk.com/) - User authentication and management

**Development Tools:**
- [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) - Code quality
- [Knip](https://knip.dev/) - Dead code elimination
- [TypeScript](https://www.typescriptlang.org/) - Type checking

## 📁 Project Structure

```
src/
├── components/          # Shared UI components
├── features/           # Feature-based modules
│   ├── analytics/      # Analytics and reporting
│   ├── auth/          # Authentication flows
│   ├── categories/    # Course category management
│   ├── chats/         # Real-time messaging
│   ├── courses/       # Course management
│   ├── course-builder/ # Visual course creation
│   ├── dashboard/     # Main dashboard
│   ├── settings/      # System settings
│   ├── tasks/         # Task management
│   └── users/         # User management
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
├── services/          # API services
├── stores/            # Global state stores
├── types/             # TypeScript type definitions
└── utils/             # Helper functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Backend API server (Laravel-based LMS API)

### Environment Setup
Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key

# Development flags
VITE_USE_REAL_API=true
```

### Installation

Clone the repository
```bash
git clone https://github.com/sanukhandev/lms-saas-admin-fe.git
cd lms-saas-admin-fe
```

Install dependencies
```bash
pnpm install
# or
npm install
```

Start development server
```bash
pnpm dev
# or 
npm run dev
```

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality  
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting

# Analysis
pnpm knip             # Find unused code and dependencies
```

## 📚 Documentation

- **[Module Design Guide](MODULE_DESIGN_GUIDE.md)** - Comprehensive guide for creating new modules
- **[Tenant Theme Guide](TENANT_THEME_SUMMARY.md)** - Multi-tenant theming implementation
- **[Development Fixes](DEVELOPMENT_FIXES.md)** - Known issues and solutions
- **[Changelog](CHANGELOG.md)** - Version history and updates

## 🏗️ Architecture Patterns

### Feature-Based Architecture
Each feature module is self-contained with:
- **Components** - UI components specific to the feature
- **Context** - Module-specific state management  
- **Hooks** - Custom hooks for data fetching and logic
- **Services** - API integration layer
- **Types** - TypeScript interfaces and schemas

### State Management Strategy
- **TanStack Query** - Server state, caching, background updates
- **Zustand** - Global client state (auth, tenant, themes)
- **React Context** - Module-specific UI state (dialogs, selections)

### API Integration
- **Axios Instance** - Pre-configured with interceptors
- **Automatic Auth** - Token injection and refresh
- **Tenant Headers** - Multi-tenant request handling
- **Error Handling** - Centralized error management
- **Retry Logic** - Automatic retry for failed requests

## Sponsoring this project ❤️

If you find this project helpful or use this in your own work, consider [sponsoring me](https://github.com/sponsors/satnaing) to support development and maintenance. You can [buy me a coffee](https://buymeacoffee.com/satnaing) as well. Don’t worry, every penny helps. Thank you! 🙏

For questions or sponsorship inquiries, feel free to reach out at [contact@satnaing.dev](mailto:contact@satnaing.dev).

### Current Sponsor

- [Clerk](https://go.clerk.com/GttUAaK) - for backing the implementation of Clerk in this project

## Author

Crafted with 🤍 by [@satnaing](https://github.com/satnaing)

## License

Licensed under the [MIT License](https://choosealicense.com/licenses/mit/)
