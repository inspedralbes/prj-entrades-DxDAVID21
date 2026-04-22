## Context

The frontend of the Nuxt 3 cinema tickets website needs a complete redesign to achieve a professional cinema website appearance similar to Cinesa. The current implementation has:
- Basic page layouts without consistent visual hierarchy
- Limited component reusability across pages
- No clear design system or theme enforcement
- Missing responsive optimizations
- All text in Spanish instead of Catalan

Technical constraints:
- Nuxt 3 with app/pages and app/components structure
- TailwindCSS for utility styling
- Nuxt UI component library with custom theming
- app.config.ts defines visual style (dark cinema, #0068C8 primary, #F7C600 secondary)
- No backend changes permitted - only frontend modifications

## Goals / Non-Goals

**Goals:**
- Create a cohesive dark cinema visual theme across all pages
- Build reusable UI components (MovieCard, SessionList, SeatSelector, etc.)
- Improve user experience in seat selection with clear visual states
- Implement responsive layouts for mobile and desktop
- Localize all text to Catalan
- Match professional cinema website standards

**Non-Goals:**
- Modify backend API endpoints or data structures
- Change store logic or state management approach
- Update database schemas
- Add new authentication mechanisms
- Modify existing data models

## Decisions

### 1. Component Architecture
**Decision:** Create a component library in app/components/ organized by feature
**Rationale:** Provides reusability, maintainability, and consistent UI across pages
**Alternatives:** Inline components per page (rejected - poor maintainability)

### 2. Design System Implementation
**Decision:** Use Nuxt UI theming with custom colors from app.config.ts
**Rationale:** Leverages existing Nuxt UI infrastructure while enforcing the defined color palette (#0068C8, #F7C600)
**Alternatives:** Custom CSS variables (rejected - loses Nuxt UI benefits)

### 3. Page Flow Redesign
**Decision:** Keep existing route structure but improve navigation between pages
**Rationale:** Maintains existing URLs and user bookmarks while improving UX
**Alternatives:** New route structure (rejected - breaks existing links)

### 4. Seat Selection Implementation
**Decision:** Visual seat map with clear legend and interactive states
**Rationale:** Users need immediate visual feedback on seat availability, selection, and pricing
**Alternatives:** Dropdown selection (rejected - poor UX for seat selection)

### 5. Catalan Localization
**Decision:** Replace all UI text with Catalan translations
**Rationale:** User requirement for Catalan language support
**Alternatives:** Keep Spanish/Bilingual (rejected - explicit requirement)

## Risks / Trade-offs

- [Risk] Component refactoring may introduce visual regressions → Mitigation: Test each page thoroughly after changes
- [Risk] Nuxt UI theme customization may have limitations → Mitigation: Use TailwindCSS overrides where needed
- [Risk] Catalan translations may miss edge cases → Mitigation: Review all pages systematically
- [Risk] Seat selection state management complexity → Mitigation: Use composables for clear state separation
