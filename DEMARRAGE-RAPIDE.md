# 🚀 Démarrage Rapide - Test Manager QA

## Installation en 5 minutes

### 1️⃣ Installer les dépendances
```bash
cd test-manager
npm install
```

### 2️⃣ Configurer la base de données

**Option A - Développement local** (PostgreSQL requis)
```bash
# Créer la base
createdb test_manager

# Copier .env.example vers .env et modifier
cp .env.example .env
# Éditer .env avec vos credentials PostgreSQL
```

**Option B - Vercel Postgres** (Recommandé pour production)
```bash
# 1. Créer un compte sur vercel.com
# 2. Créer un projet
# 3. Ajouter Vercel Postgres dans Storage
# 4. Copier les variables DATABASE_URL et DIRECT_URL dans .env
```

### 3️⃣ Initialiser la base de données
```bash
# Générer le client Prisma
npm run prisma:generate

# Créer les tables
npm run prisma:push

# Peupler avec des données de test
npm run prisma:seed
```

### 4️⃣ Lancer l'application
```bash
npm run dev
```

Ouvrir **http://localhost:3000** 🎉

---

## 📦 Déploiement sur Vercel (Production)

### Méthode Simple (Interface Web)

1. **Pusher le code sur GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <votre-repo-github>
   git push -u origin main
   ```

2. **Importer sur Vercel**
   - Aller sur [vercel.com](https://vercel.com)
   - Cliquer "New Project"
   - Importer depuis GitHub
   - Sélectionner le repository

3. **Ajouter la base de données**
   - Dans le projet Vercel → Storage → Create Database
   - Choisir "Postgres"
   - Les variables `DATABASE_URL` et `DIRECT_URL` sont ajoutées automatiquement

4. **Déployer**
   - Cliquer "Deploy"
   - Attendre 2-3 minutes

5. **Initialiser la base de données de production**
   ```bash
   # Depuis votre machine locale
   # Copier DATABASE_URL et DIRECT_URL depuis Vercel dans .env
   npx prisma db push
   npx prisma db seed
   ```

6. **Visiter votre application**
   - URL fournie par Vercel (ex: `https://test-manager-xxx.vercel.app`)

---

## ✅ Checklist de Vérification

- [ ] Node.js 18+ installé
- [ ] PostgreSQL accessible (local ou Vercel)
- [ ] Variables `.env` configurées
- [ ] `npm install` exécuté
- [ ] `npm run prisma:generate` exécuté
- [ ] `npm run prisma:push` exécuté
- [ ] `npm run prisma:seed` exécuté
- [ ] Application accessible sur http://localhost:3000

---

## 🎯 Premiers Pas

### Utiliser l'application

1. **Dashboard** : Voir les statistiques globales
2. **Modules** : Cliquer pour déplier/replier
3. **Ajouter un test** : Bouton dans chaque module
4. **Tester** : Cliquer sur Succès/Échec/Non testé
5. **Remarque** : Toujours disponible pour commentaires
6. **Erreur** : Si échec, décrire le problème (obligatoire)
7. **PDF** : Générer le rapport en 1 clic

### Modules pré-configurés

Après le seed, vous aurez :
- ✅ Rechargement (8 tests)
- ✅ Transfert (8 tests)
- ✅ Paiement (6 tests)
- ✅ QR Code (6 tests)
- ✅ Coffre (7 tests)
- ✅ Cagnotte (7 tests)

**Total : 42 tests prêts à l'emploi !**

---

## 🔧 Commandes Utiles

```bash
# Développement
npm run dev                 # Lancer en dev
npm run build              # Builder pour production
npm run start              # Lancer en production

# Base de données
npm run prisma:studio      # Interface visuelle DB
npm run prisma:generate    # Générer client Prisma
npm run prisma:push        # Sync schema → DB
npm run prisma:seed        # Peupler la DB

# Qualité
npm run lint               # Vérifier le code
```

---

## 🐛 Problèmes Courants

### Erreur "Cannot find module '@prisma/client'"
```bash
npm run prisma:generate
```

### Erreur de connexion à la base
- Vérifier que PostgreSQL est démarré
- Vérifier `DATABASE_URL` dans `.env`
- Tester la connexion : `npm run prisma:studio`

### Page blanche après déploiement Vercel
- Vérifier les variables d'environnement sur Vercel
- Vérifier les logs de build
- Exécuter `npx prisma db push` avec les credentials Vercel

### Tests ne se sauvegardent pas
- Vérifier la console du navigateur (F12)
- Vérifier que l'API est accessible
- Vérifier les logs du serveur

---

## 📚 Ressources

- [Documentation complète](./README-COMPLET.md)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 💡 Conseils

1. **Développement** : Utilisez PostgreSQL local
2. **Production** : Utilisez Vercel Postgres
3. **Backup** : Exportez régulièrement en JSON
4. **Prisma Studio** : Parfait pour visualiser/éditer les données
5. **Git** : Commitez régulièrement vos changements

---

**Besoin d'aide ?** Consultez [README-COMPLET.md](./README-COMPLET.md) pour plus de détails.

**Prêt à tester !** 🚀
