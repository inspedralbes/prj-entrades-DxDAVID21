## ADDED Requirements

### Requirement: Layout principal d'administració
El sistema SHALL disposar d'un layout específic per a la secció d'administració amb barra lateral de navegació.

#### Scenario: Visualització del layout d'admin
- **WHEN** l'usuari accedeix a qualsevol pàgina d'admin
- **THEN** es mostra el layout amb barra lateral i contingut principal

### Requirement: Barra lateral de navegació
El sistema SHALL mostrar una barra lateral amb els enllaços a les diferents seccions d'administració.

#### Scenario: Navegació des de la barra lateral
- **WHEN** l'usuari fa clic a una opció del menú
- **THEN** es navega a la pàgina corresponent

### Requirement: Disseny responsive
El sistema SHALL adaptar el layout per a dispositius mòbils amb barra lateral contraible.

#### Scenario: Visualització en mòbil
- **WHEN** l'usuari visualitza la pàgina en un dispositiu mòbil
- **THEN** la barra lateral es contreu i es pot obrir amb un botó

### Requirement: Indicador de secció activa
El sistema SHALL remarcar la secció activa actualment a la barra lateral.

#### Scenario: Secció activa
- **WHEN** l'usuari està a la pàgina de pel·lícules
- **THEN** l'opció de pel·lícules apareix destacada

### Requirement: Botó de tornada al lloc
El sistema SHALL mostrar un enllaç per tornar a la pàgina pública des de l'àrea d'admin.

#### Scenario: Tornar a la web pública
- **WHEN** l'usuari fa clic a l'enllaç de tornada
- **THEN** es navega a la pàgina principal del lloc
