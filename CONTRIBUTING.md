# 🤝 Contribuer à Zade MCP Server

Nous sommes ravis que vous souhaitiez contribuer à Zade ! Ce guide vous aidera à démarrer.

## 📋 Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment contribuer](#comment-contribuer)
- [Processus de développement](#processus-de-développement)
- [Pull Requests](#pull-requests)
- [Rapports de bugs](#rapports-de-bugs)
- [Suggestions de fonctionnalités](#suggestions-de-fonctionnalités)

## 🎯 Code de conduite

En participant à ce projet, vous acceptez de respecter notre code de conduite :

- Soyez respectueux et inclusif
- Acceptez les critiques constructives
- Focus sur ce qui est meilleur pour la communauté
- Montrez de l'empathie envers les autres membres

## 🚀 Comment contribuer

### Signaler des bugs

1. Vérifiez que le bug n'a pas déjà été signalé
2. Utilisez le template de bug si disponible
3. Fournissez un titre clair et descriptif
4. Incluez des détails pour reproduire le bug

### Suggérer des fonctionnalités

1. Vérifiez que la fonctionnalité n'a pas déjà été suggérée
2. Expliquez pourquoi cette fonctionnalité serait utile
3. Décrivez comment vous l'imagineriez

### Contribuer au code

1. Fork le projet
2. Créez une branche pour votre contribution
3. Faites vos changements
4. Testez vos modifications
5. Soumettez une Pull Request

## 🛠️ Processus de développement

### Prérequis

- Node.js 18.0.0 ou supérieur
- Docker Desktop installé et fonctionnel
- Git

### Configuration locale

```bash
# 1. Fork et clone le projet
git clone https://github.com/VOTRE_USERNAME/zade-mcp-server.git
cd zade-mcp-server

# 2. Installez les dépendances
npm install

# 3. Configurez votre remote upstream
git remote add upstream https://github.com/zade-mcp/zade-mcp-server.git

# 4. Créez une branche de développement
git checkout -b develop
git pull upstream develop
```

### Workflow de développement

```bash
# 1. Créez une nouvelle branche pour votre fonctionnalité
git checkout -b feature/nouvelle-fonctionnalite

# 2. Faites vos changements
# Éditez les fichiers...

# 3. Testez vos changements
npm run build
npm start

# 4. Committez vos changements
git add .
git commit -m "feat: ajoute nouvelle fonctionnalité"

# 5. Push vers votre fork
git push origin feature/nouvelle-fonctionnalite
```

### Conventions de commit

Nous utilisons [Conventional Commits](https://www.conventionalcommits.org/) :

```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: mise à jour de la documentation
style: formatting, missing semi colons, etc.
refactor: refactoring du code
test: ajout ou modification de tests
chore: mise à jour des dépendances, etc.
```

## 📝 Pull Requests

### Avant de soumettre

1. **Testez votre code** : Assurez-vous que tout fonctionne
2. **Documentation** : Mettez à jour la documentation si nécessaire
3. **Formatage** : Suivez le style de code du projet
4. **Commits** : Utilisez des messages de commit clairs

### Template de Pull Request

```markdown
## Description
Brève description de vos changements.

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Tests
- [ ] J'ai testé mes changements
- [ ] J'ai ajouté des tests si nécessaire

## Checklist
- [ ] Mon code suit les guidelines du projet
- [ ] J'ai effectué une revue de mon propre code
- [ ] J'ai commenté mon code si nécessaire
- [ ] J'ai mis à jour la documentation si nécessaire
```

### Processus de review

1. Les mainteneurs examineront votre PR
2. Des feedbacks peuvent être demandés
3. Une fois approuvée, la PR sera mergée

## 🐛 Rapports de bugs

### Template de bug

```markdown
**Description du bug**
Description brève et claire du problème.

**Étapes pour reproduire**
1. Aller à '...'
2. Cliquer sur '....'
3. Faire défiler jusqu'à '....'
4. Voir l'erreur

**Comportement attendu**
Description de ce qui devrait se produire.

**Comportement actuel**
Description de ce qui se produit réellement.

**Captures d'écran**
Si applicable, ajoutez des captures d'écran.

**Informations techniques**
- OS: [e.g. Windows 11, macOS 14.0]
- Node.js: [e.g. 20.0.0]
- Docker: [e.g. 4.25.0]
- Version de Zade: [e.g. 1.0.0]

**Contexte additionnel**
Ajoutez tout autre contexte pertinent.
```

## 💡 Suggestions de fonctionnalités

### Template de fonctionnalité

```markdown
**Description de la fonctionnalité**
Description claire et concise de la fonctionnalité proposée.

**Problème résolu**
Quel problème cette fonctionnalité résout-elle ?

**Solution proposée**
Comment cette fonctionnalité devrait-elle fonctionner ?

**Alternatives considérées**
Quelles autres solutions avez-vous envisagées ?

**Cas d'usage**
Exemples d'utilisation de cette fonctionnalité.
```

## 🎨 Style de code

### TypeScript

- Utilisez TypeScript pour tout nouveau code
- Préférez `const` et `let` à `var`
- Utilisez les types explicites quand nécessaire
- Suivez les conventions ESLint/Prettier

### Nommage

- **Variables** : camelCase
- **Fonctions** : camelCase
- **Classes** : PascalCase
- **Constantes** : UPPER_SNAKE_CASE
- **Fichiers** : kebab-case

### Commentaires

```typescript
/**
 * Description de la fonction
 * @param param1 Description du paramètre
 * @returns Description de la valeur de retour
 */
function maFonction(param1: string): boolean {
  // Implémentation
}
```

## 🧪 Tests

### Écriture de tests

```typescript
import { expect } from 'chai';
import { maFonction } from '../src/index';

describe('maFonction', () => {
  it('devrait retourner true pour une entrée valide', () => {
    expect(maFonction('test')).to.be.true;
  });

  it('devrait retourner false pour une entrée invalide', () => {
    expect(maFonction('')).to.be.false;
  });
});
```

### Lancement des tests

```bash
npm test
```

## 📚 Documentation

### Mise à jour de la documentation

- README.md pour les utilisateurs finaux
- API.md pour la documentation technique
- CONTRIBUTING.md pour les contributeurs

### Style d'écriture

- Utilisez un langage clair et simple
- Incluez des exemples de code
- Ajoutez des captures d'écran si pertinent

## 🏷️ Versioning

Nous utilisons [Semantic Versioning](https://semver.org/) :

- **MAJOR** : Changements qui cassent la compatibilité
- **MINOR** : Nouvelles fonctionnalités rétrocompatibles
- **PATCH** : Corrections de bugs rétrocompatibles

## 🎉 Reconnaissance

Les contributeurs seront mentionnés dans :

- Le fichier README.md
- Les notes de version
- Les releases GitHub

---

Merci de contribuer à Zade ! 🎉
