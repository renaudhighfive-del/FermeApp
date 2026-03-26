<template>
  <div id="pdf-content" class="dashboard-container">

    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="page-title holographic-text">Tableau de bord</h1>
        <p class="page-subtitle">{{ dateAujourdhui[0].toUpperCase()+dateAujourdhui.slice(1) }}</p>
      </div>
      <div class="header-actions">
        <button class="cyber-button ghost" @click="exporterPDF">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          Exporter PDF
        </button>
      </div>
    </div>

    <!-- KPIs Grid -->
    <div class="kpi-grid">
      <div class="kpi-card glass-card" v-for="(kpi, index) in kpiData" :key="index" :class="kpi.variant">
        <div class="kpi-content">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
          <div class="kpi-trend" :class="kpi.trendClass">
            <svg v-if="kpi.trendUp" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M5 15l7-7 7 7"/>
            </svg>
            <svg v-else width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7"/>
            </svg>
            {{ kpi.trend }}
          </div>
        </div>
        <div class="kpi-icon">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" v-html="kpi.icon"></svg>
        </div>
      </div>
    </div>

    <!-- Charts + Alerts Grid -->
    <div class="content-grid">
      
      <!-- Charts Section -->
      <div class="charts-section">
        <div class="glass-card chart-card">
          <div class="card-header">
            <h3 class="card-title">Performance Financière</h3>
            <div class="legend">
              <div class="legend-item">
                <div class="legend-dot primary"></div>
                <span>Revenus</span>
              </div>
              <div class="legend-item">
                <div class="legend-dot accent"></div>
                <span>Dépenses</span>
              </div>
            </div>
          </div>
          
          <div class="chart-container">
            <svg width="100%" height="100%" viewBox="0 0 600 200" preserveAspectRatio="none">
              <g stroke="var(--glass-border)" stroke-width="1" stroke-dasharray="4">
                <line x1="0" y1="40" x2="600" y2="40" />
                <line x1="0" y1="80" x2="600" y2="80" />
                <line x1="0" y1="120" x2="600" y2="120" />
                <line x1="0" y1="160" x2="600" y2="160" />
              </g>
              <!-- Bar chart -->
              <rect x="40" y="60" width="30" height="100" fill="var(--primary)" rx="4" class="chart-bar"/>
              <rect x="75" y="90" width="30" height="70" fill="var(--accent)" rx="4" class="chart-bar"/>
              <rect x="140" y="40" width="30" height="120" fill="var(--primary)" rx="4" class="chart-bar"/>
              <rect x="175" y="70" width="30" height="90" fill="var(--accent)" rx="4" class="chart-bar"/>
              <rect x="240" y="80" width="30" height="80" fill="var(--primary)" rx="4" class="chart-bar"/>
              <rect x="275" y="100" width="30" height="60" fill="var(--accent)" rx="4" class="chart-bar"/>
              <rect x="340" y="50" width="30" height="110" fill="var(--primary)" rx="4" class="chart-bar"/>
              <rect x="375" y="85" width="30" height="75" fill="var(--accent)" rx="4" class="chart-bar"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Alerts Section -->
      <div class="alerts-section">
        <div class="glass-card alerts-card">
          <div class="card-header">
            <h3 class="card-title">Alertes Récentes</h3>
            <span class="alert-badge">{{ admin.alerts.length }}</span>
          </div>
          <div class="alerts-list">
            <div v-for="alert in admin.alerts" :key="alert._id" class="alert-item" :class="alert.priority">
              <div class="alert-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                </svg>
              </div>
              <div class="alert-content">
                <div class="alert-title">{{ alert.title }}</div>
                <div class="alert-message">{{ alert.message }}</div>
                <div class="alert-date">{{ formatDate(alert.createdAt) }}</div>
              </div>
            </div>
            <div v-if="admin.alerts.length === 0" class="alerts-empty">
              Aucune alerte en attente
            </div>
          </div>
          <button class="view-all-btn">
            Voir tout le journal
          </button>
        </div>
      </div>

    </div>

    <!-- Campaigns Table -->
    <div class="glass-card table-card">
      <div class="card-header">
        <h3 class="card-title">Campagnes en cours</h3>
        <button class="view-all-link">Voir tout</button>
      </div>
      <div class="table-container">
        <table class="cyber-table">
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
              <td class="hide-mobile muted">{{ c.farm?.name || 'N/A' }}</td>
              <td class="hide-mobile muted">{{ formatDate(c.startDate) }}</td>
              <td>
                <span :class="getBadgeClass(c.status)" class="status-badge">
                  {{ c.status }}
                </span>
              </td>
              <td class="text-right">
                <div class="progress-cell">
                  <div class="progress-bar hide-mobile">
                    <div class="progress-fill" :style="{ width: getProgressPercentage(c) + '%' }"></div>
                  </div>
                  <span class="progress-value">{{ getProgressPercentage(c) }}%</span>
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

// KPI Data for template
const kpiData = computed(() => [
  {
    label: 'Total Animaux',
    value: stats.value.totalAnimals,
    trend: '+120 cette semaine',
    trendUp: true,
    trendClass: 'positive',
    variant: 'volaille',
    icon: '<circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/>'
  },
  {
    label: 'Campagnes Actives',
    value: stats.value.activeCampaigns,
    trend: '3 volaille · 2 bétail',
    trendUp: true,
    trendClass: 'neutral',
    variant: 'pis',
    icon: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3"/>'
  },
  {
    label: 'Taux de Mortalité',
    value: stats.value.mortality + '%',
    trend: '+0.3% vs sem. passée',
    trendUp: false,
    trendClass: 'negative',
    variant: 'danger',
    icon: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/>'
  },
  {
    label: 'Revenus du Mois',
    value: (stats.value.totalRevenue / 1000).toLocaleString('fr-FR') + 'k',
    trend: '+8% vs mois passé',
    trendUp: true,
    trendClass: 'positive',
    variant: 'success',
    icon: '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6"/>'
  }
])

// Helpers
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  })
}

const getProgressPercentage = (campaign) => {
  if (!campaign.initialAnimalCount || campaign.initialAnimalCount === 0) return 0
  return Math.round((campaign.currentAnimalCount / campaign.initialAnimalCount) * 100)
}

const getBadgeClass = (value) => {
  const classes = {
    'En cours': 'status-success',
    'Terminée': 'status-muted',
    'Préparation': 'status-warning',
  }
  return classes[value] || 'status-default'
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
    
    // @ts-expect-error - html2pdf types incompatibility
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
/* ===== CSS VARIABLES LOCALES ===== */
.dashboard-container {
  --primary: #0ea5e9;
  --primary-dark: #0284c7;
  --accent: #8b5cf6;
  --success: #10b981;
  --warn: #f59e0b;
  --danger: #ef4444;
  --vol: #f59e0b;
  --bet: #8b5cf6;
  --pis: #0ea5e9;
  
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --bg-rgb: 248, 250, 252;
  
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #94a3b8;
  
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(148, 163, 184, 0.2);
  --glass-blur: blur(10px);
  --glass-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --glass-shadow-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  --gradient-primary: linear-gradient(135deg, var(--primary), var(--primary-dark));
  --gradient-hologram: linear-gradient(135deg, #0ea5e9, #8b5cf6, #ec4899, #0ea5e9);
  --glow-primary: 0 0 20px rgba(14, 165, 233, 0.3);
  
  --gap-xs: 4px;
  --gap-sm: 8px;
  --gap-md: 12px;
  --gap-lg: 16px;
  --gap-xl: 24px;
  
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
  
  --border-thin: 1px;
  --transition-base: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  --font-display: ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-heading: ui-sans-serif, system-ui, -apple-system, sans-serif;
}

@media (prefers-color-scheme: dark) {
  .dashboard-container {
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --bg-tertiary: #334155;
    --bg-rgb: 30, 41, 59;
    --text-primary: #f8fafc;
    --text-secondary: #cbd5e1;
    --text-tertiary: #64748b;
    --glass-bg: rgba(30, 41, 59, 0.8);
    --glass-border: rgba(148, 163, 184, 0.1);
  }
}

/* Dashboard Container */
.dashboard-container {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
    padding: var(--gap-lg);
    animation: fadeInUp 0.5s ease-out;
}

/* Header */
.dashboard-header {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
    margin-bottom: var(--gap-sm);
}

@media (min-width: 640px) {
    .dashboard-header {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
}

.header-content {
    display: flex;
    flex-direction: column;
}

.page-title {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 700;
    margin-bottom: var(--gap-xs);
}

.holographic-text {
    background: var(--gradient-hologram);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: holographic 3s ease infinite;
}

.page-subtitle {
    font-size: 14px;
    color: var(--text-tertiary);
}

.header-actions {
    display: flex;
    gap: var(--gap-sm);
}

/* Cyber Button */
.cyber-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-sm);
    padding: var(--gap-sm) var(--gap-md);
    font-family: var(--font-heading);
    font-size: 13px;
    font-weight: 600;
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: var(--transition-base);
    border: var(--border-thin) solid transparent;
}

.cyber-button.ghost {
    background: var(--glass-bg);
    border-color: var(--glass-border);
    color: var(--text-secondary);
}

.cyber-button.ghost:hover {
    border-color: var(--primary);
    color: var(--primary);
    box-shadow: var(--glow-primary);
}

/* KPI Grid */
.kpi-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: var(--gap-md);
}

@media (min-width: 640px) {
    .kpi-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .kpi-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

/* KPI Card */
.kpi-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--gap-lg);
    border-radius: var(--radius-lg);
    transition: var(--transition-base);
    animation: fadeInUp 0.5s ease-out;
    animation-fill-mode: both;
}

.kpi-card:nth-child(1) { animation-delay: 0.1s; }
.kpi-card:nth-child(2) { animation-delay: 0.2s; }
.kpi-card:nth-child(3) { animation-delay: 0.3s; }
.kpi-card:nth-child(4) { animation-delay: 0.4s; }

.kpi-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--glass-shadow-hover);
}

.kpi-content {
    flex: 1;
}

.kpi-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-tertiary);
    margin-bottom: var(--gap-xs);
}

.kpi-value {
    font-family: var(--font-display);
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--gap-xs);
}

.kpi-trend {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 500;
}

.kpi-trend.positive {
    color: var(--success);
}

.kpi-trend.negative {
    color: var(--danger);
}

.kpi-trend.neutral {
    color: var(--text-tertiary);
}

.kpi-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.kpi-card.volaille .kpi-icon {
    background: rgba(232, 129, 58, 0.1);
    color: var(--vol);
}

.kpi-card.pis .kpi-icon {
    background: rgba(26, 107, 138, 0.1);
    color: var(--pis);
}

.kpi-card.danger .kpi-icon {
    background: rgba(214, 40, 40, 0.1);
    color: var(--danger);
}

.kpi-card.success .kpi-icon {
    background: rgba(45, 106, 79, 0.1);
    color: var(--success);
}

/* Glass Card Utility */
.glass-card {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: var(--border-thin) solid var(--glass-border);
    box-shadow: var(--glass-shadow);
}

/* Content Grid */
.content-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--gap-lg);
}

@media (min-width: 1024px) {
    .content-grid {
        grid-template-columns: 2fr 1fr;
    }
}

/* Chart Card */
.chart-card {
    padding: var(--gap-lg);
    height: 100%;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--gap-lg);
    flex-wrap: wrap;
    gap: var(--gap-sm);
}

.card-title {
    font-family: var(--font-heading);
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
}

.legend {
    display: flex;
    gap: var(--gap-md);
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--text-secondary);
}

.legend-dot {
    width: 12px;
    height: 12px;
    border-radius: var(--radius-sm);
}

.legend-dot.primary {
    background: var(--primary);
}

.legend-dot.accent {
    background: var(--accent);
}

.chart-container {
    height: 256px;
    position: relative;
}

.chart-bar {
    transition: all 0.3s ease;
}

.chart-bar:hover {
    opacity: 0.8;
}

/* Alerts Card */
.alerts-card {
    padding: var(--gap-lg);
    display: flex;
    flex-direction: column;
    height: 100%;
}

.alert-badge {
    padding: 2px 10px;
    border-radius: var(--radius-full);
    background: rgba(214, 40, 40, 0.1);
    color: var(--danger);
    font-size: 12px;
    font-weight: 700;
}

.alerts-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
    overflow-y: auto;
    max-height: 400px;
    margin-bottom: var(--gap-md);
}

.alert-item {
    display: flex;
    align-items: flex-start;
    gap: var(--gap-sm);
    padding: var(--gap-sm);
    border-radius: var(--radius-md);
    background: rgba(var(--bg-rgb, 250, 248, 245), 0.5);
    border: var(--border-thin) solid var(--glass-border);
    transition: var(--transition-base);
}

.alert-item:hover {
    border-color: var(--accent);
}

.alert-item.urgent .alert-icon {
    color: var(--danger);
}

.alert-item:not(.urgent) .alert-icon {
    color: var(--warn);
}

.alert-icon {
    flex-shrink: 0;
    margin-top: 2px;
}

.alert-content {
    flex: 1;
    min-width: 0;
}

.alert-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 2px;
}

.alert-message {
    font-size: 12px;
    color: var(--text-tertiary);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 4px;
}

.alert-date {
    font-size: 10px;
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.alerts-empty {
    text-align: center;
    padding: var(--gap-xl);
    color: var(--text-tertiary);
    font-style: italic;
    font-size: 14px;
}

.view-all-btn {
    margin-top: auto;
    padding-top: var(--gap-md);
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    color: var(--primary);
    background: none;
    border: none;
    cursor: pointer;
    transition: var(--transition-base);
}

.view-all-btn:hover {
    color: var(--accent);
    text-decoration: underline;
}

/* Table Card */
.table-card {
    padding: var(--gap-lg);
}

.view-all-link {
    font-size: 13px;
    font-weight: 600;
    color: var(--primary);
    background: none;
    border: none;
    cursor: pointer;
    transition: var(--transition-base);
}

.view-all-link:hover {
    color: var(--accent);
    text-decoration: underline;
}

/* Cyber Table */
.table-container {
    overflow-x: auto;
}

.cyber-table {
    width: 100%;
    border-collapse: collapse;
}

.cyber-table th {
    text-align: left;
    padding: var(--gap-sm) var(--gap-md);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-tertiary);
    border-bottom: var(--border-thin) solid var(--glass-border);
}

.cyber-table td {
    padding: var(--gap-md);
    font-size: 14px;
    color: var(--text-primary);
    border-bottom: var(--border-thin) solid var(--glass-border);
}

.cyber-table tbody tr {
    transition: var(--transition-base);
}

.cyber-table tbody tr:hover {
    background: rgba(var(--bg-rgb, 250, 248, 245), 0.5);
}

.cyber-table .muted {
    color: var(--text-tertiary);
}

/* Status Badge */
.status-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: var(--radius-full);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}

.status-success {
    background: rgba(45, 106, 79, 0.1);
    color: var(--success);
}

.status-warning {
    background: rgba(224, 123, 57, 0.1);
    color: var(--warn);
}

.status-muted {
    background: rgba(122, 102, 82, 0.1);
    color: var(--text-tertiary);
}

.status-default {
    background: var(--glass-bg);
    color: var(--text-secondary);
}

/* Progress */
.progress-cell {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--gap-sm);
}

.progress-bar {
    width: 96px;
    height: 6px;
    background: var(--glass-border);
    border-radius: var(--radius-full);
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--gradient-primary);
    border-radius: var(--radius-full);
    transition: width 0.3s ease;
}

.progress-value {
    font-size: 12px;
    font-weight: 700;
    color: var(--text-primary);
    min-width: 36px;
}

/* Hide on mobile */
@media (max-width: 768px) {
    .hide-mobile {
        display: none !important;
    }
}

/* Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes holographic {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
</style>