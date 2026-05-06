# Test Manager - Gestion de Tests Fonctionnels

Application web moderne de gestion de tests fonctionnels avec génération automatique de rapports PDF professionnels.

## 🚀 Fonctionnalités

### Gestion des Tests
- ✅ Organisation par modules (Recharge, Transfert, Paiement, QR Code, Coffre, Cagnotte)
- ✅ Ajout/suppression dynamique de modules et de cas de test
- ✅ Trois statuts pour chaque test : Succès, Échec, Non testé
- ✅ Description obligatoire des problèmes en cas d'échec
- ✅ Interface rapide sans rechargement de page

### Statistiques en Temps Réel
- 📊 Compteur global des tests (OK / KO / Non testés)
- 📊 Taux de réussite et progression visuelle
- 📊 Statistiques par module

### Génération de Rapport PDF
- 📄 Rapport PDF professionnel et structuré
- 📄 Titre, date et résumé global
- 📄 Détail de tous les modules et tests
- 📄 Codes couleur pour une lecture facile
- 📄 Description des erreurs pour les tests échoués

### Fonctionnalités Bonus
- 💾 Export des tests en JSON
- 📥 Import de tests depuis un fichier JSON
- 🔄 Réinitialisation rapide
- 📱 Interface responsive (mobile, tablette, desktop)

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn

## 🛠️ Installation

1. **Installer les dépendances**
```bash
npm install
```

2. **Lancer le serveur de développement**
```bash
npm run dev
```

3. **Ouvrir l'application**
Ouvrez votre navigateur à l'adresse : [http://localhost:3000](http://localhost:3000)

## 📦 Scripts Disponibles

```bash
npm run dev      # Lancer en mode développement
npm run build    # Compiler pour la production
npm run start    # Lancer en mode production
npm run lint     # Vérifier le code
```

## 🏗️ Structure du Projet

```
test-manager/
├── app/
│   ├── page.tsx          # Page principale avec logique d'état
│   ├── layout.tsx        # Layout global
│   └── globals.css       # Styles globaux
├── components/
│   ├── TestItem.tsx      # Composant pour un test individuel
│   ├── ModuleBlock.tsx   # Composant pour un module de tests
│   └── StatsPanel.tsx    # Panneau de statistiques
├── types/
│   └── index.ts          # Interfaces TypeScript
├── utils/
│   ├── initialData.ts    # Données de démonstration
│   └── pdfGenerator.ts   # Logique de génération PDF
└── package.json
```

## 🎨 Technologies Utilisées

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS
- **PDF** : jsPDF
- **State Management** : React Hooks (useState)

## 📖 Guide d'Utilisation

### 1. Tester un Cas
- Cliquez sur un des boutons de statut : **Succès**, **Échec**, ou **Non testé**
- Si vous sélectionnez **Échec**, un champ de description apparaît (obligatoire)

### 2. Ajouter un Test
- Cliquez sur **"+ Ajouter un test"** dans un module
- Entrez le nom du test et validez

### 3. Ajouter un Module
- Cliquez sur **"+ Ajouter un module"** en bas de la page
- Entrez le nom du module et validez

### 4. Générer un Rapport PDF
- Cliquez sur **"Générer le rapport PDF"**
- Le PDF se télécharge automatiquement avec :
  - En-tête avec titre et date
  - Résumé global des statistiques
  - Détail de chaque module et test
  - Descriptions des erreurs

### 5. Exporter/Importer
- **Exporter** : Sauvegarde tous les tests en JSON
- **Importer** : Charge un fichier JSON précédemment exporté

### 6. Réinitialiser
- Cliquez sur **"Réinitialiser"** pour revenir aux données initiales

## 🎯 Explication de la Génération PDF

La génération de PDF utilise **jsPDF** et se fait entièrement côté client :

1. **Collecte des données** : Les modules et statistiques sont passés à la fonction `generatePDF()`
2. **Création du document** : Un nouveau document PDF est initialisé
3. **Mise en page** :
   - En-tête avec titre et date
   - Résumé global avec codes couleur
   - Sections par module avec bordures colorées
   - Tests avec statuts visuels (✓, ✗, ○)
   - Descriptions d'erreurs en italique
4. **Pagination** : Gestion automatique des sauts de page
5. **Téléchargement** : Le PDF est généré et téléchargé avec un nom horodaté

### Code Clé (pdfGenerator.ts)
```typescript
// Couleurs selon le statut
switch (test.status) {
  case TestStatus.SUCCESS:
    statusColor = [34, 197, 94];  // Vert
    break;
  case TestStatus.FAILURE:
    statusColor = [239, 68, 68];  // Rouge
    break;
  case TestStatus.NOT_TESTED:
    statusColor = [156, 163, 175]; // Gris
    break;
}
```

## 🎨 Design & UX

- **Feedback visuel immédiat** : Changements de couleur instantanés
- **Codes couleur cohérents** :
  - 🟢 Vert : Succès
  - 🔴 Rouge : Échec
  - ⚪ Gris : Non testé
  - 🔵 Bleu : Actions principales
- **Interface moderne** : Ombres, bordures arrondies, transitions fluides
- **Responsive** : Adapté à tous les écrans

## ⚠️ Notes Importantes

- **Pas de persistance** : Les données sont perdues au rechargement de la page
- **State local uniquement** : Utilisation de `useState` React
- **Pas de base de données** : Tout est géré en mémoire
- **Export recommandé** : Pensez à exporter vos tests en JSON avant de fermer

## 🚀 Prochaines Étapes Possibles

- Ajout de localStorage pour la persistance
- Authentification utilisateur
- Partage de rapports par email
- Templates de modules personnalisables
- Historique des tests avec horodatage
- Graphiques et visualisations avancées

## 📝 Licence

Projet de démonstration - Libre d'utilisation

---

**Développé avec Next.js, TypeScript et Tailwind CSS** 🚀
