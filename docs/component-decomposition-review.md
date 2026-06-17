# Component Decomposition Review

This document reviews the components in the MovieHub FE codebase and identifies candidates that should be refactored by splitting them into smaller, more modular sub-components.

---

## 🎯 Summary of Recommendations

We audited all `.tsx` component files across `src/` (including shared components, form fields, and route-specific UI blocks). The following five components are the highest-priority candidates for decomposition:

| Component Path                                                                                                                                                                                                                                                 |  Current Lines   | Primary Issue                                                                              | Proposed Action                                                     |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------: | :----------------------------------------------------------------------------------------- | :------------------------------------------------------------------ |
| [upload-image-field.tsx](file:///D:/CODE/Web/KTLN/movie/fe/src/components/form/upload-image-field.tsx)                                                                                                                                                         |      `578`       | Combines form integration, file drop dropzones, and image cropping modal dialogs.          | Extract crop dialog into `ImageCropperDialog`.                      |
| [watch-series.tsx](file:///D:/CODE/Web/KTLN/movie/fe/src/components/app/watch/watch-series.tsx) <br>& [movie-tab-series.tsx](file:///D:/CODE/Web/KTLN/movie/fe/src/components/app/movie-tabs/movie-tab-series.tsx)                                             | `283` <br> `247` | Duplicate rendering markup (~80 lines each) for rendering series episode buttons/cards.    | Extract a shared, reusable `EpisodeCard` component.                 |
| [filter.tsx](file:///D:/CODE/Web/KTLN/movie/fe/src/app/search/_components/filter.tsx)                                                                                                                                                                          |      `305`       | Large loop rendering condition titles alongside complex multi/single-selection buttons.    | Extract condition rows into `FilterConditionRow`.                   |
| [verify-otp-form.tsx](<file:///D:/CODE/Web/KTLN/movie/fe/src/app/(auth)/verify-otp/_components/verify-otp-form.tsx>) <br>& [forgot-password-form.tsx](<file:///D:/CODE/Web/KTLN/movie/fe/src/app/(auth)/forgot-password/_components/forgot-password-form.tsx>) | `430` <br> `430` | Multi-step user auth forms combining timer hooks, input steps, and submission controllers. | Extract step view panels and timers into standalone sub-components. |

---

## 🔍 Detailed Component Audits

### 1. Form Image Upload & Cropper

- **File**: [upload-image-field.tsx](file:///D:/CODE/Web/KTLN/movie/fe/src/components/form/upload-image-field.tsx) (578 lines)
- **Problems**:
  - Mixes React Hook Form controller setup (`useController`) and local upload logic (`useFileUpload`).
  - Embeds a fully featured `<Dialog>` overlay wrapping a `<Cropper>` layout, custom sliders, aspect selectors, and helper functions (e.g., `createImage` and `getCroppedImg`).
- **Decomposition Strategy**:
  - Keep the outer form control and drag-and-drop file input in `UploadImageField`.
  - Extract the dialog containing the cropper canvas, zoom controls, and canvas calculations into a separate `ImageCropperDialog` component:
  ```tsx
  // Proposed interface
  type ImageCropperDialogProps = {
    open: boolean;
    imageSrc: string;
    aspect?: number;
    allowCustomAspect?: boolean;
    onClose: () => void;
    onCropComplete: (croppedBlob: Blob) => void;
  };
  ```

---

### 2. Series Episode Grid & Playback Lists

- **Files**:
  - [watch-series.tsx](file:///D:/CODE/Web/KTLN/movie/fe/src/components/app/watch/watch-series.tsx) (283 lines)
  - [movie-tab-series.tsx](file:///D:/CODE/Web/KTLN/movie/fe/src/components/app/movie-tabs/movie-tab-series.tsx) (247 lines)
- **Problems**:
  - **Code Duplication**: Both components render episode buttons/cards for series in two visual formats (simple numbered square buttons vs. detailed thumbnail cards).
  - The rendering blocks inside the `.map()` loops represent roughly 80 lines of identical Tailwind structures, Framer Motion layouts, and hover logic.
- **Decomposition Strategy**:
  - Extract the markup under the `.map()` loop into a single, unified `EpisodeCard` component placed in `src/components/app/episode/episode-card.tsx` or similar shared location:

  ```tsx
  type EpisodeCardProps = {
    episode: EpisodeResType;
    index: number;
    toggle: boolean; // simple vs detailed view
    isPlaying: boolean;
    onClick: () => void;
  };
  ```

  - Reusing this component across both tabs will shrink both files by roughly 30% and consolidate all visual changes in one place.

---

### 3. Search Filter Panel

- **File**: [filter.tsx](file:///D:/CODE/Web/KTLN/movie/fe/src/app/search/_components/filter.tsx) (305 lines)
- **Problems**:
  - Handles the query parameters, option selection states, category query fetching, and responsive filter box toggle.
  - The main markup loops over search conditions and renders list items inline, mixing multi-selection logic (e.g., category tag toggling) with single-selection buttons directly in the rendering loop.
- **Decomposition Strategy**:
  - Extract the condition rows into a separate sub-component: `FilterConditionRow`.

  ```tsx
  type FilterConditionRowProps = {
    label: string;
    filterKey: SearchKeys;
    options: { label: string; value: string | number }[];
    selectedValues: (string | number)[];
    onOptionClick: (value: string | number) => void;
  };
  ```

  - This separates search presentation logic from option manipulation handlers, making the code much easier to customize or extend with additional filters.

---

### 4. Auth & Password Recovery Workflow Forms

- **Files**:
  - [verify-otp-form.tsx](<file:///D:/CODE/Web/KTLN/movie/fe/src/app/(auth)/verify-otp/_components/verify-otp-form.tsx>) (430 lines)
  - [forgot-password-form.tsx](<file:///D:/CODE/Web/KTLN/movie/fe/src/app/(auth)/forgot-password/_components/forgot-password-form.tsx>) (430 lines)
- **Problems**:
  - These forms carry high cognitive load: managing react-hook-form state, local resend verification timers, OTP input fields, and multi-step dialog layouts.
  - Form views contain multiple nested conditions (e.g., checking if the email has been sent, displaying timers, or rendering custom loaders).
- **Decomposition Strategy**:
  - Move the countdown timer hook and display to a reusable component/hook.
  - Split the form steps into smaller step-level layout views (e.g., `EmailStep`, `OtpInputStep`), keeping the parent container responsible only for state transitions and form submission callbacks.
