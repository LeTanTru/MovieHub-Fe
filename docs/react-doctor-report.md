# React Doctor Diagnostic Report

## Overview

This report contains the results from scanning the changed files on the `tru_dev` branch.

- **Score:** 55 / 100 (Critical)
- **Total Issues:** 288

## Issue Breakdown (Changed Files on tru_dev)

### 🛡️ Security

**0 issues**

- Great job! No security issues were detected in the changed files.

### 🐛 Bugs

**7 errors, 60 warnings**

- **Errors:**
  - Array index used as a key in mapping.
  - State synced to a prop inside an effect (`no-adjust-state-on-prop-change`).
- **Warnings:**
  - Missing effect dependencies.
  - Derived state stored in an effect instead of being computed during render.
  - `redirect()` inside `try-catch` blocks getting swallowed.
  - Multiple `setState` calls in one effect / chained state updates.
  - Number before `&&` rendering a stray 0.
  - Event logic handled in an effect instead of the event handler.

### ⚡ Performance

**23 errors, 23 warnings**

- **Errors:**
  - React Compiler can't optimize code due to:
    - Calling `setState` synchronously within an effect.
    - Accessing refs during render.
    - Memoization dependencies that could mutate.
    - Unsupported syntax like dynamic `import()` expressions inside closures.
- **Warnings:**
  - Bouncy easing animations.
  - Empty default prop (`[]`) breaking memoization by creating a new array each render.
  - Imports from barrel files.
  - Double loops (e.g., `.map().filter(Boolean)` instead of `.flatMap()`).

### ♿ Accessibility

**1 error, 16 warnings**

- **Errors:**
  - Invalid ARIA roles used.
- **Warnings:**
  - Interactive elements not focusable.
  - Controls missing accessible labels.
  - Role used instead of HTML tags (e.g., `role="button"` instead of `<button>`).

### 🛠️ Maintainability

**158 warnings**

- **Warnings:**
  - Component rendered by inline function call (causes state loss when React remounts).
  - Multiple components declared in one file.
  - Non-component exports in component files breaking Fast Refresh.
  - Large APIs with heavy boolean props that make components hard to test.

## Action Plan

1. **Performance Optimization:** Refactor effects that synchronously set state to allow the React Compiler to optimize components. Replace `import()` expressions inside render bodies if possible.
2. **High Priority Bugs:** Address the remaining `adjust-state-on-prop-change` issues to prevent stale UI during re-renders, and remove `redirect()` from `try-catch` blocks.
3. **Maintainability Cleanup:** Address inline-rendered components to simplify the codebase and preserve component state properly.
