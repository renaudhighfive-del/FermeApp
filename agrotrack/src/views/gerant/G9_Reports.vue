<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGerantStore } from '@/stores/gerant'
import { formatCurrency, formatDate } from '@/utils/formatters'

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

function periodLabel() {
  if (period.value === 'month') return 'Mensuel'
  if (period.value === 'quarter') return 'Trimestriel'
  return 'Campagne complète'
}

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
    const c = campaign.value
    const today = formatDate(new Date())
    const net = netProfit.value
    const netColor = net >= 0 ? '#16a34a' : '#dc2626'
    const profitLabel = net >= 0 ? 'Bénéfice net' : 'Perte nette'
    const spentPct = c.budget > 0 ? Math.min(100, Math.round(c.spent / c.budget * 100)) : 0
 
    // Style constants for PDF - Very explicit inline styles for better rendering
    const sectionTitleStyle = 'font-size: 16px; font-weight: bold; color: #14532d; border-bottom: 2px solid #14532d; padding-bottom: 5px; margin-bottom: 15px; margin-top: 25px; display: block;'
    const tableStyle = 'width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: #ffffff;'
    const tdLabelStyle = 'padding: 10px; border: 1px solid #e2e8f0; color: #64748b; font-size: 12px; background-color: #f8fafc;'
    const tdValueStyle = 'padding: 10px; border: 1px solid #e2e8f0; color: #1a202c; font-size: 12px; font-weight: bold; text-align: right; background-color: #ffffff;'
 
    const htmlContent = `
      <div style="padding: 40px; font-family: Arial, Helvetica, sans-serif; color: #1a202c; background-color: #ffffff; width: 700px; min-height: 1000px; box-sizing: border-box;">
        <!-- Header with Logo -->
        <div style="background-color: #14532d; color: #ffffff; padding: 30px; border-radius: 8px; margin-bottom: 30px; display: block; position: relative;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#86efac" stroke-width="2">
              <path d="M12 2a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9S3 15.97 3 11a9 9 0 0 1 9-9z"/>
              <path d="M12 6c-2.5 1-4 3.5-4 5.5 0 2.5 1.8 4.5 4 4.5s4-2 4-4.5c0-2-1.5-4.5-4-5.5z"/>
            </svg>
            <span style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; color: #86efac;">AgroTrack</span>
          </div>
          <div style="font-size: 28px; font-weight: bold; margin-bottom: 5px; color: #ffffff;">Rapport de Campagne</div>
          <div style="font-size: 18px; color: #86efac;">${c.name}</div>
          
          <table style="width: 100%; margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 15px; border-collapse: collapse;">
            <tr>
              <td style="font-size: 11px; color: #ffffff; background-color: transparent; border: none; padding: 5px;"><strong>Généré le:</strong> ${today}</td>
              <td style="font-size: 11px; color: #ffffff; text-align: center; background-color: transparent; border: none; padding: 5px;"><strong>Statut:</strong> ${c.status}</td>
              <td style="font-size: 11px; color: #ffffff; text-align: right; background-color: transparent; border: none; padding: 5px;"><strong>Période:</strong> ${formatDate(c.startDate)} - ${c.endDate ? formatDate(c.endDate) : 'En cours'}</td>
            </tr>
          </table>
        </div>

        <!-- Sections wrapper -->
        <div style="display: block; width: 100%;">
          <!-- Section: Performances -->
          ${sections.value.animals ? `
            <div style="${sectionTitleStyle}">📈 Performances de l'Élevage</div>
            <table style="${tableStyle}">
              <tr>
                <td style="${tdLabelStyle}">Effectif initial</td>
                <td style="${tdValueStyle}">${c.initialAnimalCount} têtes</td>
                <td style="${tdLabelStyle}">Effectif actuel</td>
                <td style="${tdValueStyle}">${c.currentAnimalCount} têtes</td>
              </tr>
              <tr>
                <td style="${tdLabelStyle}">Taux de survie</td>
                <td style="${tdValueStyle}">${survivalRate.value}%</td>
                <td style="${tdLabelStyle}">Taux de mortalité</td>
                <td style="${tdValueStyle}">${c.mortality}%</td>
              </tr>
            </table>
          ` : ''}

          <!-- Section: Finance -->
          ${sections.value.finance ? `
            <div style="${sectionTitleStyle}">💰 Bilan Financier</div>
            <table style="${tableStyle}">
              <tr>
                <td style="${tdLabelStyle}">Budget total alloué</td>
                <td style="${tdValueStyle}">${formatCurrency(c.budget)}</td>
              </tr>
              <tr>
                <td style="${tdLabelStyle}">Total des dépenses</td>
                <td style="${tdValueStyle}; color: #dc2626;">- ${formatCurrency(c.spent)}</td>
              </tr>
              <tr>
                <td style="${tdLabelStyle}">Total des revenus</td>
                <td style="${tdValueStyle}; color: #16a34a;">+ ${formatCurrency(c.actualRevenue)}</td>
              </tr>
              <tr style="background-color: ${net >= 0 ? '#f0fdf4' : '#fef2f2'};">
                <td style="padding: 15px; border: 2px solid ${netColor}; font-weight: bold; font-size: 14px;">${profitLabel}</td>
                <td style="padding: 15px; border: 2px solid ${netColor}; font-weight: bold; font-size: 16px; text-align: right; color: ${netColor};">
                  ${formatCurrency(net)}
                </td>
              </tr>
            </table>
            <div style="margin-top: 10px; background-color: #f8fafc; padding: 15px; border-radius: 8px; display: block; border: 1px solid #e2e8f0;">
              <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">Utilisation du budget (${spentPct}%)</div>
              <div style="width: 100%; height: 12px; background-color: #e2e8f0; border-radius: 6px; overflow: hidden;">
                <div style="width: ${spentPct}%; height: 100%; background-color: #dc2626;"></div>
              </div>
            </div>
          ` : ''}

          <!-- Section: Santé -->
          ${sections.value.health ? `
            <div style="${sectionTitleStyle}">🩺 État Sanitaire</div>
            <table style="${tableStyle}">
              <tr>
                <td style="${tdLabelStyle}">Animaux en bonne santé</td>
                <td style="${tdValueStyle}; color: #16a34a;">${c.currentAnimalCount - c.deaths} (${healthyPercent.value}%)</td>
              </tr>
              <tr>
                <td style="${tdLabelStyle}">Pertes (Mortalité)</td>
                <td style="${tdValueStyle}; color: #dc2626;">${c.deaths} têtes</td>
              </tr>
            </table>
          ` : ''}

          <!-- Section: Alimentation -->
          ${sections.value.feed ? `
            <div style="${sectionTitleStyle}">🌾 Alimentation & Conversion</div>
            <table style="${tableStyle}">
              <tr>
                <td style="${tdLabelStyle}">Quantité totale consommée</td>
                <td style="${tdValueStyle}">${c.feedConsumed || 0} kg</td>
              </tr>
              <tr>
                <td style="${tdLabelStyle}">Coût total de l'aliment</td>
                <td style="${tdValueStyle}">${formatCurrency(c.feedCost || 0)}</td>
              </tr>
              <tr>
                <td style="${tdLabelStyle}">Indice de Conversion (FCR)</td>
                <td style="${tdValueStyle}">${c.fcr || 'N/A'}</td>
              </tr>
            </table>
          ` : ''}
        </div>

        <!-- Footer -->
        <div style="margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; color: #94a3b8; font-size: 10px; display: block;">
          Document généré automatiquement par AgroTrack - Logiciel de gestion agricole.<br>
          © 2026 AgroTrack - Tous droits réservés.
        </div>
      </div>
    `

    const filename = `rapport-${c.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`
    
    // Config for direct string rendering
    const opt = {
      margin: [10, 10, 10, 10], // Explicit margins in mm
      filename: filename,
      image: { type: 'jpeg', quality: 1.0 }, // Max quality
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: true, // Let's keep logging to see what happens
        backgroundColor: '#ffffff' // Ensure white background
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }

    // Direct generation from string
    await html2pdf().from(htmlContent).set(opt).save()
 
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

  <div v-if="loading" class="card" style="text-align:center; padding:40px;">
    <p class="text-soft">Chargement...</p>
  </div>

  <div v-else-if="!campaign" class="card" style="text-align:center; padding:40px;">
    <p class="text-soft" style="font-size:16px;">Aucune campagne active</p>
    <RouterLink to="/gerant/campaigns" class="btn btn-primary" style="margin-top:20px;">Voir les campagnes</RouterLink>
  </div>

  <div v-else class="grid-2 mb-gap" style="align-items:start">
    <div>
      <div class="card mb-gap">
        <div class="card-title">Paramètres du rapport</div>

        <div class="form-group">
          <label class="form-label">Campagne</label>
          <select class="form-select" v-model="selectedCampaignId">
            <option v-for="c in activeCampaigns" :key="c._id || c.id" :value="c._id || c.id">{{ c.name }}</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Période</label>
          <div class="filter-group w-full">
            <button class="filter-btn" :class="{active: period === 'month'}"    @click="period = 'month'"    style="flex:1">Mois</button>
            <button class="filter-btn" :class="{active: period === 'quarter'}"  @click="period = 'quarter'"  style="flex:1">Trimestre</button>
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
