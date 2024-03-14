# Smart-Contract

## Voraussetzungen

Stelle sicher, dass Node.js und npm auf dem System installiert ist. Wenn nicht, lade es auf der offiziellen [Node.js-Website](https://nodejs.org/) herunter und installiere es.

## Installation von notwendigen NPM Module im Projekt

Führe den folgenden Befehl im Projekt-Ordner aus, um alle benötigten Module zu installieren:

```bash
npm i
```

## Wichtige Hardhat Befehle
### Kompilieren von Smart Contracts
Um die Smart Contracts zu kompilieren, verwenden den Befehl:
```bash
npm hardhat compile
```
Dieser Befehl übersetzt die Smart Contracts in ausführbaren Code für die Ethereum Virtual Machine (EVM).

### Test ausführen
Die geschriebenen Tests liegen im test/-Verzeichnis und werden mit diesem Befehl ausgeführt:
```bash
npm hardhat test
```

### Node starten
Starte die lokale Hardhat-Node mit dem Befehl:
```bash
npm hardhat node
```

### Contracts deployen
Deploye die Contracts in die lokale Hardhat-Node:
```bash
npm run "Deploy Contracts"
```