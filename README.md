# antisichtung

## Getting started

Typisches nodejs-Projekt, also wie folgt:

- halbwegs aktuelle Version von node.js installieren
- Dieses Repo klonen (`git clone https://github.com/TunfischDev/antisichtung`)
- mit `cd antisichtung` ins neue Verzeichnis wechseln
- `npm i` um die notwendigen Abhängigkeiten zu installieren und das Projekt vorzubereiten
- Optional: Wenn du möglichst Datenmenge hochladen willst, ein mit `mkdir upload-files` ein neues Verzeichnis erstellen, und in diesem die hochzuladenden Dateien ablegen. Diese werden später zufällig ausgewählt und hochgeladen.
- Um den Dienst zu starten, `ts-node src/index.ts` ausführen (VPN nicht vergessen).
- es sind einige Konfigurationsparameter möglich:
  - `-g` bzw `--generate-files`: Statt Dateien aus `./upload-files` hochzuladen, kann der Dienst auch selbst zufällige pngs generieren. Diese sind im Schnitt zwischen 0.3 und 3MB groß. Standardmäßig werden die Dateien in `./upload-files` hochgeladen
  - `-p <number>`: Die Anzahl der parallel gestarteten Browser. Standardmäßig wird ein Browser verwendet. Für Uploads von wenigen großen Dateien reicht ein niedrigerer Wert.
  - `--headless`: Startet die Browser ohne Benutzeroberfläche.
