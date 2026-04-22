## Context

The admin section currently lacks visual consistency with the public-facing cinema website. The existing admin pages use basic HTML elements without proper theming, have inconsistent button styling, and don't follow the modern dark cinema aesthetic. The design system is already defined in app.config.ts with primary color #0068C8 and secondary color #F7C600.

Technical constraints:
- Nuxt 3 with app/pages/admin structure
- TailwindCSS v4 for styling
- Nuxt UI component library
- All text must be in Catalan
- No backend changes permitted

## Goals / Non-Goals

**Goals:**
- Apply consistent cinema dark theme to all admin pages
- Create sidebar navigation layout for admin section
- Improve button visibility with proper contrast and sizing
- Use Nuxt UI components throughout
- Ensure mobile responsiveness
- Create reusable admin components

**Non-Goals:**
- Modify backend API endpoints
- Change data models or database
- Add new admin features (only visual redesign)
- Modify authentication logic

## Decisions

### 1. Layout Architecture
**Decision:** Create a dedicated admin layout with sidebar navigation
**Rationale:** Provides consistent navigation across admin pages, better organization, and professional appearance
**Alternatives:** Keep page-by-page redesign (rejected - inconsistent UX)

### 2. Component Strategy
**Decision:** Replace all flat buttons with Nuxt UI UButton components
**Rationale:** Consistent styling, built-in variants (primary/secondary/danger), better accessibility
**Alternatives:** Custom styled buttons (rejected - loses Nuxt UI benefits)

### 3. Card Design
**Decision:** Use UCard components with custom cinema theme slots
**Rationale:** Consistent container styling, proper shadows, rounded corners matching theme
**Alternatives:** Div-based cards (rejected - inconsistent with public pages)

### 4. Form Handling
**Decision:** Use UForm with proper validation feedback
**Rationale:** Better UX with inline validation, consistent styling, easier maintenance
**Alternatives:** Plain HTML forms (rejected - poor UX)

### 5. Table Design
**Decision:** Use UTatable or custom table with UButton actions
**Rationale:** Clear data presentation with consistent action buttons
**Alternatives:** Div-based tables (rejected - accessibility issues)

## Risks / Trade-offs

- [Risk] Admin routes may not use new layout by default → Mitigation: Update route handling or use page-level layout declaration
- [Risk] Some admin functionality may depend on specific DOM structure → Mitigation: Test each page thoroughly
- [Risk] Mobile navigation needs special handling → Mitigation: Create collapsible sidebar for mobile

## Migration Plan

1. Create admin layout with sidebar
2. Create shared admin components
3. Update each admin page one by one
4. Test navigation and functionality
5. Verify responsive behavior
