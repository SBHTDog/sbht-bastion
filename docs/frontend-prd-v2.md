# Frontend PRD v2 - CI/CD Deploy Monitor

**Framework**: Next.js 15 + TypeScript
**Version**: 2.0
**Date**: 2025-11-18

---

## 1. Project Core

### Vision
게임화된 CI/CD 배포 모니터링 플랫폼 - 실패를 학습으로 전환

### Key Features
- Real-time deploy monitoring (야구 스코어보드)
- AI failure analysis (LLM)
- Team documentation & sharing
- Mock data driven development

---

## 2. Tech Stack

```yaml
framework: Next.js 15 (App Router)
language: TypeScript 5.3+
styling:
  - Tailwind CSS 3.4+
  - Framer Motion 11+
state:
  - Zustand 4.5+ (global)
  - Server Actions (mutations)
forms: React Hook Form + Zod
ui: Radix UI (headless)
charts: Recharts 2.10+
icons: Heroicons 2.1+
fonts: Inter, JetBrains Mono
```

### Next.js Benefits
- **Server Components**: Static content, data fetching
- **Client Components**: Interactivity, state management
- **App Router**: File-based routing
- **Auto Optimization**: Image, font, bundle optimization
- **Server Actions**: Type-safe mutations

---

## 3. Design System

### Three-Style Hybrid

```css
/* 1. Glassmorphism - Cards, Modals */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* 2. Developer Minimalism - Logs, Code Blocks */
.dev-minimal {
  background: #0d1117;
  color: #c9d1d9;
  font-family: 'JetBrains Mono', monospace;
}

/* 3. Blue Gradient - CTAs, Progress */
.blue-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Colors
```yaml
primary: "#4facfe"    # Blue
secondary: "#667eea"  # Purple
success: "#10b981"    # Green
error: "#ef4444"      # Red
bg-dark: "#0d1117"    # Main BG
bg-card: "#161b22"    # Card BG
text: "#c9d1d9"       # Text
```

---

## 4. App Structure (Next.js App Router)

```
app/
├── (auth)/
│   └── login/
│       └── page.tsx           # Server Component
├── (dashboard)/
│   ├── layout.tsx             # Server Component (header, nav)
│   ├── page.tsx               # Dashboard - Server Component
│   ├── projects/
│   │   ├── new/
│   │   │   └── page.tsx       # Project Setup - Client Component
│   │   └── [id]/
│   │       └── deploy/
│   │           └── page.tsx   # Deploy Monitor - Client Component
│   └── history/
│       └── page.tsx           # History - Server Component
└── api/
    └── mock/                  # Mock API routes (optional)
```

---

## 5. Component Architecture

### Component Type Matrix

| Page | Type | Reason |
|------|------|--------|
| Landing | Server | Static content |
| Dashboard | Server | Data display, SSR |
| Project Setup | Client | Form state, validation |
| Deploy Monitor | Client | Real-time updates, animation |
| Success/Failure View | Server | Static results display |
| History | Server | List rendering, filtering |

### Component Breakdown

#### 🏠 Landing Page (Server Component)

```yaml
path: /
type: Server Component
design:
  hero: Blue Gradient background
  features: Glassmorphism cards
  cta: Blue Gradient button
components:
  - Header (Server)
  - Hero (Server)
  - Features (Server)
  - CTA (Client - onClick)
```

#### 🎛️ Dashboard (Server Component)

```yaml
path: /dashboard
type: Server Component
design:
  bg: Developer Minimalism (#0d1117)
  stats: Glassmorphism cards
  projects: Glassmorphism cards
  buttons: Blue Gradient
components:
  - StatsCards (Server)
  - ProjectCard (Server)
    - DeployButton (Client - onClick)
    - SettingsButton (Client)
data: await getProjects() # Server-side fetch
```

#### 🔗 Repository Selection (Client Component)

```yaml
path: /projects/new (step 1)
type: Client Component
reason: Search, filter state
design:
  modal: Glassmorphism
  cards: Developer Minimalism
  buttons: Blue Gradient
state:
  - searchQuery
  - selectedRepo
  - sortBy
```

#### ⚙️ Project Setup (Client Component)

```yaml
path: /projects/new (step 2)
type: Client Component
reason: Form validation, state
design:
  container: Glassmorphism
  inputs: Minimal style
  env-vars: Developer Minimalism
form: React Hook Form + Zod
validation:
  - repository: required
  - branch: required
  - dockerfilePath: regex
```

#### ⚾ Deploy Monitor (Client Component)

```yaml
path: /projects/[id]/deploy
type: Client Component
reason: Real-time updates, animation
design:
  scoreboard: Glassmorphism
  progress: Blue Gradient
  logs: Developer Minimalism (monospace)
state:
  - currentStage: number
  - stages: DeploymentStage[]
  - logs: string[]
animation: Framer Motion
update: setInterval simulation (mock)
```

**9 Stages**:
1. Checkout
2. Dependencies
3. Lint
4. Test
5. Build
6. Security Scan
7. Push ECR
8. Deploy
9. Health Check

#### ✅ Success View (Server Component)

```yaml
path: /deployments/[id] (success)
type: Server Component
reason: Static display
design:
  container: Glassmorphism
  table: Developer Minimalism
  buttons: Blue Gradient
data: await getDeployment(id)
```

#### ❌ Failure View (Server Component)

```yaml
path: /deployments/[id] (failed)
type: Server Component
reason: Static display, AI analysis
design:
  container: Glassmorphism
  ai-card: Glassmorphism (bright)
  logs: Developer Minimalism (red highlight)
data:
  - deployment: await getDeployment(id)
  - analysis: await getAIAnalysis(id) # mock
```

#### 📜 History (Server Component)

```yaml
path: /history
type: Server Component
reason: List rendering, SEO
design:
  container: Glassmorphism
  items: Developer Minimalism
  pagination: Blue Gradient
data: await getDeployments(filters)
searchParams: period, status, environment
```

---

## 6. Mock Data Strategy

### File Structure
```
src/lib/mock/
├── data/
│   ├── users.ts
│   ├── repositories.ts
│   ├── projects.ts
│   └── deployments.ts
└── services/
    ├── auth.ts
    ├── projects.ts
    └── deployments.ts
```

### Core Types

```typescript
// User
interface User {
  id: number;
  username: string;
  avatar: string;
}

// Repository
interface Repository {
  id: number;
  name: string;
  owner: string;
  language: string;
  stars: number;
}

// Project
interface Project {
  id: string;
  repository: Repository;
  branch: string;
  environment: "production" | "staging" | "development";
  lastDeploymentId?: string;
}

// Deployment
type DeploymentStatus = "pending" | "in_progress" | "success" | "failed";

interface DeploymentStage {
  name: string;
  status: DeploymentStatus;
  duration?: number;
  logs: string[];
}

interface Deployment {
  id: string;
  projectId: string;
  version: string;
  status: DeploymentStatus;
  stages: DeploymentStage[];
  startedAt: string;
  totalDuration?: number;
  failureAnalysis?: {
    rootCause: string;
    recommendations: string[];
  };
}
```

### Mock Services (Server-side)

```typescript
// lib/mock/services/deployments.ts
export async function getDeployments(filters?: {
  status?: DeploymentStatus;
  environment?: string;
}) {
  await delay(300); // Simulate network
  return mockDeployments.filter(/* ... */);
}

export async function getDeployment(id: string) {
  await delay(200);
  return mockDeployments.find(d => d.id === id);
}

export async function startDeployment(projectId: string) {
  await delay(500);
  return { id: `deploy_${Date.now()}`, status: "in_progress" };
}
```

### Real-time Simulation (Client-side)

```typescript
// hooks/useDeploymentSimulation.ts
export function useDeploymentSimulation(deploymentId: string) {
  const [deployment, setDeployment] = useState<Deployment | null>(null);

  useEffect(() => {
    const stages = [
      { name: "Checkout", duration: 5000 },
      { name: "Dependencies", duration: 45000 },
      // ... 7 more
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage >= stages.length) {
        clearInterval(interval);
        return;
      }

      setDeployment(prev => ({
        ...prev,
        stages: updateStage(prev.stages, currentStage, "success")
      }));

      currentStage++;
    }, 1000);

    return () => clearInterval(interval);
  }, [deploymentId]);

  return deployment;
}
```

---

## 7. State Management

### Zustand (Client Global State)

```typescript
// store/auth.ts
interface AuthState {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (token, user) => set({ token, user }),
  logout: () => set({ token: null, user: null }),
}));

// store/ui.ts
interface UIState {
  scoreboardMode: "baseball" | "simple";
  setScoreboardMode: (mode: "baseball" | "simple") => void;
}
```

### Server Actions (Mutations)

```typescript
// app/actions/projects.ts
'use server'

export async function createProject(formData: FormData) {
  const data = {
    repository: formData.get("repository"),
    branch: formData.get("branch"),
    // ...
  };

  // Validation with Zod
  const validated = projectSchema.parse(data);

  // Mock creation
  const project = await mockProjectService.create(validated);

  revalidatePath("/dashboard");
  return { success: true, project };
}
```

---

## 8. Performance Targets

```yaml
Core Web Vitals:
  LCP: < 2.5s
  FID: < 100ms
  CLS: < 0.1

Bundle Size:
  Initial JS: < 200 KB
  Total: < 500 KB

Optimization:
  - Server Components (reduce JS)
  - next/image (auto optimization)
  - next/font (font optimization)
  - Code splitting (dynamic imports)
  - Static generation (when possible)
```

---

## 9. Accessibility (WCAG 2.1 AA)

```yaml
Color Contrast: 4.5:1 (normal), 3:1 (large)
Keyboard Nav: Tab order, focus indicators
Screen Reader: ARIA labels, semantic HTML
Responsive: Mobile first, 640px/768px/1024px
Touch Targets: 44x44px minimum
```

---

## 10. Development Roadmap

### Week 1-2: Foundation
- [ ] Next.js setup with TypeScript
- [ ] Tailwind + design system
- [ ] Mock data structure
- [ ] Basic components (Button, Card, Badge)

### Week 3-4: Core Pages (Server)
- [ ] Landing page
- [ ] Dashboard with mock data
- [ ] History page

### Week 5-6: Interactive Pages (Client)
- [ ] Project setup form
- [ ] Deploy monitor (scoreboard)
- [ ] Real-time simulation

### Week 7-8: Results & Polish
- [ ] Success/Failure views
- [ ] AI analysis display
- [ ] Performance optimization
- [ ] Accessibility audit

---

## 11. Component Library

### UI Components

```typescript
// components/ui/button.tsx
interface ButtonProps {
  variant: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
}

// components/ui/card.tsx
// Glassmorphism style
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// components/ui/code-block.tsx
// Developer Minimalism style
interface CodeBlockProps {
  code: string;
  language: string;
}
```

### Domain Components

```typescript
// components/dashboard/stats-card.tsx (Server)
// components/dashboard/project-card.tsx (Server)
// components/deploy/scoreboard.tsx (Client)
// components/deploy/log-viewer.tsx (Client)
// components/history/deployment-item.tsx (Server)
```

---

## 12. File Structure

```
sbht-bastion/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── deploy/
│   └── history/
├── lib/
│   ├── mock/
│   │   ├── data/
│   │   └── services/
│   ├── utils/
│   └── types/
├── hooks/
│   ├── useDeploymentSimulation.ts
│   └── useProjects.ts
├── store/
│   ├── auth.ts
│   └── ui.ts
└── public/
    └── assets/
```

---

## Appendix

### Key Differences from Vite + React

| Aspect | Vite + React | Next.js |
|--------|-------------|---------|
| Routing | React Router | File-based (App Router) |
| Data Fetching | React Query | Server Components + fetch |
| Optimization | Manual | Auto (images, fonts, bundles) |
| SSR | Manual setup | Built-in |
| Performance | Client-heavy | Server/Client balance |

### Migration Path (Future)
1. Phase 1: Mock data (current)
2. Phase 2: Connect to real API
3. Phase 3: Add authentication
4. Phase 4: Real-time SSE/WebSocket

---

**Document Version**: 2.0
**Last Updated**: 2025-11-18
