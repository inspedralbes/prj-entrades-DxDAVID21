## Why

The current admin section of the cinema tickets website uses inconsistent styling, flat buttons, and lacks visual alignment with the premium dark cinema theme used in the public pages. This creates a fragmented user experience and reduces admin usability. Applying the same design system (#0068C8 primary, #F7C600 secondary, dark background) will provide a cohesive experience.

## What Changes

- Apply the premium cinema dark theme to all admin pages
- Replace flat HTML buttons with Nuxt UI components (UButton, UCard, UContainer, UForm)
- Improve button visibility with consistent styling, proper spacing, and clear hierarchy
- Redesign admin dashboard layout with better spacing, clearer sections, and improved typography
- Create a consistent layout with sidebar navigation for admin pages
- Ensure responsive design for mobile and desktop
- Localize all UI text to Catalan
- Create reusable admin components (AdminLayout, AdminCard, AdminButton)

## Capabilities

### New Capabilities

- `admin-layout-redesign`: New admin layout with sidebar navigation, topbar, and consistent styling
- `admin-movies-management`: Redesigned movie management pages (list, create, edit)
- `admin-sessions-management`: Redesigned session management pages (list, create, edit, dashboard)
- `admin-rooms-management`: Redesigned room management pages (list, create, edit)
- `admin-shared-components`: New reusable admin components following the cinema theme

### Modified Capabilities

- None (frontend-only redesign without backend changes)

## Impact

- **Frontend Code**: All pages in app/pages/admin/, new layout app/layouts/admin.vue, new components in app/components/admin/
- **Styling**: TailwindCSS v4 and Nuxt UI with cinema theme
- **No Backend Changes**: API endpoints and database remain unchanged
