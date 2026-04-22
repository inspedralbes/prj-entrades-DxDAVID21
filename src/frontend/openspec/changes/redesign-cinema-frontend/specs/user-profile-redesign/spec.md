## ADDED Requirements

### Requirement: Visualització del perfil d'usuari
El sistema SHALL mostrar la informació del perfil de l'usuari: nom, correu electrònic i dades del compte.

#### Scenario: Accés al perfil
- **WHEN** l'usuari fa clic a la seva foto o menú d'usuari
- **THEN** es mostra la pàgina de perfil amb les seves dades

### Requirement: Llista d'entrades comprades
El sistema SHALL mostrar totes les entrades comprades per l'usuari en format de targetes visuals.

#### Scenario: Visualització d'entrades
- **WHEN** l'usuari visualitza el seu perfil
- **THEN** es mostren les entrades comprades com a targetes amb els detalls

### Requirement: Detalls de cada entrada
El sistema SHALL mostrar per cada entrada: pel·lícula, data, hora, cinema, sala i seients.

#### Scenario: Detalls de l'entrada
- **WHEN** l'usuari visualitza una targeta d'entrada
- **THEN** es mostren tots els detalls: pel·lícula, sessió, ubicació

### Requirement: Estat de les entrades
El sistema SHALL mostrar l'estat de cada entrada (pendent, utilitzada, cancel·lada).

#### Scenario: Entrada pendent
- **WHEN** l'usuari té una entrada pendent d'utilitzar
- **THEN** es mostra amb estat "pendent" i funcionalitat per mostrar el codi QR

### Requirement: Filtratge d'entrades
El sistema SHALL permetre filtrar les entrades per estat (pendents, utilitzades, totes).

#### Scenario: Filtrar entrades
- **WHEN** l'usuari selecciona un filtre d'estat
- **THEN** es mostren només les entrades d'aquell estat

### Requirement: Tancar sessió
El sistema SHALL permetre tancar la sessió des del perfil d'usuari.

#### Scenario: Tancar sessió
- **WHEN** l'usuari fa clic al botó de tancar sessió
- **THEN** es tanca la sessió i es navega a la pàgina principal
