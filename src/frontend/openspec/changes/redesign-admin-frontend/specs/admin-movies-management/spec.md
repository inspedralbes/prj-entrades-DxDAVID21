## ADDED Requirements

### Requirement: Llista de pel·lícules amb tema visual
El sistema SHALL mostrar la llista de pel·lícules amb targetes visuals seguint el tema de cinema fosc.

#### Scenario: Visualització de llista de pel·lícules
- **WHEN** l'administrador accedeix a la pàgina de gestió de pel·lícules
- **THEN** es mostren les pel·lícules en targetes amb el tema visual aplicat

### Requirement: Botons d'acció visuals
El sistema SHALL mostrar botons visuals per a les accions de cada pel·lícula (editar, eliminar).

#### Scenario: Accions sobre pel·lícules
- **WHEN** l'administrador visualitza la llista de pel·lícules
- **THEN** es mostren botons visuals per editar i eliminar

### Requirement: Formulari de creació de pel·lícula
El sistema SHALL mostrar un formulari visual per crear noves pel·lícules.

#### Scenario: Crear nova pel·lícula
- **WHEN** l'administrador fa clic a Afegir pel·lícula
- **THEN** es mostra el formulari amb camps visuals

### Requirement: Formulari d'edició de pel·lícula
El sistema SHALL mostrar un formulari visual per editar pel·lícules existents.

#### Scenario: Editar pel·lícula
- **WHEN** l'administrador fa clic a Editar
- **THEN** es mostra el formulari amb les dades de la pel·lícula

### Requirement: Botons de confirmació
El sistema SHALL mostrar botons visuals per a les accions de confirmació i cancel·lació.

#### Scenario: Confirmar acció
- **WHEN** l'administrador fa clic a Guardar
- **THEN** es processa l'acció amb el botó visual corresponent
