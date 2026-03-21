# AgroTrack — Frontend Vue.js

SaaS de gestion de campagnes agricoles · Vue.js 3 + Pinia + Vue Router · JavaScript pur (sans TypeScript)

## 🏗️ Structure MVC

```
src/
├── assets/styles/
│   ├── variables.css       ← Variables CSS + animations
│   └── main.css            ← Tous les composants CSS réutilisables
│
├── views/                  ← VIEW (pages)
│   ├── admin/
│   │   ├── A1_Dashboard.vue
│   │   ├── A2_Users.vue
│   │   ├── A3_Campaigns.vue
│   │   ├── A4_Reports.vue
│   │   ├── A5_Stock.vue
│   │   ├── A6_Finance.vue
│   │   ├── A7_Animals.vue
│   │   ├── A8_Health.vue
│   │   ├── A9_Sales.vue
│   │   └── A10_Settings.vue
│   ├── gerant/
│   │   ├── G1_Dashboard.vue
│   │   ├── G2_Campaigns.vue
│   │   ├── G3_CampaignDetail.vue
│   │   ├── G4_Animals.vue
│   │   ├── G5_Health.vue
│   │   ├── G6_Food.vue
│   │   ├── G7_Finance.vue
│   │   ├── G8_Sales.vue
│   │   └── G9_Reports.vue
│   ├── agent/
│   │   ├── AG1_Dashboard.vue
│   │   ├── AG2_Tasks.vue
│   │   ├── AG3_Saisie.vue
│   │   ├── AG4_AnimalFiche.vue
│   │   └── AG5_Alerts.vue
│   ├── LoginView.vue
│   └── UnauthorizedView.vue
│
├── components/             ← VIEW (composants)
│   ├── layout/
│   │   ├── AppNavbar.vue
│   │   ├── SidebarAdmin.vue
│   │   ├── SidebarGerant.vue
│   │   ├── SidebarAgent.vue
│   │   └── SidebarItem.vue
│   └── common/
│       └── ModalNewCampaign.vue
│
├── stores/                 ← MODEL (état global)
│   └── auth.store.js       ← Pinia store JWT + rôles
│
├── services/               ← MODEL (API)
│   └── http.client.js      ← Axios + intercepteurs JWT
│
├── composables/            ← CONTROLLER (logique réutilisable)
│   └── usePermission.js    ← Gestion des droits dans les templates
│
├── router/                 ← CONTROLLER (navigation)
│   └── index.js            ← Routes protégées par rôle
│
├── App.vue                 ← Composant racine
└── main.js                 ← Point d'entrée
```

## 🚀 Installation

```bash
npm install
npm run dev
```

L'app sera disponible sur http://localhost:5173

## 👤 Rôles et accès

| Rôle    | Email démo          | Accès |
|---------|---------------------|-------|
| Admin   | admin@demo.com      | 10 pages |
| Gérant  | gerant@demo.com     | 9 pages |
| Agent   | agent@demo.com      | 5 pages |

> Sur la page Login, utilisez les boutons de démo rapide pour tester chaque rôle.

## 🔐 Architecture authentification

Le JWT token est décodé côté client pour extraire le `role`.
Le router guard vérifie `meta.roles` sur chaque route.
L'intercepteur Axios ajoute automatiquement le Bearer token.

```js
// Exemple meta route
{ path: '/admin/users', meta: { requiresAuth: true, roles: ['admin'] } }

// Exemple usage dans un composant
import { usePermission } from '@/composables/usePermission.js'
const { can, isAdmin } = usePermission()
// <button v-if="can(['admin', 'gerant'])">Action</button>
```

## 🌐 Connexion au backend Express

Dans `.env` :
```
VITE_API_URL=http://localhost:3000/api
```

Dans vos services :
```js
import http from '@/services/http.client.js'

// GET
const campaigns = await http.get('/campaigns')

// POST
const newCampaign = await http.post('/campaigns', { name, dept, budget })
```

## 🎨 Palette

| Variable       | Couleur    | Usage |
|----------------|------------|-------|
| `--primary`    | `#3D2B1F`  | Navbar, boutons principaux |
| `--accent`     | `#F2B705`  | Boutons accent, FAB, highlights |
| `--bg`         | `#FDF6EC`  | Fond de page |
| `--success`    | `#2D6A4F`  | Statuts positifs |
| `--danger`     | `#D62828`  | Alertes, mortalité |
| `--warn`       | `#E07B39`  | Avertissements |
| `--vol`        | `#E8813A`  | Badge Volaille |
| `--bet`        | `#8B5E3C`  | Badge Bétail |
| `--pis`        | `#1A6B8A`  | Badge Pisciculture |

## 📦 Dépendances

```json
{
  "vue": "^3.4.0",
  "vue-router": "^4.3.0",
  "pinia": "^2.1.0",
  "axios": "^1.6.0"
}
```

## 🔗 Prochaines étapes Backend

1. **Express API** — créer les routes REST : `/api/campaigns`, `/api/animals`, `/api/events`, etc.
2. **Mongoose** — modèles : Campaign, Animal, Event, User, Sale, Stock
3. **JWT** — endpoint `/api/auth/login` qui retourne un token avec `{ role, name }`
4. **Remplacer les données mock** dans les vues par des appels `http.get()`
