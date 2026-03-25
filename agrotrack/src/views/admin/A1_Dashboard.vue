<template>
  <div id="pdf-content" class="space-y-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--text)]">Tableau de bord</h1>
        <p class="text-[var(--soft)]">{{ dateAujourdhui[0].toUpperCase()+dateAujourdhui.slice(1) }}</p>
      </div>
      <div class="flex gap-2 w-full sm:w-auto">
        <button class="btn btn-ghost flex-1 sm:flex-none" @click="exporterPDF">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          Exporter PDF
        </button>
      </div>
    </div>

    <!-- KPIs -->
    <div class="stats-grid">
      <div class="card p-5 flex items-center justify-between">
        <div>
          <div class="text-[var(--soft)] text-xs font-semibold uppercase tracking-wider mb-1">Total Animaux</div>
          <div class="text-2xl font-bold text-[var(--text)]">{{ stats.totalAnimals }}</div>
          <div class="text-[var(--success)] text-xs font-medium mt-1 flex items-center gap-1">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7"/></svg>
            +120 cette semaine
          </div>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-[var(--vol)]/10 flex items-center justify-center text-[var(--vol)]">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></svg>
        </div>
      </div>

      <div class="card p-5 flex items-center justify-between">
        <div>
          <div class="text-[var(--soft)] text-xs font-semibold uppercase tracking-wider mb-1">Campagnes Actives</div>
          <div class="text-2xl font-bold text-[var(--text)]">{{ stats.activeCampaigns }}</div>
          <div class="text-[var(--soft)] text-xs mt-1">3 volaille · 2 bétail</div>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-[var(--pis)]/10 flex items-center justify-center text-[var(--pis)]">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/></svg>
        </div>
      </div>

      <div class="card p-5 flex items-center justify-between">
        <div>
          <div class="text-[var(--soft)] text-xs font-semibold uppercase tracking-wider mb-1">Taux de Mortalité</div>
          <div class="text-2xl font-bold text-[var(--danger)]">{{ stats.mortality }}%</div>
          <div class="text-[var(--danger)] text-xs font-medium mt-1 flex items-center gap-1">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7"/></svg>
            +0.3% vs sem. passée
          </div>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-[var(--danger)]/10 flex items-center justify-center text-[var(--danger)]">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>
        </div>
      </div>

      <div class="card p-5 flex items-center justify-between">
        <div>
          <div class="text-[var(--soft)] text-xs font-semibold uppercase tracking-wider mb-1">Revenus du Mois</div>
          <div class="text-2xl font-bold text-[var(--success)]">{{ (stats.totalRevenue / 1000).toLocaleString('fr-FR') }}k</div>
          <div class="text-[var(--success)] text-xs font-medium mt-1 flex items-center gap-1">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7"/></svg>
            +8% vs mois passé
          </div>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-[var(--success)]/10 flex items-center justify-center text-[var(--success)]">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6"/></svg>
        </div>
      </div>
    </div>

    <!-- Charts + Tables Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Charts Column -->
      <div class="lg:col-span-2 space-y-6">
        <div class="card">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold text-[var(--text)]">Performance Financière</h3>
            <div class="flex gap-4 text-xs font-medium">
              <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-sm bg-[var(--primary)]"></div> Revenus</div>
              <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-sm bg-[var(--accent)]"></div> Dépenses</div>
            </div>
          </div>
          
          <div class="h-64 relative">
            <!-- Placeholder for real chart logic, but making it visually consistent -->
            <svg width="100%" height="100%" viewBox="0 0 600 200" preserveAspectRatio="none">
              <g stroke="var(--border)" stroke-width="1" stroke-dasharray="4">
                <line x1="0" y1="40" x2="600" y2="40" />
                <line x1="0" y1="80" x2="600" y2="80" />
                <line x1="0" y1="120" x2="600" y2="120" />
                <line x1="0" y1="160" x2="600" y2="160" />
              </g>
              <!-- Bar chart placeholder -->
              <rect x="40" y="60" width="30" height="100" fill="var(--primary)" rx="4" />
              <rect x="75" y="90" width="30" height="70" fill="var(--accent)" rx="4" />
              
              <rect x="140" y="40" width="30" height="120" fill="var(--primary)" rx="4" />
              <rect x="175" y="70" width="30" height="90" fill="var(--accent)" rx="4" />
              
              <rect x="240" y="80" width="30" height="80" fill="var(--primary)" rx="4" />
              <rect x="275" y="100" width="30" height="60" fill="var(--accent)" rx="4" />

              <rect x="340" y="50" width="30" height="110" fill="var(--primary)" rx="4" />
              <rect x="375" y="85" width="30" height="75" fill="var(--accent)" rx="4" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Side Column: Alerts/Tasks -->
      <div class="space-y-6">
        <div class="card flex flex-col h-full">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-[var(--text)]">Alertes Récentes</h3>
            <span class="px-2 py-0.5 rounded-full bg-[var(--danger)]/10 text-[var(--danger)] text-xs font-bold">{{ admin.alerts.length }}</span>
          </div>
          <div class="space-y-3 overflow-y-auto max-h-[400px]">
            <div v-for="alert in admin.alerts" :key="alert._id" class="p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] group hover:border-[var(--accent)] transition-colors">
              <div class="flex items-start gap-3">
                <div :class="alert.priority === 'urgent' ? 'text-[var(--danger)]' : 'text-[var(--warn)]'">
                  <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                </div>
                <div>
                  <div class="text-sm font-semibold text-[var(--text)]">{{ alert.title }}</div>
                  <div class="text-xs text-[var(--soft)] line-clamp-2 mt-0.5">{{ alert.message }}</div>
                  <div class="text-[10px] text-[var(--soft)] mt-2 font-medium uppercase tracking-wider">{{ formatDate(alert.createdAt) }}</div>
                </div>
              </div>
            </div>
            <div v-if="admin.alerts.length === 0" class="text-center py-8 text-[var(--soft)] italic text-sm">
              Aucune alerte en attente
            </div>
          </div>
          <button class="mt-auto pt-4 text-center text-sm font-semibold text-[var(--primary)] dark:text-[var(--accent)] hover:underline">
            Voir tout le journal
          </button>
        </div>
      </div>

    </div>

    <!-- Bottom Table -->
    <div class="card">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-bold text-[var(--text)]">Campagnes en cours</h3>
        <button class="text-sm font-semibold text-[var(--primary)] dark:text-[var(--accent)] hover:underline">Voir tout</button>
      </div>
      <div class="table-container mt-0 border-none shadow-none">
        <table>
          <thead>
            <tr>
              <th>Campagne</th>
              <th class="hide-mobile">Ferme</th>
              <th class="hide-mobile">Début</th>
              <th>Statut</th>
              <th class="text-right">Progression</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in admin.campaigns.slice(0, 5)" :key="c._id">
              <td class="font-medium">{{ c.name }}</td>
              <td class="hide-mobile text-[var(--soft)]">{{ c.farm?.name || 'N/A' }}</td>
              <td class="hide-mobile text-[var(--soft)]">{{ formatDate(c.startDate) }}</td>
              <td>
                <span :class="getBadgeClass(c.status)" class="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {{ c.status }}
                </span>
              </td>
              <td class="text-right">
                <div class="flex items-center justify-end gap-3">
                  <div class="w-24 bg-[var(--border)] h-1.5 rounded-full overflow-hidden hide-mobile">
                    <div class="bg-[var(--primary)] dark:bg-[var(--accent)] h-full" :style="{ width: '65%' }"></div>
                  </div>
                  <span class="text-xs font-bold">65%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore }  from '@/stores/auth.js'
import { useUiStore }    from '@/stores/ui.js'
import { useAdminStore } from '@/stores/admin.js'
import ModalNewCampaign  from '@/components/common/ModalNewCampaign.vue'

const auth      = useAuthStore()
const ui        = useUiStore()
const admin     = useAdminStore()
const showModal = ref(false)

// Dashboard stats
const stats = ref({
  totalAnimals: 0,
  activeCampaigns: 0,
  mortality: 0,
  totalRevenue: 0,
})

const loading = ref(true)

// Date dynamique
const dateAujourdhui = computed(() => {
  return new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
    year:    'numeric',
  })
})

// Helpers
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  })
}

const getBadgeClass = (value) => {
  const classes = {
    'En cours': 'bg-[var(--success)]/10 text-[var(--success)]',
    'Terminée': 'bg-[var(--soft)]/10 text-[var(--soft)]',
    'Préparation': 'bg-[var(--warn)]/10 text-[var(--warn)]',
  }
  return classes[value] || 'bg-[var(--bg)] text-[var(--soft)]'
}

// Récupérer les stats du dashboard
const fetchDashboardStats = async () => {
  try {
    loading.value = true
    await Promise.all([
      admin.fetchStats(),
      admin.fetchCampaigns(),
      admin.fetchAlerts()
    ])
    
    if (admin.stats) {
      stats.value = admin.stats
    }
  } catch (error) {
    console.error("Erreur stats dashboard:", error)
    ui.error("Impossible de charger les statistiques")
  } finally {
    loading.value = false
  }
}

// Exporter en PDF
const exporterPDF = async () => {
  try {
    ui.info("Préparation de l'export PDF...")
    const { default: html2pdf } = await import('html2pdf.js')
    
    const element = document.getElementById('pdf-content')
    if (!element) throw new Error('Element introuvable')

    const opt = {
      margin: 10,
      filename: `Tableau-Bord-AgroTrack-${new Date().toLocaleDateString('fr-FR')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 1,
        useCORS: true,
        logging: false,
        letterRendering: true,
        allowTaint: true,
        onclone: (clonedDoc) => {
          // Force light mode
          clonedDoc.documentElement.classList.remove('dark')
          clonedDoc.documentElement.classList.add('light')
          
          const style = clonedDoc.createElement('style')
          style.innerHTML = `
            * { 
              color-scheme: light !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            /* Remplacement global des couleurs oklch/oklab par des fallbacks safe */
            :root {
              --primary: #3D2B1F !important;
              --accent: #F2B705 !important;
              --bg: #FDF6EC !important;
              --card: #FFFFFF !important;
              --text: #1A1008 !important;
              --soft: #7A6652 !important;
              --border: #E8D9C5 !important;
              --success: #2D6A4F !important;
              --warn: #E07B39 !important;
              --danger: #D62828 !important;
              --vol: #E8813A !important;
              --bet: #8B5E3C !important;
              --pis: #1A6B8A !important;
            }
            /* Forcer le blanc sur les fonds de cartes pour html2canvas */
            .card { background-color: #FFFFFF !important; }
            #pdf-content { background-color: #FDF6EC !important; padding: 20px !important; }
            
            /* Désactiver les gradients complexes qui utilisent oklch */
            * { background-image: none !important; }
            
            /* Remplacer TOUTES les occurrences de oklch/oklab */
            * { color: #1A1008 !important; }
            * { background-color: #FFFFFF !important; }
            * { border-color: #E8D9C5 !important; }
            
            /* Remplacements spécifiques pour les éléments importants */
            .text-slate-900 { color: #0f172a !important; }
            .text-slate-600 { color: #475569 !important; }
            .text-slate-500 { color: #64748b !important; }
            .bg-white { background-color: #ffffff !important; }
            .bg-slate-50 { background-color: #f8fafc !important; }
            .bg-slate-100 { background-color: #f1f5f9 !important; }
            .bg-emerald-600 { background-color: #059669 !important; }
            .text-emerald-600 { color: #059669 !important; }
          `
          clonedDoc.head.appendChild(style)

          // Nettoyage manuel AGRESSIF des styles calculés problématiques
          const allElements = clonedDoc.getElementsByTagName('*')
          for (let i = 0; i < allElements.length; i++) {
            const el = allElements[i]
            const computedStyle = window.getComputedStyle(el)
            
            // Remplacer FORCÉMENT toutes les couleurs
            el.style.color = '#1A1008'
            el.style.backgroundColor = '#FFFFFF'
            el.style.borderColor = '#E8D9C5'
            
            // Nettoyer les styles inline qui contiennent oklch/oklab
            const inlineStyle = el.getAttribute('style')
            if (inlineStyle && (inlineStyle.includes('oklch') || inlineStyle.includes('oklab'))) {
              el.setAttribute('style', inlineStyle.replace(/oklch\([^)]+\)/g, '#1A1008').replace(/oklab\([^)]+\)/g, '#FFFFFF'))
            }
            
            // Nettoyer les classes Tailwind problématiques
            if (el.classList.contains('text-zinc-500')) el.style.color = '#71717a'
            if (el.classList.contains('bg-white')) el.style.backgroundColor = '#ffffff'
            if (el.classList.contains('bg-emerald-600')) el.style.backgroundColor = '#059669'
            if (el.classList.contains('bg-slate-50')) el.style.backgroundColor = '#f8fafc'
            if (el.classList.contains('bg-slate-100')) el.style.backgroundColor = '#f1f5f9'
            if (el.classList.contains('text-slate-900')) el.style.color = '#0f172a'
            if (el.classList.contains('text-slate-600')) el.style.color = '#475569'
          }
          
          // Nettoyer toutes les feuilles de style
          const allStyles = clonedDoc.getElementsByTagName('style')
          for (let i = 0; i < allStyles.length; i++) {
            const styleContent = allStyles[i].innerHTML
            if (styleContent.includes('oklch') || styleContent.includes('oklab')) {
              allStyles[i].innerHTML = styleContent
                .replace(/oklch\([^)]+\)/g, '#1A1008')
                .replace(/oklab\([^)]+\)/g, '#FFFFFF')
                .replace(/color:\s*[^;]+oklch[^;]+/g, 'color: #1A1008')
                .replace(/background-color:\s*[^;]+oklch[^;]+/g, 'background-color: #FFFFFF')
            }
          }
        }
      },
      jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' }
    }
    
    await html2pdf().set(opt).from(element).save()
    ui.success("Exportation PDF terminée")

  } catch (error) {
    console.error('Erreur lors de l\'export PDF:', error)
    ui.error('Erreur lors de l\'exportation PDF')
  }
}

onMounted(() => {
  fetchDashboardStats()
})
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>