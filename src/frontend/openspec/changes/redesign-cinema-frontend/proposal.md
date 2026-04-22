## Why

The current cinema tickets website frontend needs a complete redesign to provide a professional user experience similar to major cinema chains like Cinesa. The existing UI lacks visual appeal, modern design patterns, and proper component organization, making it difficult for users to navigate and complete ticket purchases.

## What Changes

- Redesign all frontend pages with a modern dark cinema aesthetic
- Create reusable components in app/components (movie cards, session lists, seat selector, buttons, layout)
- Implement proper state management for seat selection and checkout flow
- Add responsive layouts optimized for mobile and desktop
- Localize all UI text, labels, buttons, and messages to Catalan
- Integrate with Nuxt UI theming system using dark mode (#0068C8 primary, #F7C600 secondary accent)

## Capabilities

### New Capabilities

- `movies-list-redesign`: Complete redesign of the movies list page with improved cards, grid layout, and filtering options
- `movie-details-redesign`: Enhanced movie details page with session times, cinema selector, and improved visual hierarchy
- `seat-selection-flow`: New seat selection interface with clear legend, available/occupied/selected states, and real-time pricing
- `checkout-redesign`: Streamlined checkout page with purchase summary, clear pricing, and confirmation flow
- `user-auth-pages`: Redesigned login and registration pages with improved UX and validation
- `user-profile-redesign`: User profile page displaying purchased tickets with proper card/ticket visualization
- `shared-components`: Library of reusable UI components (MovieCard, SessionList, SeatSelector, Button variants, Layout)

### Modified Capabilities

- None (all new frontend improvements without backend changes)

## Impact

- **Frontend Code**: All pages in app/pages/, new components in app/components/, layouts in app/layouts/
- **Styling**: TailwindCSS configuration and Nuxt UI theme customization
- **Localization**: All text content converted to Catalan
- **No Backend Changes**: API endpoints, stores logic, and database remain unchanged
