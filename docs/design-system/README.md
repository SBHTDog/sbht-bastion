# Deploy Monitor Design System

**재사용 가능한 UI/UX 디자인 시스템**

다른 웹 프로젝트에서도 사용할 수 있는 완전한 디자인 시스템 패키지

---

## 📦 포함된 파일

```
docs/design-system/
├── README.md                 # 이 파일 (시작 가이드)
├── DESIGN_SYSTEM.md          # 완전한 디자인 시스템 문서
├── COMPONENT_GUIDE.md        # 컴포넌트 스타일 가이드
├── design-tokens.json        # 디자인 토큰 (JSON 형식)
├── glassmorphism.css         # 재사용 가능한 Glassmorphism CSS
└── tailwind-preset.js        # Tailwind CSS 프리셋
```

---

## 🚀 빠른 시작

### 1. Tailwind CSS 프로젝트에 통합

#### Step 1: 파일 복사
```bash
# 프로젝트에 디자인 시스템 파일 복사
cp docs/design-system/tailwind-preset.js ./config/
cp docs/design-system/glassmorphism.css ./styles/
```

#### Step 2: Tailwind 설정
```js
// tailwind.config.js
import deployMonitorPreset from './config/tailwind-preset.js';

export default {
  presets: [deployMonitorPreset],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  // 추가 설정...
}
```

#### Step 3: CSS 임포트
```css
/* globals.css 또는 main CSS 파일 */
@import "tailwindcss";
@import "./glassmorphism.css";
```

---

### 2. 순수 CSS 프로젝트에 통합

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="glassmorphism.css">
  <style>
    /* 기본 스타일 */
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: #f8fafc;
    }
  </style>
</head>
<body>
  <div class="glass" style="padding: 2rem; max-width: 600px; margin: 2rem auto;">
    <h1>Glassmorphism Card</h1>
    <p>Beautiful glass effect with pure CSS!</p>
  </div>
</body>
</html>
```

---

### 3. React 컴포넌트로 사용

```bash
# 컴포넌트 복사
cp -r components/ui ./src/components/
```

```tsx
// App.tsx
import Button from './components/ui/button';
import Card from './components/ui/card';
import Modal from './components/ui/modal';

export default function App() {
  return (
    <Card>
      <h1>Hello World</h1>
      <Button variant="primary">Click Me</Button>
    </Card>
  );
}
```

---

## 🎨 주요 기능

### 1. Glassmorphism 효과
- 3가지 레벨: Light, Medium, Heavy
- 반투명 배경 + backdrop-blur
- 반응형 및 다크 모드 지원

### 2. 디자인 토큰
- JSON 형식으로 모든 디자인 값 정의
- 색상, 타이포그래피, 간격, 그림자 등
- 디자인 도구와 호환 가능

### 3. React 컴포넌트
- Button (5가지 variant)
- Badge (4가지 상태)
- Card (Glassmorphism)
- Modal (Enhanced Glass)
- Form Inputs

### 4. Tailwind 프리셋
- 완전한 테마 설정
- 커스텀 유틸리티 클래스
- 플러그인 통합

---

## 📖 사용 예시

### Glassmorphism Card
```html
<div class="glass p-6">
  <h3 class="text-xl font-bold mb-2">Card Title</h3>
  <p class="text-gray-600">Beautiful glassmorphism effect</p>
</div>
```

### Button
```jsx
<Button variant="primary" size="lg">
  Primary Button
</Button>
```

### Modal
```jsx
<Modal isOpen={true} onClose={handleClose} title="Modal Title">
  <p>Modal content here</p>
</Modal>
```

---

## 🎯 디자인 원칙

### 1. Glassmorphism
- 반투명 유리 효과
- 부드러운 블러 처리
- 우아한 테두리와 그림자

### 2. Developer Minimalism
- 깔끔한 플랫 컬러
- 코드 중심 디자인
- 최소한의 장식

### 3. Accessibility First
- WCAG 2.1 준수
- 키보드 네비게이션
- 색상 대비 4.5:1 이상

### 4. Responsive Design
- Mobile-first 접근
- 반응형 breakpoints
- 터치 친화적 UI

---

## 🌈 색상 팔레트

### Primary
```css
--primary-blue: #4a90e2
--primary-blue-light: #6bb6ff
--primary-blue-dark: #2e5f8f
```

### Semantic
```css
--success: #10b981
--error: #ef4444
--warning: #f59e0b
--info: #3b82f6
```

### Neutral
```css
--bg-white: #ffffff
--bg-light: #f8fafc
--text-dark: #1e293b
--text-gray: #64748b
```

---

## 📏 타이포그래피

### Font Families
- **Sans**: Inter, system fonts
- **Mono**: JetBrains Mono, Fira Code

### Font Scale (8px base)
```
xs:   12px (0.75rem)
sm:   14px (0.875rem)
base: 16px (1rem)
lg:   18px (1.125rem)
xl:   20px (1.25rem)
2xl:  24px (1.5rem)
4xl:  36px (2.25rem)
```

---

## 🔧 커스터마이징

### 색상 변경
```js
// tailwind-preset.js
colors: {
  'primary-blue': {
    DEFAULT: '#YOUR_COLOR', // 원하는 색상으로 변경
  }
}
```

### 폰트 변경
```js
// tailwind-preset.js
fontFamily: {
  sans: ['YourFont', '-apple-system', 'sans-serif'],
}
```

### Glass 효과 조정
```css
/* glassmorphism.css */
:root {
  --glass-blur-medium: 15px; /* 기본 10px → 15px */
}
```

---

## 🌐 브라우저 지원

### 필수 요구사항
- `backdrop-filter` 지원 (Chrome 76+, Safari 9+, Firefox 103+)
- CSS Grid & Flexbox
- CSS Custom Properties (CSS Variables)

### 폴백 제공
```css
@supports not (backdrop-filter: blur(1px)) {
  .glass {
    background: rgba(255, 255, 255, 0.95);
  }
}
```

---

## 📱 반응형 Breakpoints

```
xs: 480px   (Extra Small - Large Mobile)
sm: 640px   (Small - Tablet)
md: 768px   (Medium - Desktop)
lg: 1024px  (Large - Wide Desktop)
xl: 1280px  (Extra Large)
```

---

## 🎭 컴포넌트 카탈로그

| 컴포넌트 | Variants | 사용 사례 |
|---------|----------|---------|
| Button | 5 | Primary, Secondary, Ghost, Outline, Danger |
| Badge | 4 | Default, Success, Error, Warning |
| Card | 3 | Default, Hoverable, Interactive |
| Modal | 2 | Standard, Form |
| Input | 5 | Text, Select, Textarea, Checkbox, Radio |

---

## 📚 추가 문서

### 상세 가이드
- **DESIGN_SYSTEM.md**: 완전한 디자인 시스템 사양
- **COMPONENT_GUIDE.md**: 컴포넌트별 사용법 및 예시

### 디자인 토큰
- **design-tokens.json**: 머신 리더블 디자인 토큰

### 스타일시트
- **glassmorphism.css**: 재사용 가능한 CSS 유틸리티

---

## 🔗 외부 리소스

### Fonts
```html
<!-- Google Fonts에서 Inter 폰트 로드 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">

<!-- JetBrains Mono (코드용) -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap">
```

### CDN 사용 (순수 CSS)
```html
<!-- Tailwind CSS CDN (개발용) -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Glassmorphism CSS -->
<link rel="stylesheet" href="path/to/glassmorphism.css">
```

---

## 🎯 사용 시나리오

### 시나리오 1: 새 프로젝트
1. `tailwind-preset.js` 복사
2. Tailwind 설정에 프리셋 추가
3. `glassmorphism.css` 임포트
4. 컴포넌트 사용 시작

### 시나리오 2: 기존 프로젝트
1. `glassmorphism.css`만 복사
2. HTML에 클래스 적용
3. 필요시 CSS 변수 커스터마이징

### 시나리오 3: React 앱
1. `components/ui` 폴더 복사
2. 컴포넌트 import 후 사용
3. Props로 커스터마이징

---

## 💡 팁 & 트릭

### Performance
```css
/* GPU 가속 활용 */
.glass {
  will-change: transform;
  transform: translateZ(0);
}
```

### Accessibility
```jsx
/* ARIA 라벨 추가 */
<button aria-label="Close modal">×</button>
```

### Mobile Optimization
```css
/* 모바일에서 블러 강도 줄이기 */
@media (max-width: 768px) {
  .glass {
    backdrop-filter: blur(8px);
  }
}
```

---

## 🐛 문제 해결

### Glass 효과가 안 보임
```
→ backdrop-filter 브라우저 지원 확인
→ CSS 우선순위 확인 (!important 사용 고려)
→ 투명도 값 조정
```

### 모바일에서 성능 저하
```
→ 블러 강도 낮추기 (10px → 6px)
→ 애니메이션 비활성화 (prefers-reduced-motion)
→ 투명도 높이기 (0.25 → 0.4)
```

### Tailwind 클래스 충돌
```
→ 프리셋 순서 확인
→ 커스텀 클래스 네임스페이스 추가
→ !important 사용 (최후 수단)
```

---

## 📄 라이선스

MIT License - 자유롭게 사용 가능

---

## 🤝 기여

이 디자인 시스템을 개선하고 싶다면:
1. 이슈 제보
2. Pull Request 생성
3. 피드백 공유

---

## 📞 지원

문제가 발생하거나 질문이 있으시면:
- 문서 확인: DESIGN_SYSTEM.md
- 예시 확인: COMPONENT_GUIDE.md
- 토큰 참조: design-tokens.json

---

**Happy Designing! 🎨✨**
