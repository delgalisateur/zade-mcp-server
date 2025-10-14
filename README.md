# 🚀 Zade MCP Server

<div align="center">

![Zade Logo](https://img.shields.io/badge/Zade-MCP%20Server-blue?style=for-the-badge&logo=docker&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**🔥 Transformez votre LLM en agent de cybersécurité professionnel**

*Pentesting • Bug Bounty • Hacking éthique • Red Team • Purple Team • Sécurité offensive*

</div>

## 📖 Description

**Zade** est un serveur MCP (Model Context Protocol) révolutionnaire qui **transforme n'importe quel LLM en un agent de cybersécurité autonome**. En fournissant un accès complet à des conteneurs Kali Linux via Docker Desktop, Zade permet à votre assistant IA d'exécuter des outils de pentesting, de bug bounty, et de hacking éthique avec un accès matériel total à la machine hôte.

### 🎯 Mission : Démocratiser l'automatisation en cybersécurité

Zade rend la cybersécurité accessible à tous en permettant aux assistants IA de :
- **Lancer des scans de vulnérabilités automatisés**
- **Exécuter des outils de pentesting professionnels**
- **Analyser des rapports de sécurité**
- **Découvrir des failles en bug bounty**
- **Simuler des attaques Red Team**
- **Effectuer des analyses Purple Team**

### ✨ Fonctionnalités principales

- 🔥 **Accès matériel complet** via le mode privilégié Docker
- 🛡️ **Sécurité intégrée** avec validation des commandes dangereuses
- 🚀 **Interface MCP moderne** compatible avec Cline et autres clients MCP
- 📦 **Conteneur persistant** pour des sessions de travail continues
- 🔧 **Gestion automatique** des conteneurs Kali Linux
- 📊 **Monitoring en temps réel** de l'état des conteneurs

## 🎯 Cas d'usage : Transformez votre LLM en agent de cybersécurité

### 🔴 **Red Team & Pentesting**
- **Reconnaissance automatisée** : `nmap`, `subfinder`, `amass`
- **Exploitation de vulnérabilités** : Metasploit, Burp Suite
- **Post-exploitation** : Maintien d'accès, mouvement latéral
- **Rapports d'audit** automatisés et détaillés

### 🛡️ **Purple Team**
- **Simulation d'attaques** et détection par les défenses
- **Tests des SIEM/EDR** avec des scénarios réalistes
- **Validation des playbooks** de réponse à incidents
- **Amélioration continue** des postures de sécurité

### 🔍 **Bug Bounty & Hacking Éthique**
- **Scans automatisés** de vulnérabilités web
- **Fuzzing** intelligent d'applications
- **Analyse de code** pour trouver des failles
- **Reporting** automatisé pour plateformes bug bounty

### 🎓 **Formation & Apprentissage**
- **Labs interactifs** guidés par l'IA
- **Scénarios d'attaque** réels et safe
- **Corrections** et explications détaillées
- **Progression adaptative** selon le niveau

### 🤖 **Automatisation SOC**
- **Tri des alertes** et priorisation
- **Enrichissement** des IOC (Indicators of Compromise)
- **Réponse automatisée** aux incidents simples
- **Corrélation** d'événements multi-sources

## 🚀 Installation

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installé et en cours d'exécution
- [Node.js](https://nodejs.org/) 18.0.0 ou supérieur
- Image Kali Linux (téléchargée automatiquement)

### Installation depuis NPM

```bash
npm install -g zade-mcp-server
```

### Installation depuis les sources

```bash
git clone https://github.com/delgalisateur/zade-mcp-server.git
cd zade-mcp-server
npm install
npm run build
```

## ⚙️ Configuration

### Avec Cline

Ajoutez ce qui suit à votre fichier `cline_mcp_settings.json` :

```json
{
  "mcpServers": {
    "zade": {
      "command": "zade",
      "args": [],
      "env": {},
      "disabled": false,
      "autoApprove": ["run_command"]
    }
  }
}
```

### Avec Claude Desktop

Ajoutez à votre configuration Claude Desktop :

```json
{
  "mcpServers": {
    "zade": {
      "command": "npx",
      "args": ["-y", "zade-mcp-server"],
      "env": {}
    }
  }
}
```

## 🛠️ Outils disponibles

### 1. `start_kali_container` 🚀
Démarre ou crée un conteneur Kali Linux avec configuration optimisée.

```typescript
// Aucun paramètre requis
await start_kali_container();
```

### 2. `run_command` ⚡
Exécute n'importe quelle commande dans le conteneur Kali.

```typescript
await run_command({
  command: "nmap -sS localhost"
});
```

### 3. `get_container_status` 📊
Vérifie l'état et les informations du conteneur.

```typescript
await get_container_status();
```

### 4. `stop_kali_container` 🛑
Arrête proprement le conteneur Kali.

```typescript
await stop_kali_container();
```

## 📋 Exemples d'utilisation

### Démarrage rapide

```bash
# 1. Démarrer le conteneur
Utilisez l'outil "start_kali_container"

# 2. Installer des outils
Utilisez l'outil "run_command" avec:
"apt update && apt install -y nmap metasploit-framework"

# 3. Scanner un réseau
Utilisez l'outil "run_command" avec:
"nmap -sV 192.168.1.0/24"

# 4. Arrêter le conteneur
Utilisez l'outil "stop_kali_container"
```

### Workflow de pentesting

```bash
# 1. Reconnaissance
run_command: "nmap -sS -O target.com"

# 2. Scan de vulnérabilités
run_command: "nmap --script vuln target.com"

# 3. Analyse avec Nikto
run_command: "nikto -h http://target.com"

# 4. Rapport détaillé
run_command: "nmap -sV -sC -oA scan_report target.com"
```

## 🔒 Sécurité

Zade inclut plusieurs couches de sécurité :

- ✅ **Validation des commandes** : Blocage automatique des commandes destructrices
- ✅ **Logging détaillé** : Toutes les actions sont tracées
- ✅ **Mode privilégié contrôlé** : Accès matériel sécurisé
- ✅ **Isolation Docker** : Environnement complètement isolé

### Commandes bloquées par défaut

- `rm -rf /` et autres commandes de destruction système
- `mkfs` (formatage de filesystem)
- `shutdown`, `reboot`, `halt`, `poweroff`
- Fork bombs et autres attaques système

## 🏗️ Architecture technique

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client MCP    │───▶│   Zade Server    │───▶│ Docker Desktop  │
│  (Cline/Claude) │    │   (Node.js)      │    │   (Containers)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │ Kali Container   │
                       │ (Mode privilégié)│
                       └──────────────────┘
```

### Configuration du conteneur

- **Mode** : Privilégié avec accès matériel complet
- **Capacités** : Toutes les capacités Docker activées
- **Sécurité** : seccomp désactivé pour un accès maximal
- **Volumes** : `/tmp` hôte ↔ `/host_tmp` conteneur
- **Réseau** : Bridge avec accès réseau complet

## 🤝 Contribuer

Nous accueillons avec plaisir les contributions ! Voici comment participer :

1. **Fork** le projet
2. **Créez une branche** (`git checkout -b feature/amazing-feature`)
3. **Committez** vos changements (`git commit -m 'Add amazing feature'`)
4. **Push** vers la branche (`git push origin feature/amazing-feature`)
5. **Ouvrez une Pull Request**

### Développement local

```bash
git clone https://github.com/delgalisateur/zade-mcp-server.git
cd zade-mcp-server
npm install
npm run dev  # Mode développement avec recompilation automatique
```

## 📝 Changelog

### v1.0.0 (2024-10-14)
- ✨ Version initiale
- 🚀 Support complet des conteneurs Kali Linux
- 🛡️ Sécurité renforcée avec validation des commandes
- 📊 Monitoring en temps réel
- 📦 Publication sur NPM

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE) - voir le fichier LICENSE pour les détails.

## 🙏 Remerciements

- [Model Context Protocol](https://modelcontextprotocol.io/) pour le framework MCP
- [Docker](https://www.docker.com/) pour la technologie de conteneurisation
- [Kali Linux](https://www.kali.org/) pour l'environnement de sécurité
- [Cline](https://cline.ai/) pour l'intégration parfaite

## 📞 Support

- 🐛 **Bugs** : [Signaler un problème](https://github.com/delgalisateur/zade-mcp-server/issues)
- 💡 **Suggestions** : [Discussions GitHub](https://github.com/delgalisateur/zade-mcp-server/discussions)
- 📧 **Contact** : contact@zade.dev

---

<div align="center">

**⭐ Si ce projet vous plaît, n'hésitez pas à laisser une étoile !**

Made with ❤️ by delgalisateur

</div>
