## ADDED Requirements

### Requirement: Informació detallada de pel·lícula
El sistema SHALL mostrar la informació completa de la pel·lícula incloent imatge, títol, sinopsi, durada, gènere i classificació per edats.

#### Scenario: Visualització de detall de pel·lícula
- **WHEN** l'usuari accedeix a la pàgina de detall d'una pel·lícula
- **THEN** es mostra la imatge gran, títol, sinopsi completa, durada, gènere i classificació per edats

### Requirement: Sessions disponibles
El sistema SHALL mostrar les sessions disponibles per a la pel·lícula amb data, hora i cinema.

#### Scenario: Llistat de sessions
- **WHEN** l'usuari visualitza el detall d'una pel·lícula
- **THEN** es mostren les sessions ordenades per data i hora amb el nom del cinema

### Requirement: Selector de cinema
El sistema SHALL permetre seleccionar el cinema on voleu veure la pel·lícula.

#### Scenario: Triar cinema
- **WHEN** l'usuari selecciona un cinema del selector
- **THEN** es mostren només les sessions d'aquell cinema

### Requirement: Selecció de data
El sistema SHALL permetre seleccionar la data de la sessió mitjançant un calendari.

#### Scenario: Triar data de sessió
- **WHEN** l'usuari selecciona una data al calendari
- **THEN** es mostren les sessions només per aquella data

### Requirement: Botó de compra d'entrades
El sistema SHALL mostrar un botó prominent per comprar entrades quan hi hagi sessions disponibles.

#### Scenario: Accés a compra d'entrades
- **WHEN** l'usuari fa clic al botó de comprar entrades
- **THEN** es navega a la pàgina de selecció de seients
