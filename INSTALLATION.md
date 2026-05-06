# 🚀 Guide d'installation complet

## Étape 1 : Remplacer le schéma Prisma

```bash
# Sauvegarder l'ancien schéma (optionnel)
Copy-Item "prisma\schema.prisma" "prisma\schema.prisma.backup"

# Remplacer par le nouveau schéma
Remove-Item "prisma\schema.prisma"
Rename-Item "prisma\schema-new.prisma" "schema.prisma"
```

## Étape 2 : Installer les dépendances

```bash
npm install
```

Cela installera :
- `next-auth` (authentification)
- `bcryptjs` (hashage des mots de passe)
- `@types/bcryptjs` (types TypeScript)

## Étape 3 : Configurer les variables d'environnement

Ajoutez dans votre fichier `.env` :

```env
# Base de données (déjà configuré)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-tres-long-et-securise-123456"
```

Pour générer un secret sécurisé :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Étape 4 : Générer le client Prisma

```bash
npx prisma generate
```

## Étape 5 : Pousser le nouveau schéma vers la base

```bash
npx prisma db push
```

Cette commande va créer les nouvelles tables :
- `users` (utilisateurs)
- `test_reports` (rapports)
- `notifications` (notifications)

## Étape 6 : Créer un utilisateur admin

Créez le fichier `prisma/seed-users.ts` :

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hasher les mots de passe
  const adminPassword = await bcrypt.hash('admin123', 10);
  const testerPassword = await bcrypt.hash('tester123', 10);

  // Créer utilisateur admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Créer utilisateur testeur
  const tester = await prisma.user.upsert({
    where: { email: 'tester@test.com' },
    update: {},
    create: {
      email: 'tester@test.com',
      name: 'Testeur',
      password: testerPassword,
      role: 'TESTER',
    },
  });

  console.log('✅ Utilisateurs créés:', { admin, tester });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Exécuter le seed :
```bash
npx tsx prisma/seed-users.ts
```

## Étape 7 : Lancer l'application

```bash
npm run dev
```

Ouvrez http://localhost:3000

## Étape 8 : Se connecter

Utilisez ces identifiants de test :

**Admin :**
- Email : `admin@test.com`
- Mot de passe : `admin123`

**Testeur :**
- Email : `tester@test.com`
- Mot de passe : `tester123`

## Nouvelles fonctionnalités disponibles

### 1. Authentification
- Page de connexion : `/auth/login`
- Déconnexion automatique si non connecté
- Rôles : ADMIN, TESTER, VIEWER

### 2. Rapports de tests
- Page des rapports : `/reports`
- Créer un rapport depuis un test
- Assigner un rapport à un utilisateur
- Filtrer par statut (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
- Priorités (LOW, MEDIUM, HIGH, CRITICAL)

### 3. Notifications in-app
- Cloche de notification dans le header
- Notifications en temps réel (polling toutes les 30s)
- Types de notifications :
  - Rapport créé
  - Rapport assigné
  - Rapport mis à jour
  - Test assigné
  - Test mis à jour
  - Commentaire ajouté

### 4. API disponibles

**Auth :**
- `POST /api/auth/[...nextauth]` - NextAuth

**Rapports :**
- `GET /api/reports` - Liste des rapports
- `POST /api/reports` - Créer un rapport
- `GET /api/reports/[id]` - Détails d'un rapport
- `PATCH /api/reports/[id]` - Mettre à jour un rapport
- `DELETE /api/reports/[id]` - Supprimer un rapport

**Notifications :**
- `GET /api/notifications` - Liste des notifications
- `PATCH /api/notifications` - Marquer comme lu

## Prochaines étapes recommandées

1. **Ajouter le composant NotificationBell dans le layout**
   Éditez `app/layout.tsx` pour inclure le composant

2. **Créer un bouton "Créer un rapport" dans ModuleBlock**
   Pour permettre aux utilisateurs de signaler des problèmes rapidement

3. **Déployer sur Vercel**
   N'oubliez pas d'ajouter `NEXTAUTH_URL` et `NEXTAUTH_SECRET` dans les variables d'environnement

## Dépannage

**Erreur "Cannot find module '@prisma/client'"**
```bash
npx prisma generate
```

**Erreur "Invalid session strategy"**
Vérifiez que `NEXTAUTH_SECRET` est défini dans `.env`

**Page blanche après connexion**
Vérifiez la console du navigateur et les logs du serveur

**Notifications ne s'affichent pas**
Vérifiez que l'utilisateur est bien connecté et que les notifications existent dans la base

---

**Tout est prêt !** 🎉

Vous avez maintenant :
- ✅ Authentification avec NextAuth
- ✅ Système de rapports collaboratifs
- ✅ Notifications in-app
- ✅ Gestion des rôles (Admin, Tester, Viewer)
- ✅ API REST complète
