<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGerantStore } from '@/stores/gerant'

const gerantStore = useGerantStore()
const activeCampaigns = computed(() => gerantStore.activeCampaigns)
const selectedCampaignId = ref('')
const loading = ref(false)

const campaign = computed(() => {
  if (selectedCampaignId.value) {
    return activeCampaigns.value.find(c => (c._id || c.id) === selectedCampaignId.value) || activeCampaigns.value[0] || null
  }
  return activeCampaigns.value[0] || null
})

const isGenerating = ref(false)
const period = ref('campaign')

const sections = ref({
  animals: true,
  finance: true,
  health: true,
  feed: true,
  sales: false
})

onMounted(async () => {
  await loadData()
})

async function loadData() {
  loading.value = true
  try {
    await gerantStore.fetchGerantFarms()
    await gerantStore.fetchGerantCampaigns()
    
    if (activeCampaigns.value.length > 0 && !selectedCampaignId.value) {
      selectedCampaignId.value = activeCampaigns.value[0]._id || activeCampaigns.value[0].id
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    loading.value = false
  }
}

const survivalRate = computed(() => {
  if (!campaign.value || campaign.value.initialAnimalCount === 0) return 0
  return Math.round((campaign.value.currentAnimalCount / campaign.value.initialAnimalCount) * 100)
})

const healthyPercent = computed(() => {
  if (!campaign.value || campaign.value.currentAnimalCount === 0) return 0
  return Math.round(((campaign.value.currentAnimalCount - campaign.value.deaths) / campaign.value.currentAnimalCount) * 100)
})

const netProfit = computed(() => {
  if (!campaign.value) return 0
  return campaign.value.actualRevenue - campaign.value.spent
})

function formatCurrency(value) {
  if (!value) return '0 FCFA'
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M FCFA`
  return `${(value / 1000).toFixed(0)}k FCFA`
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
}

function periodLabel() {
  if (period.value === 'month') return 'Mensuel'
  if (period.value === 'quarter') return 'Trimestriel'
  return 'Campagne complète'
}

// Load html2pdf dynamically
function loadHtml2Pdf() {
  return new Promise((resolve, reject) => {
    if (window.html2pdf) return resolve(window.html2pdf)
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
    script.onload = () => resolve(window.html2pdf)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

async function generateReport() {
  if (!campaign.value) return
  isGenerating.value = true

  try {
    const html2pdf = await loadHtml2Pdf()

    // Build the HTML content for the PDF
    const c = campaign.value
    const today = formatDate(new Date())
    const net = netProfit.value
    const netColor = net >= 0 ? '#16a34a' : '#dc2626'
    const profitLabel = net >= 0 ? 'Bénéfice net' : 'Perte nette'

    const sectionAnimals = sections.value.animals ? `
      <div class="section">
        <div class="section-header">
          <div class="section-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14532d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 9c0 1.1-.4 2.1-1 2.9C16.8 13.6 15 15 12 15s-4.8-1.4-6-3.1A4.9 4.9 0 0 1 5 9c0-2.8 3.1-5 7-5s7 2.2 7 5z"/>
              <path d="M12 15v4"/>
              <path d="M8 19h8"/>
              <path d="M5 9c-1.5 0-3 .8-3 2s.5 2 2 2"/>
              <path d="M19 9c1.5 0 3 .8 3 2s-.5 2-2 2"/>
            </svg>
          </div>
          <h2 class="section-title">Performances Animaux</h2>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Effectif initial</div>
            <div class="stat-value">${c.initialAnimalCount}</div>
            <div class="stat-sub">têtes au départ</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Effectif actuel</div>
            <div class="stat-value green">${c.currentAnimalCount}</div>
            <div class="stat-sub">têtes en vie</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Taux de survie</div>
            <div class="stat-value green">${survivalRate.value}%</div>
            <div class="progress-bar">
              <div class="progress-fill green-bg" style="width:${survivalRate.value}%"></div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Taux de mortalité</div>
            <div class="stat-value red">${c.mortality}%</div>
            <div class="progress-bar">
              <div class="progress-fill red-bg" style="width:${c.mortality}%"></div>
            </div>
          </div>
        </div>
      </div>` : ''

    const sectionFinance = sections.value.finance ? `
      <div class="section">
        <div class="section-header">
          <div class="section-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14532d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
              <line x1="6" y1="15" x2="8" y2="15"/>
              <line x1="11" y1="15" x2="13" y2="15"/>
            </svg>
          </div>
          <h2 class="section-title">Bilan Financier</h2>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Budget alloué</div>
            <div class="stat-value">${formatCurrency(c.budget)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total dépenses</div>
            <div class="stat-value red">${formatCurrency(c.spent)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total revenus</div>
            <div class="stat-value green">${formatCurrency(c.actualRevenue)}</div>
          </div>
          <div class="stat-card highlight" style="border-color:${netColor}20; background:${net >= 0 ? '#f0fdf4' : '#fef2f2'}">
            <div class="stat-label">${profitLabel}</div>
            <div class="stat-value" style="color:${netColor}; font-size:22px">${formatCurrency(Math.abs(net))}</div>
          </div>
        </div>
        <div class="finance-bar-wrap">
          <div class="finance-bar-label">
            <span>Dépenses</span>
            <span>Budget restant: ${formatCurrency(c.budget - c.spent)}</span>
          </div>
          <div class="progress-bar big">
            <div class="progress-fill red-bg" style="width:${Math.min(100, Math.round(c.spent/c.budget*100))}%"></div>
          </div>
          <div class="finance-bar-label small-text">
            <span>${Math.round(c.spent/c.budget*100)}% du budget utilisé</span>
          </div>
        </div>
      </div>` : ''

    const sectionHealth = sections.value.health ? `
      <div class="section">
        <div class="section-header">
          <div class="section-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14532d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <h2 class="section-title">Résumé Santé</h2>
        </div>
        <div class="health-row">
          <div class="health-card green-card">
            <div class="health-big">${c.currentAnimalCount - c.deaths}</div>
            <div class="health-label">Animaux sains</div>
            <div class="health-pct">${healthyPercent.value}% de l'effectif</div>
          </div>
          <div class="health-card red-card">
            <div class="health-big">${c.deaths}</div>
            <div class="health-label">Décès enregistrés</div>
            <div class="health-pct">${c.mortality}% de mortalité</div>
          </div>
        </div>
      </div>` : ''

    const sectionFeed = sections.value.feed ? `
      <div class="section">
        <div class="section-header">
          <div class="section-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14532d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
          </div>
          <h2 class="section-title">Consommation Aliments</h2>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Indicateur</th>
                <th style="text-align:right">Valeur</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Aliments consommés</td>
                <td style="text-align:right; font-weight:600">${c.feedConsumed} kg</td>
              </tr>
              <tr>
                <td>Coût alimentation</td>
                <td style="text-align:right; font-weight:600">${formatCurrency(c.feedCost)}</td>
              </tr>
              <tr>
                <td>Indice de conversion (FCR)</td>
                <td style="text-align:right; font-weight:600">${c.fcr}</td>
              </tr>
              <tr>
                <td>Coût alimentation / animal</td>
                <td style="text-align:right; font-weight:600">${formatCurrency(Math.round(c.feedCost / c.currentAnimalCount))}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>` : ''

    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #1a202c;
      background: #fff;
      font-size: 13px;
      line-height: 1.5;
    }

    /* ── COVER ── */
    .cover {
      background: linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%);
      color: white;
      padding: 48px 40px 36px;
      position: relative;
      overflow: hidden;
    }
    .cover::before {
      content: '';
      position: absolute;
      top: -40px; right: -40px;
      width: 220px; height: 220px;
      border-radius: 50%;
      background: rgba(255,255,255,0.05);
    }
    .cover::after {
      content: '';
      position: absolute;
      bottom: -60px; left: 30%;
      width: 300px; height: 300px;
      border-radius: 50%;
      background: rgba(255,255,255,0.04);
    }
    .cover-badge {
      display: inline-block;
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 20px;
      padding: 4px 14px;
      font-size: 11px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    .cover-title {
      font-size: 30px;
      font-weight: 700;
      letter-spacing: -0.5px;
      line-height: 1.2;
      margin-bottom: 6px;
    }
    .cover-campaign {
      font-size: 16px;
      color: #86efac;
      font-weight: 500;
      margin-bottom: 28px;
    }
    .cover-meta {
      display: flex;
      gap: 32px;
      font-size: 12px;
      color: rgba(255,255,255,0.75);
    }
    .cover-meta strong { color: white; display: block; font-size: 13px; }

    /* ── BODY ── */
    .body { padding: 0 40px 40px; }

    /* ── SECTION ── */
    .section {
      margin-top: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid #e2e8f0;
    }
    .section:last-child { border-bottom: none; }
    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
    }
    .section-icon {
      width: 32px; height: 32px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .section-title {
      font-size: 15px;
      font-weight: 700;
      color: #14532d;
      letter-spacing: -0.2px;
    }

    /* ── STATS GRID ── */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    .stat-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 14px;
    }
    .stat-card.highlight { border-width: 1.5px; }
    .stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b; margin-bottom: 6px; }
    .stat-value { font-size: 18px; font-weight: 700; color: #1a202c; line-height: 1; margin-bottom: 4px; }
    .stat-value.green { color: #16a34a; }
    .stat-value.red   { color: #dc2626; }
    .stat-sub { font-size: 10px; color: #94a3b8; }

    /* ── PROGRESS BAR ── */
    .progress-bar {
      height: 5px;
      background: #e2e8f0;
      border-radius: 99px;
      overflow: hidden;
      margin-top: 8px;
    }
    .progress-bar.big { height: 10px; margin-top: 0; }
    .progress-fill { height: 100%; border-radius: 99px; }
    .green-bg { background: #16a34a; }
    .red-bg   { background: #dc2626; }

    /* ── FINANCE BAR ── */
    .finance-bar-wrap { margin-top: 16px; }
    .finance-bar-label { display: flex; justify-content: space-between; font-size: 11px; color: #64748b; margin-bottom: 6px; }
    .small-text { margin-top: 5px; }

    /* ── HEALTH ── */
    .health-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .health-card { border-radius: 12px; padding: 24px; text-align: center; }
    .green-card { background: #f0fdf4; border: 1.5px solid #bbf7d0; }
    .red-card   { background: #fef2f2; border: 1.5px solid #fecaca; }
    .health-big { font-size: 40px; font-weight: 800; line-height: 1; margin-bottom: 6px; }
    .green-card .health-big { color: #16a34a; }
    .red-card   .health-big { color: #dc2626; }
    .health-label { font-size: 13px; font-weight: 600; color: #374151; }
    .health-pct   { font-size: 11px; color: #6b7280; margin-top: 3px; }

    /* ── TABLE ── */
    .table-wrap { border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table thead { background: #14532d; }
    .data-table thead th { color: white; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; padding: 10px 14px; font-weight: 600; }
    .data-table tbody tr:nth-child(even) { background: #f8fafc; }
    .data-table tbody td { padding: 10px 14px; font-size: 12px; color: #374151; border-bottom: 1px solid #f1f5f9; }
    .data-table tbody tr:last-child td { border-bottom: none; }

    /* ── FOOTER ── */
    .footer {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: #94a3b8;
    }
    .footer-logo { font-weight: 700; color: #14532d; font-size: 12px; }
    .footer-confidential { 
      background: #fefce8; 
      border: 1px solid #fef08a;
      color: #713f12;
      padding: 3px 10px; 
      border-radius: 99px; 
      font-size: 10px; 
    }
  </style>
</head>
<body>

  <!-- COVER -->
  <div class="cover">
    <div class="cover-badge">AgroTrack · Rapport Officiel</div>
    <div class="cover-title">Rapport de Campagne</div>
    <div class="cover-campaign">${c.name}</div>
    <div class="cover-meta">
      <div><strong>Période</strong>${periodLabel()}</div>
      <div><strong>Généré le</strong>${today}</div>
      <div><strong>Statut</strong>${c.status || 'Active'}</div>
      <div><strong>Durée</strong>${c.startDate ? formatDate(c.startDate) : '—'} → ${c.endDate ? formatDate(c.endDate) : 'En cours'}</div>
    </div>
  </div>

  <!-- BODY -->
  <div class="body">
    ${sectionAnimals}
    ${sectionFinance}
    ${sectionHealth}
    ${sectionFeed}

    <!-- FOOTER -->
    <div class="footer">
      <div>
        <span class="footer-logo">AgroTrack</span>
        &nbsp;·&nbsp; Gestion intelligente de l'élevage
      </div>
      <div class="footer-confidential">Document confidentiel</div>
      <div>Rapport généré automatiquement le ${today}</div>
    </div>
  </div>

</body>
</html>`

    // Create a hidden div to render the HTML
    const container = document.createElement('div')
    container.innerHTML = htmlContent
    container.style.cssText = 'position:fixed; left:-9999px; top:0; width:210mm; background:white;'
    document.body.appendChild(container)

    const filename = `rapport-${c.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`

    await html2pdf().set({
      margin: 0,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }).from(container).save()

    document.body.removeChild(container)

  } catch (error) {
    console.error('Erreur génération PDF:', error)
    alert('Erreur lors de la génération du rapport PDF')
  } finally {
    isGenerating.value = false
  }
}
</script>

<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div>
        <h1 class="page-title">Rapports</h1>
        <p class="page-subtitle" v-if="campaign">Campagne {{ campaign.name }}</p>
        <p class="page-subtitle" v-else>Générez et exportez vos rapports</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" @click="generateReport" :disabled="!campaign || isGenerating">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {{ isGenerating ? 'Génération...' : 'Générer PDF' }}
        </button>
      </div>
    </div>
  </div>

  <div v-if="loading" class="card" style="text-align: center; padding: 40px;">
    <p class="text-soft">Chargement...</p>
  </div>

  <div v-else-if="!campaign" class="card" style="text-align: center; padding: 40px;">
    <p class="text-soft" style="font-size: 16px;">Aucune campagne active</p>
    <RouterLink to="/gerant/campaigns" class="btn btn-primary" style="margin-top: 20px;">Voir les campagnes</RouterLink>
  </div>

  <div v-else class="grid-2 mb-gap" style="align-items:start">
    <!-- Settings panel -->
    <div>
      <div class="card mb-gap">
        <div class="card-title">Paramètres du rapport</div>

        <div class="form-group">
          <label class="form-label">Campagne</label>
          <select class="form-select" v-model="selectedCampaignId">
            <option v-for="c in activeCampaigns" :key="c._id || c.id" :value="c._id || c.id">
              {{ c.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Période</label>
          <div class="filter-group w-full">
            <button class="filter-btn" :class="{active: period === 'month'}"   @click="period = 'month'"   style="flex:1">Mois</button>
            <button class="filter-btn" :class="{active: period === 'quarter'}" @click="period = 'quarter'" style="flex:1">Trimestre</button>
            <button class="filter-btn" :class="{active: period === 'campaign'}" @click="period = 'campaign'" style="flex:1">Campagne</button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Sections à inclure</label>
          <div class="flex flex-col gap-8" style="font-size:13px">
            <label class="flex items-center gap-8"><input type="checkbox" v-model="sections.animals"/> Performances animaux</label>
            <label class="flex items-center gap-8"><input type="checkbox" v-model="sections.finance"/> Bilan financier</label>
            <label class="flex items-center gap-8"><input type="checkbox" v-model="sections.health"/> Résumé santé</label>
            <label class="flex items-center gap-8"><input type="checkbox" v-model="sections.feed"/> Consommation aliments</label>
            <label class="flex items-center gap-8"><input type="checkbox" v-model="sections.sales"/> Détail ventes</label>
          </div>
        </div>

        <button class="btn btn-primary btn-full" @click="generateReport" :disabled="isGenerating">
          <svg v-if="!isGenerating" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {{ isGenerating ? 'Génération en cours...' : 'Générer le rapport PDF' }}
        </button>
      </div>
    </div>

    <!-- Preview panel -->
    <div class="report-preview">
      <div class="report-preview-header">
        <div class="report-preview-title">Rapport — {{ campaign.name }}</div>
        <div class="report-preview-sub">Généré le {{ formatDate(new Date()) }} · AgroTrack</div>
      </div>

      <div class="report-block" v-if="sections.animals">
        <div class="report-block-title">Performances animaux</div>
        <div class="report-stat-row"><span>Effectif initial</span><span class="fw-600">{{ campaign.initialAnimalCount }}</span></div>
        <div class="report-stat-row"><span>Effectif actuel</span><span class="fw-600" style="color:var(--success)">{{ campaign.currentAnimalCount }}</span></div>
        <div class="report-stat-row"><span>Taux de survie</span><span class="fw-600">{{ survivalRate }}%</span></div>
        <div class="report-stat-row"><span>Taux de mortalité</span><span class="fw-600" style="color:var(--danger)">{{ campaign.mortality }}%</span></div>
      </div>

      <div class="report-block" v-if="sections.finance">
        <div class="report-block-title">Bilan financier</div>
        <div class="report-stat-row"><span>Budget alloué</span><span class="fw-600">{{ formatCurrency(campaign.budget) }}</span></div>
        <div class="report-stat-row"><span>Total dépenses</span><span class="fw-600 text-danger">{{ formatCurrency(campaign.spent) }}</span></div>
        <div class="report-stat-row"><span>Total revenus</span><span class="fw-600" :style="{color: campaign.actualRevenue > 0 ? 'var(--success)' : 'var(--soft)'}">{{ formatCurrency(campaign.actualRevenue) }}</span></div>
        <div class="report-stat-row"><span>Résultat net</span><span class="fw-600" :style="{color: netProfit >= 0 ? 'var(--success)' : 'var(--danger)'}">{{ formatCurrency(netProfit) }}</span></div>
      </div>

      <div class="report-block" v-if="sections.health">
        <div class="report-block-title">Résumé santé</div>
        <div class="report-stat-row"><span>Animaux sains</span><span class="fw-600 text-success">{{ campaign.currentAnimalCount - campaign.deaths }} ({{ healthyPercent }}%)</span></div>
        <div class="report-stat-row"><span>Décès</span><span class="fw-600 text-danger">{{ campaign.deaths }}</span></div>
        <div class="report-stat-row"><span>Pertes totales</span><span class="fw-600 text-danger">{{ campaign.deaths }} ({{ campaign.mortality }}%)</span></div>
      </div>

      <div class="report-block" v-if="sections.feed">
        <div class="report-block-title">Consommation aliments</div>
        <div class="report-stat-row"><span>Aliments consommés</span><span class="fw-600">{{ campaign.feedConsumed }} kg</span></div>
        <div class="report-stat-row"><span>Coût alimentation</span><span class="fw-600">{{ formatCurrency(campaign.feedCost) }}</span></div>
        <div class="report-stat-row"><span>Indice de conversion</span><span class="fw-600">{{ campaign.fcr }}</span></div>
      </div>
    </div>
  </div>
</div>
</template>