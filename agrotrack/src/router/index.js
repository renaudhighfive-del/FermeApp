// @ts-nocheck
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

// ── COMMUNS ───────────────────────────────────────────────────────
const LoginView        = () => import('@/views/LoginView.vue')
const UnauthorizedView = () => import('@/views/UnauthorizedView.vue')

// ── ADMIN ─────────────────────────────────────────────────────────
const AdminDashboard = () => import('@/views/admin/A1_Dashboard.vue')
const AdminUsers     = () => import('@/views/admin/A2_Users.vue')
const AdminCampaigns = () => import('@/views/admin/A3_Campaigns.vue')
const AdminReports   = () => import('@/views/admin/A4_Reports.vue')
const AdminStock     = () => import('@/views/admin/A5_Stock.vue')
const AdminFinance   = () => import('@/views/admin/A6_Finance.vue')
const AdminAnimals   = () => import('@/views/admin/A7_Animals.vue')
const AdminHealth    = () => import('@/views/admin/A8_Health.vue')
const AdminFarms     = () => import('@/views/admin/A9_Farms.vue')
const AdminSales     = () => import('@/views/admin/A9_Sales.vue')
const AdminSettings  = () => import('@/views/admin/A10_Settings.vue')
const AdminTasks     = () => import('@/views/admin/A12_Tasks.vue')

// ── GÉRANT ────────────────────────────────────────────────────────
const GerantDashboard  = () => import('@/views/gerant/G1_Dashboard.vue')
const GerantCampaigns  = () => import('@/views/gerant/G2_Campaigns.vue')
const GerantCampDetail = () => import('@/views/gerant/G3_CampaignDetail.vue')
const GerantAnimals    = () => import('@/views/gerant/G4_Animals.vue')
const GerantHealth     = () => import('@/views/gerant/G5_Health.vue')
const GerantFood       = () => import('@/views/gerant/G6_Food.vue')
const GerantFinance    = () => import('@/views/gerant/G7_Finance.vue')
const GerantSales      = () => import('@/views/gerant/G8_Sales.vue')
const GerantReports    = () => import('@/views/gerant/G9_Reports.vue')
const GerantAnimalFiche = () => import('@/views/gerant/G10_AnimalFiche.vue')

// ── AGENT ─────────────────────────────────────────────────────────
const AgentDashboard = () => import('@/views/agent/AG1_Dashboard.vue')
const AgentTasks     = () => import('@/views/agent/AG2_Tasks.vue')
const AgentSaisie    = () => import('@/views/agent/AG3_Saisie.vue')
const AgentAnimal    = () => import('@/views/agent/AG4_AnimalFiche.vue')
const AgentAlerts    = () => import('@/views/agent/AG5_Alerts.vue')

const routes = [
  // ── Public ──────────────────────────────────────────────────
  { path: '/',             redirect: '/login' },
  { path: '/login',        component: LoginView,        meta: { public: true } },
  { path: '/unauthorized', component: UnauthorizedView, meta: { public: true } },

  // ── Admin ───────────────────────────────────────────────────
  {
    path: '/admin',
    component: () => import('@/components/layout/AdminLayout.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
    children: [
      { path: 'dashboard', component: AdminDashboard },
      { path: 'users',     component: AdminUsers     },
      { path: 'campaigns', component: AdminCampaigns },
      { path: 'reports',   component: AdminReports   },
      { path: 'stock',     component: AdminStock     },
      { path: 'finance',   component: AdminFinance   },
      { path: 'animals',   component: AdminAnimals   },
      { path: 'health',    component: AdminHealth    },
      { path: 'farms',     component: AdminFarms     },
      { path: 'tasks',     component: AdminTasks     },
      { path: 'sales',     component: AdminSales     },
      { path: 'settings',  component: AdminSettings  },
    ],
  },

  // ── Gérant ──────────────────────────────────────────────────
  {
    path: '/gerant',
    component: () => import('@/components/layout/GerantLayout.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'gerant'] },
    children: [
      { path: 'dashboard',      component: GerantDashboard  },
      { path: 'campaigns',      component: GerantCampaigns  },
      { path: 'campaigns/:id',  component: GerantCampDetail },
      { path: 'animals',        component: GerantAnimals    },
      { path: 'health',         component: GerantHealth     },
      { path: 'food',           component: GerantFood       },
      { path: 'finance',        component: GerantFinance    },
      { path: 'sales',          component: GerantSales      },
      { path: 'reports',        component: GerantReports    },
      { path: 'animal/:id',     component: GerantAnimalFiche },
    ],
  },

  // ── Agent ────────────────────────────────────────────────────
  {
    path: '/agent',
    component: () => import('@/components/layout/AgentLayout.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'gerant', 'agent'] },
    children: [
      { path: 'dashboard',   component: AgentDashboard },
      { path: 'tasks',       component: AgentTasks     },
      { path: 'saisie',      component: AgentSaisie    },
      { path: 'animal/:id',  component: AgentAnimal    },
      { path: 'alerts',      component: AgentAlerts    },
    ],
  },

  // ── 404 ──────────────────────────────────────────────────────
  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({ history: createWebHistory(), routes })

// ── Dashboard par rôle ────────────────────────────────────────────
const dashboardParRole = {
  admin:  '/admin/dashboard',
  gerant: '/gerant/dashboard',
  agent:  '/agent/dashboard',
}

// ── Guard global ──────────────────────────────────────────────────
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // Route publique → toujours OK
  if (to.meta.public) return next()

  // Non connecté → login
  if (!auth.estConnecte) return next('/login')

  // Mauvais rôle → son propre dashboard
  const rolesAutorises = to.meta.roles
  if (rolesAutorises && !rolesAutorises.includes(auth.role)) {
    return next(dashboardParRole[auth.role] || '/login')
  }

  next()
})

export default router