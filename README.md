# flash-loans

## Voraussetzungen

Stelle sicher, dass Node.js und npm auf dem System installiert ist. Wenn nicht, lade es auf der offiziellen [Node.js-Website](https://nodejs.org/) herunter und installiere es.

## Installation von notwendigen NPM Module im Projekt

Führe den folgenden Befehl im Projekt-Ordner aus, um alle benötigten Module zu installieren:

```bash
npm i
```

## Wichtige Hardhat Befehle
### Kompilieren von Smart Contracts
Um Ihre Smart Contracts zu kompilieren, verwenden Sie den Befehl:
```bash
npm hardhat compile
```
Dieser Befehl übersetzt die Smart Contracts in ausführbaren Code für die Ethereum Virtual Machine (EVM).

### Test ausführen
Die geschriebenen Tests liegen im test/-Verzeichnis und werden mit diesem Befehl ausgeführt:
```bash
npm hardhat test
```
