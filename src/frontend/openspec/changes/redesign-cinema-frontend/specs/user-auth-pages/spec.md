## ADDED Requirements

### Requirement: Formulari d'inici de sessió
El sistema SHALL mostrar un formulari d'inici de sessió amb correu electrònic i contrasenya.

#### Scenario: Visualització del formulari d'inici
- **WHEN** l'usuari accedeix a la pàgina d'inici de sessió
- **THEN** es mostra el formulari amb camps per correu i contrasenya

### Requirement: Validació d'inici de sessió
El sistema SHALL validar les credencials abans de permetre l'accés.

#### Scenario: Credencials incorrectes
- **WHEN** l'usuari introduceix credencials incorrectes
- **THEN** es mostra un missatge d'error i no es permet l'accés

### Requirement: Formulari de registre
El sistema SHALL mostrar un formulari de registre amb nom, correu, contrasenya i confirmació.

#### Scenario: Visualització del formulari de registre
- **WHEN** l'usuari accedeix a la pàgina de registre
- **THEN** es mostra el formulari amb camps per a les dades personals

### Requirement: Validació de contrasenya
El sistema SHALL validar que les contrasenyes coincideixen i compleixen els requisits de seguretat.

#### Scenario: Contrasenyes no coincideixen
- **WHEN** l'usuari introduceix contrasenyes diferents
- **THEN** es mostra un missatge d'error sota el camp de confirmació

### Requirement: Enllaç entre inici i registre
El sistema SHALL permetre navegar entre les pàgines d'inici de sessió i registre.

#### Scenario: Canvi a registre
- **WHEN** l'usuari fa clic a l'enllaç de registre
- **THEN** es navega a la pàgina de registre

### Requirement: Recordar usuari
El sistema SHALL oferir l'opció de recordar l'usuari en el dispositiu.

#### Scenario: Activar recorda'm
- **WHEN** l'usuari activa la casella de recorda'm
- **THEN** l'usuari es recorda en properes visites

### Requirement: Disseny adaptatiu
El sistema SHALL mostrar formularis adaptats a dispositius mòbils.

#### Scenario: Formulari en mòbil
- **WHEN** l'usuari visualitza el formulari en un dispositiu mòbil
- **THEN** el formulari s'adapta correctament a la mida de pantalla
