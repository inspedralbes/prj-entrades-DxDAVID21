## ADDED Requirements

### Requirement: Component MovieCard
El sistema SHALL disposar d'un component MovieCard reutilitzable que mostri la imatge de cartell, títol, gènere i valoració de la pel·lícula.

#### Scenario: Ús del MovieCard
- **WHEN** es renderitza el component MovieCard amb les dades d'una pel·lícula
- **THEN** es mostra la targeta visual amb imatge, títol, gènere i valoració

### Requirement: Component SessionList
El sistema SHALL disposar d'un component SessionList reutilitzable que mostri les sessions disponibles.

#### Scenario: Ús del SessionList
- **WHEN** es renderitza el component SessionList amb les dades de les sessions
- **THEN** es mostra la llista de sessions amb data, hora i cinema

### Requirement: Component SeatSelector
El sistema SHALL disposar d'un component SeatSelector reutilitzable per a la selecció de seients.

#### Scenario: Ús del SeatSelector
- **WHEN** es renderitza el component SeatSelector amb l'estat de la sala
- **THEN** es mostra el mapa visual de seients amb la llegenda

### Requirement: Component Button
El sistema SHALL disposar de variants de botons reutilitzables segons el tipus (principal, secundari, perill).

#### Scenario: Ús del Button
- **WHEN** es renderitza el component Button amb el tipus especificat
- **THEN** es mostra el botó amb l'estil corresponent (primari #0068C8, secundari #F7C600)

### Requirement: Component Layout
El sistema SHALL disposar d'un layout principal amb capçalera, menú de navegació i peu de pàgina.

#### Scenario: Ús del Layout
- **WHEN** es renderitza qualsevol pàgina amb el Layout
- **THEN** es mostra la capçalera, navegació i peu de pàgina consistent

### Requirement: Component TicketCard
El sistema SHALL disposar d'un component TicketCard per mostrar les entrades comprades.

#### Scenario: Ús del TicketCard
- **WHEN** es renderitza el component TicketCard amb les dades d'una entrada
- **THEN** es mostra la targeta de l'entrada amb tots els detalls

### Requirement: Component FilterBar
El sistema SHALL disposar d'un component FilterBar per als filtres de cerca i ordenació.

#### Scenario: Ús del FilterBar
- **WHEN** es renderitza el component FilterBar
- **THEN** es mostren els controls de filtre i ordenació

### Requirement: Component PriceSummary
El sistema SHALL disposar d'un component PriceSummary per mostrar el desglossament de preus.

#### Scenario: Ús del PriceSummary
- **WHEN** es renderitza el component PriceSummary amb els conceptes
- **THEN** es mostra el desglossament de preus de forma clara
