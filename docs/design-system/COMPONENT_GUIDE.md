# Component Style Guide

재사용 가능한 UI 컴포넌트 스타일 가이드

---

## 📦 버튼 (Button)

### Variants

#### Primary
```jsx
<button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-all">
  Primary Button
</button>
```

**사용 사례**: 주요 액션, 폼 제출, 중요한 CTA

---

#### Secondary
```jsx
<button className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-all">
  Secondary Button
</button>
```

**사용 사례**: 보조 액션, 취소 버튼

---

#### Ghost
```jsx
<button className="bg-transparent text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-all">
  Ghost Button
</button>
```

**사용 사례**: 텍스트 링크, 최소한의 강조

---

#### Outline
```jsx
<button className="border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-all">
  Outline Button
</button>
```

**사용 사례**: 대안 액션, 강조가 필요한 보조 버튼

---

#### Danger
```jsx
<button className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition-all">
  Danger Button
</button>
```

**사용 사례**: 삭제, 파괴적 액션

---

### Sizes

#### Small
```jsx
<button className="px-3 py-1.5 text-sm rounded-lg">Small</button>
```

#### Medium (Default)
```jsx
<button className="px-4 py-2 text-sm rounded-lg">Medium</button>
```

#### Large
```jsx
<button className="px-6 py-3 text-base rounded-lg">Large</button>
```

---

### States

#### Disabled
```jsx
<button disabled className="opacity-50 cursor-not-allowed px-4 py-2 rounded-lg bg-blue-600 text-white">
  Disabled
</button>
```

#### Loading
```jsx
<button className="px-4 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2">
  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
  </svg>
  Loading...
</button>
```

---

### Full Component (TypeScript)

```tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled,
  type = 'button',
  className = ''
}: ButtonProps) {
  const baseStyles = 'rounded-lg font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-white border border-blue-600 text-blue-600 hover:bg-blue-50',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
    outline: 'border border-blue-600 text-blue-600 bg-white hover:bg-blue-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}
```

---

## 🏷️ 배지 (Badge)

### Variants

#### Default
```jsx
<span className="bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
  Default
</span>
```

#### Success
```jsx
<span className="bg-green-100 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-semibold">
  Success
</span>
```

#### Error
```jsx
<span className="bg-red-100 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-semibold">
  Error
</span>
```

#### Warning
```jsx
<span className="bg-yellow-100 text-yellow-700 border border-yellow-200 px-3 py-1 rounded-full text-xs font-semibold">
  Warning
</span>
```

---

### Full Component (TypeScript)

```tsx
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'error' | 'warning';
}

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-blue-100 text-blue-700 border border-blue-200',
    success: 'bg-green-100 text-green-700 border border-green-200',
    error: 'bg-red-100 text-red-700 border border-red-200',
    warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
}
```

---

## 🃏 카드 (Card)

### Basic Card

```jsx
<div className="glass p-6">
  <h3 className="text-xl font-bold mb-2 text-gray-800">Card Title</h3>
  <p className="text-gray-600">Card content goes here</p>
</div>
```

---

### Card with Header and Footer

```jsx
<div className="glass overflow-hidden">
  {/* Header */}
  <div className="border-b border-white/20 px-6 py-4 bg-white/10">
    <h3 className="text-xl font-bold text-gray-800">Card Header</h3>
  </div>

  {/* Body */}
  <div className="px-6 py-4">
    <p className="text-gray-600">Card content here</p>
  </div>

  {/* Footer */}
  <div className="border-t border-white/20 px-6 py-4 bg-white/10 flex justify-end gap-2">
    <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg">
      Action
    </button>
  </div>
</div>
```

---

### Hoverable Card

```jsx
<div className="glass p-6 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
  <h3 className="text-xl font-bold mb-2 text-gray-800">Hoverable Card</h3>
  <p className="text-gray-600">Hover to see effect</p>
</div>
```

---

### Full Component (TypeScript)

```tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export default function Card({ children, className = '', hoverable = false }: CardProps) {
  const hoverClass = hoverable ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer' : '';

  return (
    <div className={`glass p-6 transition-all ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}
```

---

## 🪟 모달 (Modal)

### Basic Modal

```jsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  {/* Backdrop */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-blue-900/30 backdrop-blur-md" />

  {/* Modal */}
  <div className="relative glass-modal w-full max-w-md max-h-[90vh] overflow-y-auto">
    {/* Close Button */}
    <button className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-gray-600">
      ×
    </button>

    {/* Header */}
    <div className="mb-6 pb-4 border-b border-white/20">
      <h2 className="text-2xl font-bold text-gray-800">Modal Title</h2>
    </div>

    {/* Body */}
    <div className="space-y-4">
      <p className="text-gray-600">Modal content here</p>
    </div>
  </div>
</div>
```

---

### Modal with Form

```jsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div className="absolute inset-0 glass-backdrop" onClick={handleClose} />

  <div className="relative glass-modal w-full max-w-lg">
    <button onClick={handleClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white">
      ×
    </button>

    <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign Up</h2>

    <form className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
      />
      <button type="submit" className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700">
        Submit
      </button>
    </form>
  </div>
</div>
```

---

### Full Component (TypeScript)

```tsx
'use client';

import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  // ESC key handler & body scroll lock
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-blue-900/30 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative glass-modal w-full max-w-md sm:max-w-lg md:max-w-xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 transition-all"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        {title && (
          <div className="mb-6 pb-4 border-b border-white/20">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 pr-10">{title}</h2>
          </div>
        )}

        {/* Body */}
        {children}
      </div>
    </div>
  );
}
```

---

## 📝 폼 입력 (Form Inputs)

### Text Input

```jsx
<input
  type="text"
  placeholder="Enter text"
  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
/>
```

---

### Select Dropdown

```jsx
<select className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all">
  <option value="">선택하세요</option>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</select>
```

---

### Textarea

```jsx
<textarea
  rows={4}
  placeholder="Enter description"
  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all resize-none"
/>
```

---

### Checkbox

```jsx
<label className="flex items-center gap-2 cursor-pointer">
  <input
    type="checkbox"
    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
  />
  <span className="text-sm text-gray-700">I agree to terms</span>
</label>
```

---

### Radio Button

```jsx
<label className="flex items-center gap-2 cursor-pointer">
  <input
    type="radio"
    name="option"
    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
  />
  <span className="text-sm text-gray-700">Option 1</span>
</label>
```

---

## 🎨 유틸리티 클래스

### Shadow Utilities
```css
.shadow-glass /* Glassmorphism shadow */
.shadow-sm     /* Small shadow */
.shadow-md     /* Medium shadow */
.shadow-lg     /* Large shadow */
```

### Border Utilities
```css
.border-blue   /* Blue border with opacity */
.rounded-lg    /* Large border radius */
.rounded-full  /* Full circle */
```

### Glassmorphism Utilities
```css
.glass         /* Default glass effect */
.glass-modal   /* Heavy glass for modals */
.dev-minimal   /* Dark code block style */
```

### Animation Utilities
```css
.animate-fadeIn   /* Fade in animation */
.animate-slideUp  /* Slide up animation */
.animate-blob     /* Blob animation */
```

---

## 📱 반응형 패턴

### Responsive Grid
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>
```

### Responsive Padding
```jsx
<div className="p-4 sm:p-6 md:p-8">
  {/* Content */}
</div>
```

### Responsive Typography
```jsx
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
  Responsive Heading
</h1>
```

### Responsive Flex
```jsx
<div className="flex flex-col sm:flex-row gap-4">
  {/* Items */}
</div>
```

---

## 🎯 사용 권장사항

### 버튼
- Primary: 페이지당 1개 권장
- 중요도에 따라 variant 선택
- 파괴적 액션은 항상 Danger 사용

### 배지
- 상태 표시에 적합
- 짧은 텍스트 (1-2 단어)
- 색상은 semantic 의미와 일치

### 카드
- 관련 정보 그룹화
- padding은 6 (24px) 권장
- hover 효과는 클릭 가능한 경우만

### 모달
- 중요한 액션/정보만 사용
- ESC 키로 닫기 지원 필수
- 모바일에서는 전체 화면 고려

---

## 🔧 접근성 체크리스트

- [ ] 키보드 네비게이션 지원
- [ ] ARIA 라벨 추가
- [ ] 색상 대비 4.5:1 이상
- [ ] Focus 상태 명확히 표시
- [ ] 스크린 리더 호환성
- [ ] 터치 타겟 최소 44x44px

---

## 📚 추가 자료

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Accessibility](https://react.dev/learn/accessibility)
