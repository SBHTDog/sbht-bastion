# Deploy Monitor Design System

재사용 가능한 UI/UX 디자인 시스템 가이드

---

## 📐 디자인 철학

### Core Principles
1. **Glassmorphism**: 반투명 유리 효과와 backdrop blur
2. **Developer Minimalism**: 깔끔한 플랫 컬러와 코드 중심 디자인
3. **Accessibility First**: WCAG 2.1 준수, 명확한 시각적 계층
4. **Responsive Design**: Mobile-first 접근

---

## 🎨 Color Palette

### Primary Colors
```css
--primary-blue: #4a90e2;
--primary-blue-light: #6bb6ff;
--primary-blue-dark: #2e5f8f;
```

### Neutral Colors
```css
--bg-white: #ffffff;
--bg-light: #f8fafc;
--bg-gray: #f1f5f9;
```

### Text Colors
```css
--text-dark: #1e293b;
--text-gray: #64748b;
--text-light: #94a3b8;
```

### Semantic Colors
```css
--success: #10b981;
--error: #ef4444;
--warning: #f59e0b;
--info: #3b82f6;
```

### Code & Developer
```css
--code-bg: #0f172a;
--code-text: #e2e8f0;
```

---

## 🔤 Typography

### Font Families
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Font Scales
| Size | Class | Pixels | Usage |
|------|-------|--------|-------|
| xs | text-xs | 12px | Captions, labels |
| sm | text-sm | 14px | Body text, buttons |
| base | text-base | 16px | Default body |
| lg | text-lg | 18px | Subtitles |
| xl | text-xl | 20px | Section headers |
| 2xl | text-2xl | 24px | Page titles |
| 4xl | text-4xl | 36px | Hero headings |

### Font Weights
- **Regular**: 400 (body text)
- **Medium**: 500 (UI elements)
- **Semibold**: 600 (subheadings)
- **Bold**: 700 (headings, emphasis)

---

## 📏 Spacing System

8px 기반 스케일:

| Token | Value | Usage |
|-------|-------|-------|
| 0.5 | 2px | Borders, dividers |
| 1 | 4px | Tight spacing |
| 2 | 8px | Component padding |
| 3 | 12px | Small gaps |
| 4 | 16px | Default spacing |
| 6 | 24px | Medium gaps |
| 8 | 32px | Large gaps |
| 12 | 48px | Section spacing |
| 16 | 64px | Hero spacing |

---

## 🌐 Breakpoints

```css
/* Mobile First */
sm: 640px   /* Tablet */
md: 768px   /* Desktop */
lg: 1024px  /* Large Desktop */
xl: 1280px  /* Extra Large */
```

---

## 🎯 Component Patterns

### 1. Glassmorphism Card

**Visual Properties**:
- Background: `rgba(255, 255, 255, 0.25)`
- Backdrop Filter: `blur(10px)`
- Border: `1px solid rgba(255, 255, 255, 0.18)`
- Border Radius: `16px`
- Shadow: Soft, layered shadows

**Usage**:
```jsx
<div className="glass p-6">
  Content
</div>
```

**CSS**:
```css
.glass {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.08);
}
```

---

### 2. Modal (Enhanced Glassmorphism)

**Visual Properties**:
- Background: Gradient white with high opacity
- Backdrop Filter: `blur(20px) saturate(150%)`
- Max Width: `600px` (responsive)
- Backdrop: Gradient overlay with blur

**Features**:
- ESC key to close
- Click outside to dismiss
- Body scroll lock
- Smooth animations

---

### 3. Button Variants

#### Primary
```css
bg-blue-600 text-white hover:bg-blue-700
```

#### Secondary
```css
bg-white border border-blue-600 text-blue-600 hover:bg-blue-50
```

#### Ghost
```css
bg-transparent text-gray-600 hover:bg-gray-100
```

#### Outline
```css
border border-blue-600 text-blue-600 bg-white hover:bg-blue-50
```

#### Danger
```css
bg-red-600 text-white hover:bg-red-700
```

**Sizes**:
- `sm`: `px-3 py-1.5 text-sm`
- `md`: `px-4 py-2 text-sm`
- `lg`: `px-6 py-3 text-base`

---

### 4. Badge Variants

#### Default
```css
bg-blue-100 text-blue-700 border border-blue-200
```

#### Success
```css
bg-green-100 text-green-700 border border-green-200
```

#### Error
```css
bg-red-100 text-red-700 border border-red-200
```

#### Warning
```css
bg-yellow-100 text-yellow-700 border border-yellow-200
```

**Base Style**:
```css
px-3 py-1 rounded-full text-xs font-semibold
```

---

## ✨ Effects & Animations

### Animations

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
```

#### Slide Up
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.animate-slideUp {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
```

#### Blob (Background)
```css
@keyframes blob {
  0%, 100% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}
.animate-blob {
  animation: blob 7s infinite;
}
```

---

### Hover Effects

#### Card Lift
```css
.glass:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
}
```

#### Button Press
```css
button:active {
  transform: scale(0.98);
}
```

---

## 🎨 Glassmorphism Techniques

### Level 1: Light Glass (Cards)
```css
background: rgba(255, 255, 255, 0.25);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.18);
```

### Level 2: Heavy Glass (Modals)
```css
background: linear-gradient(135deg,
  rgba(255, 255, 255, 0.95),
  rgba(255, 255, 255, 0.9));
backdrop-filter: blur(20px) saturate(150%);
border: 1px solid rgba(255, 255, 255, 0.6);
```

### Level 3: Navigation Bar
```css
background: rgba(255, 255, 255, 0.9);
backdrop-filter: blur(8px);
border-bottom: 1px solid rgba(0, 0, 0, 0.1);
```

---

## 🖼️ Layout Patterns

### Container
```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}
```

### Grid Systems
```css
/* 2-column responsive */
grid-cols-1 md:grid-cols-2

/* 3-column responsive */
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3

/* Auto-fit cards */
grid-cols-[repeat(auto-fit,minmax(300px,1fr))]
```

### Flexbox Patterns
```css
/* Center everything */
flex items-center justify-center

/* Space between */
flex justify-between items-center

/* Vertical stack */
flex flex-col gap-4
```

---

## 🎭 Theme Variations

### Light Theme (Default)
- Background: White gradients
- Text: Dark gray
- Cards: Light glass

### Dark Theme (Code Blocks)
```css
.dev-minimal {
  background: #0f172a;
  color: #e2e8f0;
  font-family: var(--font-mono);
  border-radius: 8px;
  padding: 1rem;
}
```

---

## 📱 Responsive Design Patterns

### Mobile First Approach
```css
/* Base: Mobile */
.modal { padding: 1.5rem; }

/* Tablet */
@media (min-width: 640px) {
  .modal { padding: 2rem; }
}

/* Desktop */
@media (min-width: 768px) {
  .modal { padding: 2.5rem; }
}
```

### Responsive Typography
```jsx
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
  Responsive Heading
</h1>
```

---

## 🧩 Component Composition

### Layering Order (z-index)
```css
z-0:  Background layers
z-10: Content layers
z-20: Floating elements
z-30: Dropdowns
z-40: Sticky headers
z-50: Modals
```

### Shadow System
```css
/* Small */
shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)

/* Medium */
shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)

/* Large */
shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)

/* Glass */
shadow-glass: 0 8px 32px rgba(74, 144, 226, 0.1)
```

---

## 🔧 Custom Scrollbar

```css
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(74, 144, 226, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(74, 144, 226, 0.5);
}
```

---

## 🎯 Accessibility Guidelines

### Color Contrast
- Text on white: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- Interactive elements: Minimum 3:1 ratio

### Focus States
```css
focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
```

### ARIA Labels
```jsx
<button aria-label="Close modal">×</button>
```

### Keyboard Navigation
- ESC to close modals
- Tab navigation support
- Enter/Space for buttons

---

## 📦 Usage Examples

### Complete Card Component
```jsx
<div className="glass p-6 hover:shadow-lg transition-all">
  <h3 className="text-xl font-bold mb-2 text-gray-800">
    Card Title
  </h3>
  <p className="text-gray-600 mb-4">
    Card description
  </p>
  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
    Action
  </button>
</div>
```

### Modal with Form
```jsx
<Modal isOpen={true} onClose={handleClose} title="Form Title">
  <form className="space-y-4">
    <input
      type="text"
      className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      placeholder="Enter text"
    />
    <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg">
      Submit
    </button>
  </form>
</Modal>
```

---

## 🚀 Implementation Notes

### Tailwind CSS v4
이 디자인 시스템은 Tailwind CSS v4와 완벽하게 호환됩니다.

### Browser Support
- Chrome/Edge: 최신 2개 버전
- Firefox: 최신 2개 버전
- Safari: 최신 2개 버전
- backdrop-filter 지원 필수

### Performance
- CSS-in-JS 대신 Tailwind 사용으로 빌드 최적화
- Glassmorphism은 GPU 가속 활용
- 애니메이션은 transform/opacity만 사용

---

## 📚 Additional Resources

- Tailwind CSS Documentation: https://tailwindcss.com
- Glassmorphism Generator: https://glassmorphism.com
- Color Contrast Checker: https://webaim.org/resources/contrastchecker
