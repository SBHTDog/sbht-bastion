# Deploy Monitor - 기능 가이드

재사용 가능한 기능 패턴 모음

---

## 🔐 인증 시스템

### Dual Auth (NextAuth + Mock)
```tsx
// contexts/AuthContext.tsx - NextAuth GitHub OAuth
// contexts/MockAuthContext.tsx - localStorage Mock 인증

// 사용법
const auth = useAuth();           // NextAuth
const mockAuth = useMockAuth();   // Mock

// Hybrid 사용 (둘 중 하나라도 인증되면 OK)
const isLoggedIn = auth.isAuthenticated || mockAuth.isAuthenticated;
```

### Protected Route
```tsx
// 인증 가드
<ProtectedRoute>
  <YourPage />
</ProtectedRoute>

// 로딩 중 → 스피너 표시
// 미인증 → /auth/login 리다이렉트
// 인증됨 → 페이지 렌더
```

---

## 🎨 모달 시스템

### 기본 모달
```tsx
const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="제목">
  <div>내용</div>
</Modal>

// 기능:
// - ESC 키로 닫기
// - 외부 클릭으로 닫기
// - body 스크롤 잠금
// - 애니메이션 (fadeIn + slideUp)
```

### 2단계 모달 (CreateProjectModal)
```tsx
const [step, setStep] = useState(1);

// Step 1: 항목 선택 (GitHub Repo)
// Step 2: 설정 입력 (이름, 브랜치, 환경)
// Progress Indicator: 1/2, 2/2

handleNext();  // 다음 단계
handleBack();  // 이전 단계
```

---

## ⚾ 야구 스코어보드 배포 UI

### 실시간 진행 표시
```tsx
// 9단계 → 5회 x 2이닝(초/말)
const stages = [
  { name: "Checkout", duration: 2000 },
  { name: "Test", duration: 4000, failChance: 0.3 },
  // ...
];

// 상태: pending → in_progress → success/failed
// 시각화: 야구 스코어보드 그리드 + 진행률 바
```

### 야구 중계 문구
```tsx
const [commentary, setCommentary] = useState("");

// 단계별 중계 문구
"⚾ 1회 초, Checkout이 마운드에 오릅니다!"
"🔥 Test, 풀카운트 승부 중입니다..."
"🏆 게임셋! 완봉승! 홈런급 배포 성공!"
```

---

## 🎉 배포 결과 화면

### 성공 시
```tsx
// 1. Confetti 애니메이션 (3방향)
confetti({
  particleCount: 100,
  spread: 70,
  origin: { x: 0.1, y: 0.6 },
  colors: ["#10b981", "#22c55e", "#86efac"]
});

// 2. AWS 배포 정보 표시
- ECS Task Definition (Revision, Service, Cluster)
- CodeDeploy Status (ID, Deploy Group, Progress)
- Blue/Green 배포 진행률

// 3. 액션
- "프로젝트로 돌아가기"
- "상세 리포트 보기"
```

### 실패 시
```tsx
// 1. 실패 분석
{
  failedStage: "Test",
  summary: "테스트 2개 실패...",
  suggestions: ["Header.test.tsx 업데이트", "환경변수 확인", ...]
}

// 2. 에러 로그 (dev-minimal 스타일)
<div className="dev-minimal">
  [ERROR] Test suite failed...
  Expected: "Deploy Monitor"
  Received: "Deploy Monitor Beta"
</div>

// 3. 액션
- "🔄 다시 시도" (onRetry 콜백)
- "프로젝트로 돌아가기"
```

---

## 📊 Mock 데이터 패턴

### 헬퍼 함수
```typescript
// lib/mockData.ts

export function findUserById(id: string): User | undefined
export function getProjectsByUserId(userId: string): Project[]
export function getDeploymentsByProjectId(projectId: string): Deployment[]
export function getDeploymentDetail(deployId: string): DeploymentDetail
export function searchRepos(query: string): GitHubRepo[]

// 사용 예시
const user = findUserById("user-1");
const projects = getProjectsByUserId(user.id);
const deployments = getDeploymentsByProjectId("proj-1");
```

### 타입 안정성
```typescript
// lib/types.ts - 20+ interfaces

interface Deployment {
  id: string;
  status: DeploymentStatus;
  stages: DeploymentStage[];
  // ...
}

// Debug 헬퍼
export function debugLog(context: string, message: string, data?: any)
```

---

## 🔄 실시간 시뮬레이션

### 타이머 기반 진행
```tsx
const [currentStage, setCurrentStage] = useState(0);

useEffect(() => {
  const timer = setTimeout(() => {
    // 실패 시뮬레이션 (30% 확률)
    const failed = stage.failChance && Math.random() < stage.failChance;

    if (failed) {
      setDeployStatus("failed");
      // 후속 단계 스킵
    } else {
      setCurrentStage(prev => prev + 1);
    }
  }, stage.duration);

  return () => clearTimeout(timer);
}, [currentStage]);
```

### 로그 스트리밍
```tsx
const [logs, setLogs] = useState<string[]>([]);

setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✅ ${stage.name} 완료`]);

// 자동 스크롤
<div className="overflow-y-auto h-64">
  {logs.map((log, i) => <div key={i}>{log}</div>)}
</div>
```

---

## 🎯 상태 관리 패턴

### Context + localStorage
```tsx
// MockAuthContext.tsx

const [user, setUser] = useState<User | null>(null);

// 초기화 시 복원
useEffect(() => {
  const stored = localStorage.getItem("mockUser");
  if (stored) setUser(JSON.parse(stored));
}, []);

// 로그인 시 저장
const login = (username: string) => {
  setUser(userData);
  localStorage.setItem("mockUser", JSON.stringify(userData));
};

// 로그아웃
const logout = () => {
  setUser(null);
  localStorage.removeItem("mockUser");
};
```

### Next.js 세션 (NextAuth)
```tsx
// AuthContext.tsx

const { data: session, status } = useSession();

const authState = {
  user: session?.user ? mapToUser(session.user) : null,
  isAuthenticated: !!session,
  isLoading: status === "loading"
};

const logout = () => signOut({ callbackUrl: "/" });
```

---

## 📱 반응형 패턴

### 모바일 우선 UI
```tsx
// Modal 반응형 padding
<div className="p-4 sm:p-6 md:p-8">

// Grid 반응형
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

// Typography 반응형
<h1 className="text-2xl sm:text-3xl md:text-4xl">

// 조건부 레이아웃
<div className="flex flex-col sm:flex-row gap-4">
```

---

## 🔍 검색 & 필터링

### 실시간 검색
```tsx
const [query, setQuery] = useState("");
const filtered = searchRepos(query);

<input
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  placeholder="레포 검색..."
/>

{filtered.map(item => <Item key={item.id} {...item} />)}
```

### 다중 조건 필터
```typescript
// mockData.ts
export function searchRepos(query: string): GitHubRepo[] {
  return repos.filter(repo =>
    repo.name.toLowerCase().includes(query) ||
    repo.description.toLowerCase().includes(query) ||
    repo.language.toLowerCase().includes(query)
  );
}
```

---

## 🎨 애니메이션 패턴

### 진입 애니메이션
```tsx
const [show, setShow] = useState(false);

useEffect(() => {
  setTimeout(() => setShow(true), 100);
}, []);

<div className={`transition-all duration-1000 ${
  show ? "scale-100 opacity-100" : "scale-95 opacity-0"
}`}>
```

### 조건부 애니메이션
```tsx
// 성공 시 바운스
{status === "success" && (
  <div className="animate-bounce">✓</div>
)}

// 진행 중 펄스
{status === "in_progress" && (
  <div className="animate-pulse">▶</div>
)}
```

---

## 🎯 Form 핸들링

### 다단계 Form
```tsx
const [step, setStep] = useState(1);
const [formData, setFormData] = useState({
  name: "",
  branch: "main",
  environment: "production"
});

const handleNext = () => {
  if (validateStep1()) setStep(2);
};

const handleSubmit = () => {
  // API 호출 또는 Mock 생성
  createProject(formData);
};
```

### Controlled Input
```tsx
<input
  type="text"
  value={projectName}
  onChange={(e) => setProjectName(e.target.value)}
/>

<select
  value={environment}
  onChange={(e) => setEnvironment(e.target.value as Environment)}
>
```

---

## 🚀 네비게이션 패턴

### Next.js Router
```tsx
import { useRouter } from "next/navigation";

const router = useRouter();

// 프로그래밍 방식 이동
router.push("/dashboard");
router.push(`/project/${id}`);
router.refresh(); // 페이지 새로고침

// Link 컴포넌트
<Link href="/dashboard">
  <Button>Go to Dashboard</Button>
</Link>
```

### 조건부 리다이렉트
```tsx
useEffect(() => {
  if (!isAuthenticated && !isLoading) {
    router.push("/auth/login");
  }
}, [isAuthenticated, isLoading]);
```

---

## 📊 통계 계산

### 집계 함수
```typescript
// Dashboard 통계
const totalDeploys = projects.reduce((sum, p) => sum + p.deployCount, 0);
const avgSuccessRate = projects.reduce((sum, p) => sum + p.successRate, 0) / projects.length;

// 배포 성공률
const successCount = stages.filter(s => s.status === "success").length;
const failureRate = (failedTests / totalTests) * 100;
```

---

## 🎨 조건부 스타일링

### 상태별 스타일
```tsx
<div className={`
  border-4
  ${status === "success"
    ? "border-green-500 bg-green-50"
    : "border-red-500 bg-red-50"
  }
`}>

<Badge variant={
  project.status === "healthy" ? "success" :
  project.status === "failed" ? "error" :
  "warning"
}>
```

---

## 🔧 재사용 가능한 Hooks

### useDebounce (검색 최적화)
```tsx
const [query, setQuery] = useState("");
const debouncedQuery = useDebounce(query, 300);

useEffect(() => {
  // API 호출
  search(debouncedQuery);
}, [debouncedQuery]);
```

### useLocalStorage
```tsx
const [user, setUser] = useLocalStorage<User>("user", null);

// 자동으로 localStorage 동기화
setUser(newUser); // → localStorage.setItem("user", JSON.stringify(newUser))
```

---

## 📦 컴포넌트 조합 패턴

### Compound Components
```tsx
<Card>
  <Card.Header>
    <h3>Title</h3>
  </Card.Header>
  <Card.Body>
    Content
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

### Render Props
```tsx
<DataFetcher url="/api/projects">
  {({ data, loading, error }) => (
    loading ? <Spinner /> :
    error ? <Error /> :
    <ProjectList projects={data} />
  )}
</DataFetcher>
```

---

## 🎯 핵심 패턴 요약

| 패턴 | 파일 | 용도 |
|-----|------|------|
| Dual Auth | `contexts/AuthContext.tsx`, `MockAuthContext.tsx` | NextAuth + Mock 하이브리드 |
| Protected Route | `components/auth/ProtectedRoute.tsx` | 인증 가드 |
| 2단계 Modal | `components/modals/CreateProjectModal.tsx` | 복잡한 입력 플로우 |
| 실시간 시뮬레이션 | `app/project/[id]/deploy/page.tsx` | 타이머 기반 진행 |
| 배포 결과 | `components/deploy/DeployResult.tsx` | 성공/실패 분석 + Confetti |
| Mock 데이터 | `lib/mockData.ts` | 헬퍼 함수 + 타입 안전성 |
| Debug 로깅 | `lib/types.ts` | 개발 모드 디버깅 |

---

**재사용 팁**: 각 패턴은 독립적으로 추출 가능. Props 인터페이스와 타입 정의만 복사하면 어디서든 사용 가능.
