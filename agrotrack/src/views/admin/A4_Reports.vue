<template>
<div id="reports-page">
  <div class="page-header">
    <div class="page-header-row">
      <div><h1 class="page-title">Rapports globaux</h1><p class="page-subtitle">Analyses et performances</p></div>
      <div class="page-actions">
        <div class="filter-group">
          <button class="filter-btn" :class="{active:period==='mois'}" @click="period='mois'">Mois</button>
          <button class="filter-btn" :class="{active:period==='trimestre'}" @click="period='trimestre'">Trimestre</button>
          <button class="filter-btn" :class="{active:period==='annee'}" @click="period='annee'">Année</button>
        </div>
        <button @click="exportToPDF" class="btn btn-primary btn-sm" :disabled="isExportingPDF">
          <svg v-if="!isExportingPDF" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span v-else class="spinner-sm mr-2"></span>
          {{ isExportingPDF ? 'Exportation...' : 'Exporter PDF' }}
        </button>
        <button @click="exportToExcel" class="btn btn-outline btn-sm" :disabled="isExportingExcel">
          <svg v-if="!isExportingExcel" class="mr-2" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <span v-else class="spinner-sm mr-2"></span>
          {{ isExportingExcel ? 'Exportation...' : 'Exporter Excel' }}
        </button>
      </div>
    </div>
  </div>
  <div class="grid-2 mb-gap">
    <div class="card">
      <div class="card-title">Revenus par département</div>
      <div class="chart-legend">
        <div class="chart-legend-item"><div class="legend-box" style="background:var(--vol)"></div>Volaille</div>
        <div class="chart-legend-item"><div class="legend-box" style="background:var(--bet)"></div>Bétail</div>
        <div class="chart-legend-item"><div class="legend-box" style="background:var(--pis)"></div>Pisciculture</div>
      </div>
      <svg width="100%" height="150" viewBox="0 0 460 150">
        <line x1="30" y1="10" x2="30" y2="130" stroke="#E8D9C5" stroke-width="0.5"/>
        <line x1="30" y1="130" x2="460" y2="130" stroke="#E8D9C5" stroke-width="0.5"/>
        <line x1="30" y1="50" x2="460" y2="50" stroke="#E8D9C5" stroke-width="0.5" stroke-dasharray="3"/>
        <line x1="30" y1="90" x2="460" y2="90" stroke="#E8D9C5" stroke-width="0.5" stroke-dasharray="3"/>
        <rect x="50" y="60" width="18" height="70" fill="#E8813A" rx="2"/>
        <rect x="70" y="80" width="18" height="50" fill="#8B5E3C" rx="2"/>
        <rect x="90" y="100" width="18" height="30" fill="#1A6B8A" rx="2"/>
        <rect x="150" y="40" width="18" height="90" fill="#E8813A" rx="2"/>
        <rect x="170" y="70" width="18" height="60" fill="#8B5E3C" rx="2"/>
        <rect x="190" y="95" width="18" height="35" fill="#1A6B8A" rx="2"/>
        <rect x="250" y="30" width="18" height="100" fill="#E8813A" rx="2"/>
        <rect x="270" y="65" width="18" height="65" fill="#8B5E3C" rx="2"/>
        <rect x="290" y="90" width="18" height="40" fill="#1A6B8A" rx="2"/>
        <rect x="350" y="50" width="18" height="80" fill="#E8813A" rx="2"/>
        <rect x="370" y="75" width="18" height="55" fill="#8B5E3C" rx="2"/>
        <rect x="390" y="100" width="18" height="30" fill="#1A6B8A" rx="2"/>
        <text x="79" y="145" text-anchor="middle" font-size="9" fill="#7A6652">Jan</text>
        <text x="179" y="145" text-anchor="middle" font-size="9" fill="#7A6652">Fév</text>
        <text x="279" y="145" text-anchor="middle" font-size="9" fill="#7A6652">Mars</text>
        <text x="379" y="145" text-anchor="middle" font-size="9" fill="#7A6652">Avr</text>
      </svg>
    </div>
    <div class="card">
      <div class="card-title">Mortalité globale</div>
      <svg width="100%" height="150" viewBox="0 0 460 150">
        <defs><linearGradient id="mortGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#D62828" stop-opacity="0.2"/><stop offset="100%" stop-color="#D62828" stop-opacity="0"/></linearGradient></defs>
        <line x1="30" y1="130" x2="460" y2="130" stroke="#E8D9C5" stroke-width="0.5"/>
        <line x1="30" y1="10" x2="30" y2="130" stroke="#E8D9C5" stroke-width="0.5"/>
        <line x1="30" y1="50" x2="460" y2="50" stroke="#E8D9C5" stroke-width="0.5" stroke-dasharray="3"/>
        <line x1="30" y1="90" x2="460" y2="90" stroke="#E8D9C5" stroke-width="0.5" stroke-dasharray="3"/>
        <path d="M30,110 L100,105 L150,100 L200,108 L250,95 L300,90 L350,85 L400,88 L450,80" fill="none" stroke="#D62828" stroke-width="2"/>
        <path d="M30,110 L100,105 L150,100 L200,108 L250,95 L300,90 L350,85 L400,88 L450,80 L450,130 L30,130 Z" fill="url(#mortGrad)"/>
        <text x="30" y="145" font-size="9" fill="#7A6652">Jan</text>
        <text x="240" y="145" text-anchor="middle" font-size="9" fill="#7A6652">Fév</text>
        <text x="450" y="145" text-anchor="end" font-size="9" fill="#7A6652">Mars</text>
      </svg>
    </div>
  </div>
  <div class="grid-2 mb-gap">
    <div class="card">
      <div class="card-title">Répartition des dépenses</div>
      <div class="flex gap-20 items-center">
        <svg width="130" height="130" viewBox="0 0 130 130">
          <circle cx="65" cy="65" r="50" fill="none" stroke="#E8D9C5" stroke-width="22"/>
          <circle cx="65" cy="65" r="50" fill="none" stroke="#E8813A" stroke-width="22" stroke-dasharray="141 173" stroke-dashoffset="-43" transform="rotate(-90 65 65)"/>
          <circle cx="65" cy="65" r="50" fill="none" stroke="#D62828" stroke-width="22" stroke-dasharray="79 235" stroke-dashoffset="-184" transform="rotate(-90 65 65)"/>
          <circle cx="65" cy="65" r="50" fill="none" stroke="#1A6B8A" stroke-width="22" stroke-dasharray="94 220" stroke-dashoffset="-263" transform="rotate(-90 65 65)"/>
        </svg>
        <div class="flex flex-col gap-8">
          <div class="flex items-center gap-8 text-sm"><div class="legend-dot" style="background:#E8813A;width:10px;height:10px;border-radius:50%"></div>Alimentation — 45%</div>
          <div class="flex items-center gap-8 text-sm"><div class="legend-dot" style="background:#D62828;width:10px;height:10px;border-radius:50%"></div>Médicaments — 25%</div>
          <div class="flex items-center gap-8 text-sm"><div class="legend-dot" style="background:#1A6B8A;width:10px;height:10px;border-radius:50%"></div>Main d'œuvre — 30%</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Performances par ferme</div>
      <table class="table">
        <thead><tr><th>Ferme</th><th>Animaux</th><th>Revenus</th><th>Perf.</th></tr></thead>
        <tbody>
          <tr><td class="fw-600">Ferme Nord</td><td>1 850</td><td>520 000 FCFA</td><td><span class="badge badge-encours">+12%</span></td></tr>
          <tr><td class="fw-600">Ferme Sud</td><td>1 430</td><td>380 000 FCFA</td><td><span class="badge badge-encours">+8%</span></td></tr>
          <tr><td class="fw-600">Ferme Est</td><td>1 000</td><td>340 000 FCFA</td><td><span class="badge badge-anomalie">-2%</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>
<script setup>
import { ref } from 'vue'
import html2pdf from 'html2pdf.js'
import * as XLSX from 'xlsx'

const period = ref('mois')
const isExportingPDF = ref(false)
const isExportingExcel = ref(false)

// Data for Excel Export (since we're exporting the whole page's data)
const reportsData = {
  revenues: [
    { mois: 'Janvier', volaille: 70000, betail: 50000, pisciculture: 30000 },
    { mois: 'Février', volaille: 90000, betail: 60000, pisciculture: 35000 },
    { mois: 'Mars', volaille: 100000, betail: 65000, pisciculture: 40000 },
    { mois: 'Avril', volaille: 80000, betail: 55000, pisciculture: 30000 },
  ],
  mortality: [
    { mois: 'Janvier', taux: '2.5%' },
    { mois: 'Février', taux: '2.1%' },
    { mois: 'Mars', taux: '2.8%' },
  ],
  expenses: [
    { categorie: 'Alimentation', pourcentage: '45%' },
    { categorie: 'Médicaments', pourcentage: '25%' },
    { categorie: 'Main d\'œuvre', pourcentage: '30%' },
  ],
  performance: [
    { ferme: 'Ferme Nord', animaux: 1850, revenus: '520 000 FCFA', perf: '+12%' },
    { ferme: 'Ferme Sud', animaux: 1430, revenus: '380 000 FCFA', perf: '+8%' },
    { ferme: 'Ferme Est', animaux: 1000, revenus: '340 000 FCFA', perf: '-2%' },
  ]
}

const exportToPDF = () => {
  isExportingPDF.value = true
  const element = document.getElementById('reports-page')
  
  // Clone element to avoid issues with fixed/sticky headers
  const opt = {
    margin: 10,
    filename: `Rapports_Globaux_${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
  }

  html2pdf().set(opt).from(element).save().then(() => {
    isExportingPDF.value = false
  }).catch(err => {
    console.error('PDF Export Error:', err)
    isExportingPDF.value = false
  })
}

const exportToExcel = () => {
  isExportingExcel.value = true
  try {
    const wb = XLSX.utils.book_new()
    
    // Create sheets from our data
    const wsRevenues = XLSX.utils.json_to_sheet(reportsData.revenues)
    const wsMortality = XLSX.utils.json_to_sheet(reportsData.mortality)
    const wsExpenses = XLSX.utils.json_to_sheet(reportsData.expenses)
    const wsPerformance = XLSX.utils.json_to_sheet(reportsData.performance)
    
    // Add sheets to workbook
    XLSX.utils.book_append_sheet(wb, wsRevenues, "Revenus")
    XLSX.utils.book_append_sheet(wb, wsMortality, "Mortalité")
    XLSX.utils.book_append_sheet(wb, wsExpenses, "Dépenses")
    XLSX.utils.book_append_sheet(wb, wsPerformance, "Performances")
    
    // Save file
    XLSX.writeFile(wb, `Rapports_Export_${new Date().toISOString().split('T')[0]}.xlsx`)
    isExportingExcel.value = false
  } catch (err) {
    console.error('Excel Export Error:', err)
    isExportingExcel.value = false
  }
}
</script>

<style scoped>
.spinner-sm {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(0,0,0,0.1);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.mr-2 { margin-right: 8px; }

@media print {
  .page-actions { display: none; }
}
</style>

