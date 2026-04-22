## ADDED Requirements

### Requirement: Pel·lícules mostrades en targetes visuals
El sistema SHALL mostrar les pel·lícules disponibles en targetes visuals atractives amb imatge de cartell, títol, gènere i valoració.

#### Scenario: Visualització de llista de pel·lícules
- **WHEN** l'usuari accedeix a la pàgina de pel·lícules
- **THEN** es mostren les pel·lícules en una graella de targetes amb imatge, títol, gènere i valoració

### Requirement: Filtres per gènere
El sistema SHALL permetre filtrar les pel·lícules per gènere cinematogràfic.

#### Scenario: Aplicar filtre de gènere
- **WHEN** l'usuari selecciona un gènere del filtre
- **THEN** es mostren només les pel·lícules d'aquell gènere

### Requirement: Cerca de pel·lícules
El sistema SHALL permetre cercar pel·lícules per títiol.

#### Scenario: Cercar pel·lícula
- **WHEN** l'usuari escriu al camp de cerca
- **THEN** es filtren les pel·lícules que contenen el text cercat al títol

### Requirement: Layout responsive
El sistema SHALL mostrar les targetes en diferents columnes segons la mida de pantalla (1 columna mòbil, 2-3 tauleta, 4 escriptori).

#### Scenario: Adaptació a pantalla mòbil
- **WHEN** l'usuari visualitza la pàgina en un dispositiu mòbil
- **THEN** les targetes es mostren en una única columna

### Requirement: Ordre de pel·lícules
El sistema SHALL permetre ordenar les pel·lícules per data d'estrena o popularitat.

#### Scenario: Canviar ordre de visualització
- **WHEN** l'usuari selecciona un criteri d'ordenació
- **THEN** les pel·lícules es mostren ordenades segons el criteri seleccionat
