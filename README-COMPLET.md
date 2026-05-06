# Test Manager QA - Plateforme Professionnelle de Gestion de Tests

Application web complète de gestion de tests fonctionnels avec base de données PostgreSQL, génération de rapports PDF et déploiement Vercel.

## 🎯 Vue d'ensemble

Test Manager QA est un outil professionnel conçu pour les équipes QA afin de suivre, documenter et rapporter les tests fonctionnels de manière structurée et efficace.

## ✨ Fonctionnalités Principales

### 📋 Gestion Avancée des Tests
- **Organisation par modules métier** : Rechargement, Transfert, Paiement, QR Code, Coffre, Cagnotte
- **Statuts de test** : Succès ✓, Échec ✗, Non testé ○
- **Champ remarque** : Toujours disponible pour ajouter des commentaires
- **Description d'erreur** : Obligatoire en cas d'échec avec champ multi-ligne
- **CRUD complet** : Ajout, modification, suppression de modules et tests
- **Persistance en base** : Toutes les données sauvegardées en PostgreSQL

### 📊 Dashboard & Statistiques
- Nombre total de tests
- Tests réussis avec pourcentage
- Tests échoués avec alertes
- Tests non testés
- Barre de progression visuelle
- Indicateurs par module

### 🎨 Interface Utilisateur
- Design moderne avec Tailwind CSS
- Cards avec sections bien séparées
- Codes couleur cohérents (vert/rouge/gris)
- Modules repliables/dépliables
- Édition inline avec sauvegarde automatique
- Feedback visuel immédiat
- Responsive (mobile, tablette, desktop)

### 📄 Génération de Rapports PDF
- Rapport professionnel structuré
- En-tête avec titre et date
- Résumé global des statistiques
- Détail par module et par test
- Statuts avec codes couleur
- Remarques et descriptions d'erreurs
- Pagination automatique

### 💾 Import/Export
- Export JSON des données
- Import JSON pour restauration
- Sauvegarde automatique en base

## 🛠️ Stack Technique

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript (strict mode)
- **Base de données** : PostgreSQL
- **ORM** : Prisma
- **Styling** : Tailwind CSS
- **PDF** : jsPDF
- **Déploiement** : Vercel
- **Database Provider** : Vercel Postgres

## 📦 Installation

### Prérequis
- Node.js 18+
- PostgreSQL (local ou Vercel Postgres)
- npm ou yarn

### 1. Cloner et installer les dépendances

```bash
cd test-manager
npm install
```

### 2. Configuration de la base de données

#### Option A : Base de données locale (développement)

```bash
# Créer une base PostgreSQL locale
createdb test_manager

# Configurer .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/test_manager?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/test_manager?schema=public"
```

#### Option B : Vercel Postgres (production)

1. Créer un projet sur [Vercel](https://vercel.com)
2. Ajouter Vercel Postgres dans l'onglet Storage
3. Copier les variables d'environnement dans `.env`

```bash
DATABASE_URL="postgres://default:***@***-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true"
DIRECT_URL="postgres://default:***@***-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb"
```

### 3. Initialiser la base de données

```bash
# Générer le client Prisma
npm run prisma:generate

# Créer les tables
npm run prisma:push

# (Optionnel) Peupler avec des données de test
npm run prisma:seed
```

### 4. Lancer l'application

```bash
# Mode développement
npm run dev

# Ouvrir http://localhost:3000
```

## 🚀 Déploiement sur Vercel

### Méthode 1 : Via l'interface Vercel (Recommandé)

1. **Créer un compte** sur [vercel.com](https://vercel.com)

2. **Importer le projet**
   - Cliquer sur "New Project"
   - Importer depuis Git (GitHub, GitLab, Bitbucket)
   - Sélectionner le repository

3. **Configurer la base de données**
   - Dans le projet Vercel, aller dans "Storage"
   - Créer une "Postgres Database"
   - Les variables `DATABASE_URL` et `DIRECT_URL` seront automatiquement ajoutées

4. **Déployer**
   - Cliquer sur "Deploy"
   - Vercel va automatiquement :
     - Installer les dépendances
     - Générer le client Prisma (`postinstall` script)
     - Builder l'application
     - Déployer

5. **Initialiser la base de données**
   ```bash
   # Depuis votre machine locale avec les variables Vercel
   npx prisma db push
   npx prisma db seed
   ```

### Méthode 2 : Via CLI Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Ajouter les variables d'environnement
vercel env add DATABASE_URL
vercel env add DIRECT_URL

# Redéployer
vercel --prod
```

### Variables d'environnement requises

```env
DATABASE_URL=<votre_database_url>
DIRECT_URL=<votre_direct_url>
```

## 📁 Structure du Projet

```
test-manager/
├── app/
│   ├── api/
│   │   ├── modules/
│   │   │   ├── route.ts          # GET, POST modules
│   │   │   └── [id]/route.ts     # DELETE, PATCH module
│   │   ├── tests/
│   │   │   ├── route.ts          # POST test
│   │   │   └── [id]/route.ts     # PATCH, DELETE test
│   │   └── stats/
│   │       └── route.ts          # GET statistics
│   ├── page.tsx                  # Page principale
│   ├── layout.tsx                # Layout global
│   └── globals.css               # Styles globaux
├── components/
│   ├── Dashboard.tsx             # Dashboard avec stats
│   ├── ModuleBlock.tsx           # Bloc module
│   ├── TestItem.tsx              # Item de test
│   └── StatusSelector.tsx        # Sélecteur de statut
├── lib/
│   └── prisma.ts                 # Client Prisma singleton
├── prisma/
│   ├── schema.prisma             # Schéma de base de données
│   └── seed.ts                   # Script de seed
├── types/
│   └── index.ts                  # Types TypeScript
├── utils/
│   └── pdfGenerator.ts           # Générateur PDF
├── .env                          # Variables d'environnement (local)
├── .env.example                  # Exemple de configuration
├── package.json                  # Dépendances
└── README.md                     # Documentation
```

## 🗄️ Schéma de Base de Données

### Module
```prisma
model Module {
  id        String     @id @default(cuid())
  name      String
  order     Int        @default(0)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  tests     TestCase[]
}
```

### TestCase
```prisma
model TestCase {
  id               String     @id @default(cuid())
  moduleId         String
  name             String
  status           TestStatus @default(NOT_TESTED)
  remark           String?    @db.Text
  issueDescription String?    @db.Text
  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt
  module           Module     @relation(...)
}
```

### TestStatus (Enum)
```prisma
enum TestStatus {
  SUCCESS
  FAILURE
  NOT_TESTED
}
```

## 🎯 Modules Métier Pré-configurés

1. **Rechargement** : Orange, MTN, Moov, Wave
2. **Transfert** : Vers différents opérateurs
3. **Paiement** : Entre utilisateurs MADIS
4. **QR Code** : Génération, scan, validation
5. **Coffre** : Création, ajout, retrait de fonds
6. **Cagnotte** : Création, contribution, partage

## 📖 Guide d'Utilisation

### Ajouter un module
1. Cliquer sur "Ajouter un module"
2. Entrer le nom du module
3. Valider

### Ajouter un test
1. Dans un module, cliquer sur "Ajouter un test"
2. Entrer le nom du test
3. Valider

### Tester un cas
1. Sélectionner le statut : Succès, Échec, ou Non testé
2. Ajouter une remarque (optionnel)
3. Si Échec : remplir la description du problème (obligatoire)
4. La sauvegarde est automatique

### Générer un rapport PDF
1. Cliquer sur "Générer le rapport PDF"
2. Le PDF se télécharge avec :
   - Statistiques globales
   - Détail de chaque module
   - Tous les tests avec statuts
   - Remarques et descriptions d'erreurs

### Exporter/Importer
- **Exporter** : Sauvegarde JSON de tous les modules et tests
- **Importer** : Restaure depuis un fichier JSON

## 🔧 Scripts Disponibles

```bash
npm run dev              # Développement
npm run build            # Build production
npm run start            # Démarrer en production
npm run lint             # Linter

npm run prisma:generate  # Générer client Prisma
npm run prisma:migrate   # Créer migration
npm run prisma:push      # Push schema vers DB
npm run prisma:studio    # Interface Prisma Studio
npm run prisma:seed      # Peupler la base
```

## 🎨 Personnalisation

### Ajouter un nouveau module métier

Modifier `prisma/seed.ts` :

```typescript
{
  name: 'Nouveau Module',
  order: 7,
  tests: [
    { name: 'Test 1', status: TestStatus.NOT_TESTED },
    { name: 'Test 2', status: TestStatus.NOT_TESTED },
  ],
}
```

Puis :
```bash
npm run prisma:seed
```

### Modifier les couleurs

Éditer `tailwind.config.ts` pour personnaliser le thème.

## 🐛 Dépannage

### Erreur Prisma Client

```bash
npm run prisma:generate
```

### Base de données non synchronisée

```bash
npm run prisma:push
```

### Erreur de connexion à la base

Vérifier les variables `DATABASE_URL` et `DIRECT_URL` dans `.env`

### Build Vercel échoue

1. Vérifier que `postinstall` est dans `package.json`
2. Vérifier les variables d'environnement sur Vercel
3. Consulter les logs de build

## 📊 Prisma Studio

Pour visualiser et éditer les données :

```bash
npm run prisma:studio
```

Ouvre une interface web sur `http://localhost:5555`

## 🔐 Sécurité

- ✅ Validation des données côté serveur
- ✅ Types TypeScript stricts
- ✅ Variables d'environnement sécurisées
- ✅ Pas de données sensibles en frontend
- ✅ Connexion PostgreSQL sécurisée

## 🚀 Améliorations Futures

- [ ] Authentification utilisateur (NextAuth.js)
- [ ] Sessions de test avec historique
- [ ] Assignation de tests à des testeurs
- [ ] Notifications par email
- [ ] Graphiques et analytics avancés
- [ ] Export Excel
- [ ] API REST documentée (Swagger)
- [ ] Mode hors ligne (PWA)

## 📝 Licence

Projet de démonstration - Libre d'utilisation

## 👥 Support

Pour toute question ou problème :
- Consulter la documentation Prisma : https://www.prisma.io/docs
- Documentation Next.js : https://nextjs.org/docs
- Documentation Vercel : https://vercel.com/docs

---

**Développé avec ❤️ par l'équipe QA**

**Stack** : Next.js 14 • TypeScript • Prisma • PostgreSQL • Tailwind CSS • Vercel
