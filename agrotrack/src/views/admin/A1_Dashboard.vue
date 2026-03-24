<template>
  <div id="pdf-content">

    <!-- Header -->
    <div class="page-header">
      <div class="page-header-row">
        <div>
          <h1 class="page-title">Tableau de bord</h1>
          <p class="page-subtitle">{{ dateAujourdhui[0].toUpperCase()+dateAujourdhui.slice(1) }}</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-outline btn-sm" @click="exporterPDF">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exporter
          </button>
        </div>
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpi-grid mb-gap">
      <div class="kpi-card">
        <div class="kpi-top">
          <div>
            <div class="kpi-label">Total Animaux</div>
            <div class="kpi-value">{{ stats.totalAnimals }}</div>
            <div class="kpi-sub up">↑ +120 cette semaine</div>
          </div>
          <div class="kpi-icon" style="background:#FEF0E7">
            <svg width="24" height="24" fill="none" stroke="#E8813A" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></svg>
          </div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div>
            <div class="kpi-label">Campagnes Actives</div>
            <div class="kpi-value">{{ stats.activeCampaigns }}</div>
            <div class="kpi-sub">3 volaille · 2 bétail · 2 pisciculture</div>
          </div>
          <div class="kpi-icon" style="background:#E3EFF5">
            <svg width="24" height="24" fill="none" stroke="#1A6B8A" stroke-width="1.5" viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
          </div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div>
            <div class="kpi-label">Taux de Mortalité</div>
            <div class="kpi-value" style="color:var(--danger)">{{ stats.mortality }}%</div>
            <div class="kpi-sub down">↑ +0.3% vs semaine passée</div>
          </div>
          <div class="kpi-icon" style="background:#FDECEA">
            <svg width="24" height="24" fill="none" stroke="#D62828" stroke-width="1.5" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-top">
          <div>
            <div class="kpi-label">Revenus du Mois</div>
            <div class="kpi-value" style="color:var(--success)">{{ (stats.totalRevenue / 1000).toLocaleString('fr-FR') }}</div>
            <div class="kpi-sub up">↑ +8% vs mois passé · FCFA</div>
          </div>
          <div class="kpi-icon" style="background:#D4EDDA">
            <svg width="24" height="24" fill="none" stroke="#2D6A4F" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6"/></svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts + Table -->
    <div class="grid-2-1 mb-gap">
      <!-- Left: charts -->
      <div class="flex flex-col gap-20" id="content">
        <!-- Bar chart -->
        <div class="card">
          <div class="card-title">Revenus vs Dépenses par campagne</div>
          <div class="chart-legend">
            <div class="chart-legend-item"><div class="legend-box" style="background:var(--primary)"></div>Revenus</div>
            <div class="chart-legend-item"><div class="legend-box" style="background:var(--accent)"></div>Dépenses</div>
          </div>
          <svg width="100%" height="160" viewBox="0 0 520 160">
            <defs>
              <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#3D2B1F"/><stop offset="100%" stop-color="#5a3d2b"/>
              </linearGradient>
            </defs>
            <!-- Y axis lines -->
            <line x1="40" y1="10" x2="40" y2="140" stroke="#E8D9C5" stroke-width="0.5"/>
            <line x1="40" y1="40" x2="520" y2="40" stroke="#E8D9C5" stroke-width="0.5" stroke-dasharray="3"/>
            <line x1="40" y1="75" x2="520" y2="75" stroke="#E8D9C5" stroke-width="0.5" stroke-dasharray="3"/>
            <line x1="40" y1="110" x2="520" y2="110" stroke="#E8D9C5" stroke-width="0.5" stroke-dasharray="3"/>
            <line x1="40" y1="140" x2="520" y2="140" stroke="#E8D9C5" stroke-width="0.5"/>
            <!-- Y labels -->
            <text x="35" y="43" text-anchor="end" font-size="9" fill="#7A6652">900k</text>
            <text x="35" y="78" text-anchor="end" font-size="9" fill="#7A6652">600k</text>
            <text x="35" y="113" text-anchor="end" font-size="9" fill="#7A6652">300k</text>
            <!-- Bars -->
            <rect x="55"  y="50"  width="22" height="90" fill="#3D2B1F" rx="3"/>
            <rect x="80"  y="80"  width="22" height="60" fill="#F2B705" rx="3"/>
            <rect x="130" y="30"  width="22" height="110" fill="#3D2B1F" rx="3"/>
            <rect x="155" y="90"  width="22" height="50"  fill="#F2B705" rx="3"/>
            <rect x="205" y="60"  width="22" height="80"  fill="#3D2B1F" rx="3"/>
            <rect x="230" y="85"  width="22" height="55"  fill="#F2B705" rx="3"/>
            <rect x="280" y="40"  width="22" height="100" fill="#3D2B1F" rx="3"/>
            <rect x="305" y="75"  width="22" height="65"  fill="#F2B705" rx="3"/>
            <rect x="355" y="55"  width="22" height="85"  fill="#3D2B1F" rx="3"/>
            <rect x="380" y="88"  width="22" height="52"  fill="#F2B705" rx="3"/>
            <rect x="430" y="45"  width="22" height="95"  fill="#3D2B1F" rx="3"/>
            <rect x="455" y="82"  width="22" height="58"  fill="#F2B705" rx="3"/>
            <!-- X labels -->
            <text x="78"  y="155" text-anchor="middle" font-size="9" fill="#7A6652">Camp. 1</text>
            <text x="153" y="155" text-anchor="middle" font-size="9" fill="#7A6652">Camp. 2</text>
            <text x="228" y="155" text-anchor="middle" font-size="9" fill="#7A6652">Camp. 3</text>
            <text x="303" y="155" text-anchor="middle" font-size="9" fill="#7A6652">Camp. 4</text>
            <text x="378" y="155" text-anchor="middle" font-size="9" fill="#7A6652">Camp. 5</text>
            <text x="453" y="155" text-anchor="middle" font-size="9" fill="#7A6652">Camp. 6</text>
          </svg>
        </div>

        <!-- Line chart -->
        <div class="card">
          <div class="card-title">Évolution du nombre d'animaux — 30 derniers jours</div>
          <svg width="100%" height="120" viewBox="0 0 520 120">
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#E8813A" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="#E8813A" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <line x1="0" y1="30" x2="520" y2="30" stroke="#E8D9C5" stroke-width="0.5" stroke-dasharray="3"/>
            <line x1="0" y1="60" x2="520" y2="60" stroke="#E8D9C5" stroke-width="0.5" stroke-dasharray="3"/>
            <line x1="0" y1="90" x2="520" y2="90" stroke="#E8D9C5" stroke-width="0.5" stroke-dasharray="3"/>
            <path d="M0,85 L18,82 L36,78 L54,74 L72,70 L90,68 L108,65 L126,62 L144,60 L162,58 L180,55 L198,52 L216,50 L234,48 L252,46 L270,44 L288,42 L306,40 L324,38 L342,36 L360,35 L378,34 L396,33 L414,32 L432,31 L450,30 L468,29 L486,28 L504,27 L520,26" fill="none" stroke="#E8813A" stroke-width="2" stroke-linejoin="round"/>
            <path d="M0,85 L18,82 L36,78 L54,74 L72,70 L90,68 L108,65 L126,62 L144,60 L162,58 L180,55 L198,52 L216,50 L234,48 L252,46 L270,44 L288,42 L306,40 L324,38 L342,36 L360,35 L378,34 L396,33 L414,32 L432,31 L450,30 L468,29 L486,28 L504,27 L520,26 L520,110 L0,110 Z" fill="url(#lineGrad)"/>
            <text x="0" y="115" font-size="9" fill="#7A6652">J-30</text>
            <text x="248" y="115" text-anchor="middle" font-size="9" fill="#7A6652">Aujourd'hui</text>
            <text x="518" y="115" text-anchor="end" font-size="9" fill="#7A6652">J0</text>
          </svg>
        </div>

        <!-- Table -->
        <div class="card">
          <div class="card-header">
            <div class="card-title" style="margin-bottom:0">Campagnes récentes</div>
            <RouterLink to="/admin/campaigns" class="btn btn-outline btn-sm">Voir tout</RouterLink>
          </div>
          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>Campagne</th><th>Département</th><th>Statut</th>
                  <th>Animaux</th><th>Budget</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="fw-600">Campagne Mars 2026</td>
                  <td><span class="badge badge-vol">Volaille</span></td>
                  <td><span class="badge badge-encours">En cours</span></td>
                  <td>500/480</td>
                  <td>850 000 FCFA</td>
                  <td><button class="btn btn-outline btn-sm"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button></td>
                </tr>
                <tr>
                  <td class="fw-600">Lot Bœufs Fév</td>
                  <td><span class="badge badge-bet">Bétail</span></td>
                  <td><span class="badge badge-terminee">Terminée</span></td>
                  <td>45/43</td>
                  <td>2 400 000 FCFA</td>
                  <td><button class="btn btn-outline btn-sm"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button></td>
                </tr>
                <tr>
                  <td class="fw-600">Bassin Tilapia</td>
                  <td><span class="badge badge-pis">Pisciculture</span></td>
                  <td><span class="badge badge-prep">En préparation</span></td>
                  <td>0/1000</td>
                  <td>320 000 FCFA</td>
                  <td><button class="btn btn-outline btn-sm"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right: alerts panel -->
      <div class="card" style="background:#FFF8F0">
        <div class="card-title">
          <svg width="18" height="18" fill="none" stroke="var(--warn)" stroke-width="1.5" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
          Alertes actives
        </div>
        <div class="alert-card alert-danger">
          <svg width="18" height="18" fill="none" stroke="#D62828" stroke-width="1.5" viewBox="0 0 24 24" style="flex-shrink:0;margin-top:2px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
          <div class="alert-content">
            <div class="alert-title">Mortalité élevée</div>
            <div class="alert-desc">Campagne Mars 2026 · 15 pertes en 24h · Lot B</div>
            <button class="btn btn-danger btn-sm">Voir</button>
          </div>
        </div>
        <div class="alert-card alert-warning">
          <svg width="18" height="18" fill="none" stroke="#E07B39" stroke-width="1.5" viewBox="0 0 24 24" style="flex-shrink:0;margin-top:2px"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
          <div class="alert-content">
            <div class="alert-title">Stock aliment faible</div>
            <div class="alert-desc">Granulés : 20kg restants</div>
            <button class="btn btn-sm" style="background:#FFF7ED;color:var(--warn);border:1px solid var(--warn)">Commander</button>
          </div>
        </div>
        <div class="alert-card alert-info">
          <svg width="18" height="18" fill="none" stroke="#B8860B" stroke-width="1.5" viewBox="0 0 24 24" style="flex-shrink:0;margin-top:2px"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <div class="alert-content">
            <div class="alert-title">Vaccination en retard</div>
            <div class="alert-desc">Lot C — Newcastle J+14</div>
            <button class="btn btn-sm" style="background:#FFFBEB;color:#B8860B;border:1px solid var(--accent)">Planifier</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Nouvelle Campagne -->
    <ModalNewCampaign :open="showModal" @close="showModal=false"/>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore }  from '@/stores/auth.js'
import ModalNewCampaign  from '@/components/common/ModalNewCampaign.vue'
import api from '../../services/api.js'

const auth      = useAuthStore()
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

// Récupérer les stats du dashboard
const fetchDashboardStats = async () => {
  try {
    loading.value = true
    // Récupérer la farm depuis le auth store ou en créant une requête
    const response = await api.get('/settings/dashboard-stats')
    stats.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des stats:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardStats()
})

// Exporter en PDF
const exporterPDF = async () => {
  try {
    const { default: html2pdf } = await import('html2pdf.js')
    
    const element = document.getElementById('pdf-content')

    if (!element) {
      throw new Error('Element introuvable')
    }

    const opt = {
      margin: 10,
      filename: `Projet-GP-Renaud-${new Date().toLocaleDateString('fr-FR')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { 
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      }
    }
    
    html2pdf().set(opt).from(element).save()

  } catch (error) {
    console.error('Erreur lors de l\'export PDF:', error)
    alert('Erreur: ' + (error instanceof Error ? error.message : 'Erreur inconnue'))
  }
}
</script>

<style scoped>
  #pdf-content{
    margin-top: 10rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 80vh;
  }
  #content{
    overflow: hidden;
  }
</style>