## ADDED Requirements

### Requirement: Resum de compra
El sistema SHALL mostrar un resum complet de la compra incloent pel·lícula, sessió, cinema, seients i preu total.

#### Scenario: Visualització del resum
- **WHEN** l'usuari arriba a la pàgina de checkout
- **THEN** es mostra el resum de la compra amb tots els detalls

### Requirement: Detalls de la sessió
El sistema SHALL mostrar la informació de la sessió: pel·lícula, data, hora, cinema i sala.

#### Scenario: Informació de sessió al checkout
- **WHEN** l'usuari visualitza el checkout
- **THEN** es mostra el nom de la pel·lícula, data, hora, nom del cinema i número de sala

### Requirement: Llista de seients seleccionats
El sistema SHALL mostrar la llista de seients seleccionats amb fila, número i preu individual.

#### Scenario: Detalls dels seients
- **WHEN** l'usuari visualitza el resum de compra
- **THEN** es mostren tots els seients amb la seva ubicació (fila, número) i preu

### Requirement: Desglossament de preus
El sistema SHALL mostrar el desglossament de preus: subtotal, taxes i total.

#### Scenario: Visualització de preus
- **WHEN** l'usuari està al checkout
- **THEN** es mostra el subtotal, les taxes i el preu total

### Requirement: Confirmació de compra
El sistema SHALL permetre confirmar la compra i processar el pagament.

#### Scenario: Confirmar compra
- **WHEN** l'usuari fa clic al botó de confirmar compra
- **THEN** es processa el pagament i es mostra la confirmació

### Requirement: Botó de tornada
El sistema SHALL permetre tornar a la selecció de seients per modificar la tria.

#### Scenario: Tornar a selecció
- **WHEN** l'usuari fa clic al botó d'enrere
- **THEN** es navega a la pàgina de selecció de seients mantenint la selecció

### Requirement: Validació abans de compra
El sistema SHALL validar que hi ha seients seleccionats abans de permetre la compra.

#### Scenario: Intent de compra sense seients
- **WHEN** l'usuari intenta confirmar la compra sense seients seleccionats
- **THEN** es mostra un missatge d'error i no es permet confirmar
