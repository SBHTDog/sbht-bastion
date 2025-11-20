# 🧪 테스트 플로우 가이드

## 📋 전체 서비스 플로우 테스트

### ✅ 준비 사항
```bash
npm run dev
# 또는
yarn dev
```

서버 실행 후 http://localhost:3000 접속

---

## 🔄 완전한 테스트 시나리오

### 1️⃣ 랜딩 페이지 (`/`)
- [x] "GitHub으로 시작하기" 버튼 확인
- [x] 버튼 클릭 → `/auth/login`으로 이동

### 2️⃣ 로그인 (`/auth/login`)
- [x] 테스트 계정 3개 표시 확인
- [x] 계정 선택: **김철수 (@kimcs)** 선택
- [x] "GitHub으로 로그인" 버튼 클릭
- [x] 1초 로딩 후 → `/dashboard`로 이동

**디버깅 확인:**
```javascript
// 브라우저 콘솔에서 확인
// [DEBUG][AuthContext] Login successful
// localStorage에 사용자 정보 저장됨
```

### 3️⃣ 대시보드 (`/dashboard`)
- [x] "안녕하세요, 김철수님!" 표시 확인
- [x] 통계 카드 3개 확인 (Total Deploys, Success Rate, Projects)
- [x] 프로젝트 2개 표시 확인 (frontend-app, api-server)
- [x] "+ 새 프로젝트" 버튼 확인

**프로젝트 선택 테스트:**
- [x] "frontend-app" → "상세" 버튼 클릭

### 4️⃣ 프로젝트 상세 (`/project/proj-1`)
- [x] 프로젝트 이름, 상태 배지 확인
- [x] Repository 정보 확인
- [x] 통계 3개 확인 (Total Deploys, Success Rate, Last Deploy)
- [x] "🚀 배포 시작" 버튼 클릭

### 5️⃣ 배포 진행 (`/project/proj-1/deploy`)
- [x] 9개 스테이지 그리드 표시 확인
- [x] 진행률 바 애니메이션 확인
- [x] 로그 실시간 업데이트 확인 (약 60초 소요)
- [x] 스테이지별 상태 변화 확인:
  - Checkout (5초)
  - Dependencies (8초)
  - Lint (3초)
  - Test (10초)
  - Build (15초)
  - Security Scan (5초)
  - Push ECR (3초)
  - Deploy (8초)
  - Health Check (3초)
- [x] 완료 후 "🎉 배포 완료!" 메시지
- [x] 3초 후 자동으로 리포트 페이지로 이동

**디버깅 확인:**
```javascript
// 콘솔 확인
// [DEBUG][Deploy] Stage started { stage: 'Checkout' }
// [DEBUG][Deploy] Stage started { stage: 'Dependencies' }
// ...
// [DEBUG][Deploy] Deployment complete
```

### 6️⃣ 배포 리포트 - 성공 케이스 (`/project/proj-1/reports/deploy-1`)
- [x] 상태 배지 "success" 확인
- [x] **🤖 AI 분석** 섹션 확인:
  - 요약 메시지 확인
  - 최적화 제안 3개 확인
- [x] **⏱️ Job별 소요 시간** 확인:
  - checkout: 5s
  - dependencies: 45s
  - lint: 12s
  - test: 1m 8s
  - build: 1m 20s
- [x] **📤 링크 복사** 버튼 클릭 → alert 확인

### 7️⃣ 배포 리포트 - 실패 케이스 (`/project/proj-3/reports/deploy-3`)

**접근 방법:**
1. Dashboard로 돌아가기
2. URL 직접 입력: `http://localhost:3000/project/proj-3/reports/deploy-3`

**확인 사항:**
- [x] 상태 배지 "failed" 확인
- [x] **🤖 AI 분석**:
  - 실패 원인 요약 (빨간색 박스)
  - 개선 방안 5개 확인
- [x] **🧪 테스트 결과**:
  - 전체: 42 / 통과: 39 / 실패: 3
  - 실패한 테스트 3개 상세 확인
- [x] **🛡️ 보안 스캔 (Trivy)**:
  - High: 3개
  - Medium: 12개
  - 취약점 상세 (CVE 번호, 패키지, 버전)

### 8️⃣ 온보딩 플로우 (`/onboarding`)

**접근:** Dashboard → "+ 새 프로젝트"

- [x] GitHub 레포지토리 목록 5개 확인
- [x] 검색 기능 테스트: "app" 입력 → 필터링 확인
- [x] 레포 선택: "design-system" 클릭 → 파란색 하이라이트
- [x] "다음 →" 버튼 클릭

### 9️⃣ 프로젝트 생성 (`/project/new`)
- [x] Repository 정보 확인
- [x] 프로젝트 이름 수정 가능 확인
- [x] 브랜치 선택 (main/develop/staging)
- [x] 배포 환경 선택 (Development/Staging/Production)
- [x] "프로젝트 생성" 클릭 → alert 확인
- [x] Dashboard로 리다이렉트 확인

### 🔟 로그아웃
- [x] Dashboard 우측 상단 "Logout" 클릭
- [x] `/auth/login`으로 리다이렉트 확인
- [x] localStorage 초기화 확인

---

## 🐛 디버깅 체크리스트

### 브라우저 콘솔 확인
```javascript
// 예상되는 로그들:
[DEBUG][AuthContext] Initializing auth state
[DEBUG][AuthContext] Login attempt { username: 'kimcs' }
[DEBUG][AuthContext] Login successful
[DEBUG][Dashboard] User projects loaded { count: 2 }
[DEBUG][ProjectDetail] Loading project { projectId: 'proj-1' }
[DEBUG][Deploy] Stage started { stage: 'Checkout' }
[DEBUG][Deploy] Deployment complete
[DEBUG][DeployReport] Loading report { projectId: 'proj-1', deployId: 'deploy-1' }
```

### localStorage 확인
```javascript
// 개발자 도구 > Application > Local Storage
// Key: sbht_auth_user
// Value: { id, name, email, avatar, githubUsername, createdAt }
```

### Network 탭 확인
- API 호출 없음 (목 데이터)
- 페이지 전환만 확인

---

## ⚡ 빠른 테스트 경로

### 최단 경로 (1분)
```
/ → /auth/login (kimcs 선택) → /dashboard →
/project/proj-1 → /project/proj-1/deploy (60초 대기) →
/project/proj-1/reports/deploy-1
```

### 전체 플로우 (5분)
```
/ → /auth/login → /dashboard → /onboarding →
/project/new → /dashboard → /project/proj-1 →
/project/proj-1/deploy → /project/proj-1/reports/deploy-1 →
/project/proj-3/reports/deploy-3 (URL 직접) → Logout
```

---

## 🎯 주요 기능 체크

| 기능 | 경로 | 확인 사항 |
|------|------|-----------|
| GitHub 로그인 | `/auth/login` | 목 데이터 3명 선택 가능 |
| 레포 선택 | `/onboarding` | 5개 레포, 검색 기능 |
| 프로젝트 설정 | `/project/new` | 이름, 브랜치, 환경 선택 |
| 배포 시작 | `/project/[id]` | 배포 버튼 → 진행 페이지 |
| 실시간 진행 | `/project/[id]/deploy` | 9개 스테이지, 로그 스트리밍 |
| AI 분석 | `/project/[id]/reports/[deployId]` | LLM 요약, 개선 제안 |
| 성공 분석 | `deploy-1` | Job별 시간, 통계 |
| 실패 분석 | `deploy-3` | 테스트, Trivy, 린트 결과 |
| 공유 | 리포트 페이지 | 링크 복사 기능 |

---

## 🚨 알려진 제한사항

1. **목 데이터**: 실제 GitHub API, LLM API, AWS API 연결 없음
2. **배포 시뮬레이션**: 타이머 기반, 실제 파이프라인 없음
3. **프로젝트 생성**: 실제로 데이터가 추가되지 않음 (새로고침 시 사라짐)
4. **공유 링크**: 복사만 가능, 실제 공유 기능 없음

---

## ✅ 성공 기준

모든 페이지가 에러 없이 렌더링되고:
- ✅ 로그인 → 대시보드 플로우 작동
- ✅ 프로젝트 생성 플로우 작동
- ✅ 배포 시뮬레이션 작동 (60초)
- ✅ 리포트 페이지 (성공/실패) 렌더링
- ✅ 디버그 로그 출력
- ✅ Glassmorphism 효과 적용

**테스트 완료!** 🎉
