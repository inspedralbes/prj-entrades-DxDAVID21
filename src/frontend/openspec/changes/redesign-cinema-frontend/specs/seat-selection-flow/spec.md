## ADDED Requirements

### Requirement: Mapa visual de seients
El sistema SHALL mostrar un mapa visual de la sala amb seients representats gràficament.

#### Scenario: Visualització del mapa de seients
- **WHEN** l'usuari accedeix a la selecció de seients
- **THEN** es mostra el mapa visual de la sala amb tots els seients

### Requirement: Llegenda d'estats dels seients
El sistema SHALL mostrar una llegenda clara que indiqui: disponible, ocupat, seleccionat i preu per tipus de seient.

#### Scenario: Visualització de la llegenda
- **WHEN** l'usuari està a la pàgina de selecció de seients
- **THEN** es mostra una llegenda amb els colors i significat de cada estat de seient

### Requirement: Selecció de seients
El sistema SHALL permetre seleccionar seients disponibles clicant sobre ells.

#### Scenario: Seleccionar un seient
- **WHEN** l'usuari fa clic en un seient disponible
- **THEN** el seient canvia a l'estat seleccionat i s'afegeix al resum de compra

### Requirement: Deseleccionar seients
El sistema SHALL permetre deseleccionar seients seleccionats clicant-hi de nou.

#### Scenario: Deseleccionar un seient
- **WHEN** l'usuari fa clic en un seient seleccionat
- **THEN** el seient torna a l'estat disponible i s'elimina del resum de compra

### Requirement: Indicador de preu en temps real
El sistema SHALL mostrar el preu total actualitzat en temps real segons els seients seleccionats.

#### Scenario: Actualització de preu
- **WHEN** l'usuari selecciona o deselecciona un seient
- **THEN** el preu total s'actualitza automàticament

### Requirement: Seients ocupats no seleccionables
El sistema SHALL evitar que l'usuari pugui seleccionar seients que ja estan ocupats.

#### Scenario: Intent de seleccionar seient ocupat
- **WHEN** l'usuari fa clic en un seient ocupat
- **THEN** no passa res, el seient roman ocupat i no es pot seleccionar

### Requirement: Nombre màxim de seients
El sistema SHALL limitar el nombre de seients que es poden seleccionar (màxim 8).

#### Scenario: Intent de superar el límit
- **WHEN** l'usuari intenta seleccionar més de 8 seients
- **THEN** es mostra un missatge d'error i no s'afegeix el seient

### Requirement: Navegació a checkout
El sistema SHALL permetre procedir al checkout un cop seleccionats els seients.

#### Scenario: Procedir a compra
- **WHEN** l'usuari fa clic al botó de continuar
- **THEN** es navega a la pàgina de checkout amb els seients seleccionats
