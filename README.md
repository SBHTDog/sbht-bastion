# Deploy Monitor

CI/CD 배포 모니터링 & 분석 플랫폼 (100% Mock Data)

## 빠른 시작

```bash
npm install
npm run dev
```

http://localhost:3000 접속

## 기술 스택

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS v4
- PostgreSQL (미연결, Mock Data 사용)

## 주요 기능

### 1. 랜딩 페이지 (`/`)
- "시작하기" 버튼 → 로그인 모달

### 2. 로그인 모달
- 테스트 계정 선택 (김철수, 이영희, 박민수)
- localStorage 세션 유지

### 3. 대시보드 (`/dashboard`)
- 프로젝트 목록 (카드 형식)
- "+ 새 프로젝트" → 프로젝트 생성 모달
- 각 프로젝트 클릭 → 프로젝트 상세

### 4. 프로젝트 생성 모달
- **Step 1**: GitHub 레포 검색 & 선택
- **Step 2**: 프로젝트 이름, 브랜치, 환경 설정

### 5. 프로젝트 상세 (`/project/[id]`)
- 최근 배포 히스토리 (3개)
- "배포 시작" 버튼 → 실시간 배포 페이지
- 각 배포 클릭 → 상세 리포트

### 6. 배포 진행 (`/project/[id]/deploy`)
- **야구 전광판 스코어보드 스타일**
- 9단계 (1회 초 ~ 5회 초): Checkout → Dependencies → Lint → Test → Build → Security → Push → Deploy → Health Check
- 실시간 로그 출력
- 60초 시뮬레이션 후 자동 리포트 이동

### 7. 배포 리포트 (`/project/[id]/reports/[deployId]`)
- LLM 분석 결과
- Trivy 보안 스캔
- 테스트 결과 (통과/실패)
- Lint 경고
- 성공/실패 상태별 분석

### 8. 배포 히스토리 (`/history`)
- 전체 배포 목록
- 시간, 상태, 브랜치 필터링

## 디자인 시스템

**Glassmorphism + Developer Minimalism**

- 플랫 컬러 (#4a90e2)
- backdrop-blur, 반투명 배경
- 모달 기반 UX (페이지 전환 없음)
- 반응형 디자인 (sm/md/lg)

## 프로젝트 구조

```
lib/
  ├─ types.ts          # 타입 정의 + debugLog
  └─ mockData.ts       # Mock 데이터 (users, repos, projects, deployments)

contexts/
  └─ AuthContext.tsx   # 인증 상태 관리

components/
  ├─ ui/               # 공통 컴포넌트
  └─ modals/           # 로그인, 프로젝트 생성 모달

app/
  ├─ page.tsx          # 랜딩
  ├─ dashboard/        # 대시보드
  ├─ history/          # 히스토리
  └─ project/[id]/     # 프로젝트 상세, 배포, 리포트
```

## 테스트 시나리오

1. 랜딩 → "시작하기"
2. 로그인 모달 → 계정 선택
3. 대시보드 → "+ 새 프로젝트"
4. 레포 검색/선택 → 프로젝트 생성
5. 프로젝트 카드 클릭 → "배포 시작"
6. 야구 스코어보드 배포 진행 (60초)
7. 자동 이동 → 상세 리포트 확인

## 디버깅

`lib/types.ts`의 `DEBUG_MODE`로 콘솔 로그 활성화
