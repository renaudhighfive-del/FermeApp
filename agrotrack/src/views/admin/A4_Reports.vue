<template>
    <div id="reports-page" class="reports-container">
        <!-- Hero Section with Period Selector -->
        <div class="hero-section">
            <div class="hero-content">
                <div class="hero-text">
                    <h1 class="hero-title holographic-text">Centre de Rapports</h1>
                    <p class="hero-subtitle">Analyses temps reel • Performance globale</p>
                </div>
                <div class="period-selector">
                    <button 
                        class="period-btn" 
                        :class="{ active: period === 'mois' }" 
                        @click="period = 'mois'"
                    >
                        <span class="btn-text">Mois</span>
                        <span class="btn-glow"></span>
                    </button>
                    <button 
                        class="period-btn" 
                        :class="{ active: period === 'trimestre' }" 
                        @click="period = 'trimestre'"
                    >
                        <span class="btn-text">Trimestre</span>
                        <span class="btn-glow"></span>
                    </button>
                    <button 
                        class="period-btn" 
                        :class="{ active: period === 'annee' }" 
                        @click="period = 'annee'"
                    >
                        <span class="btn-text">Annee</span>
                        <span class="btn-glow"></span>
                    </button>
                </div>
            </div>
            <div class="export-actions">
                <button @click="exportToPDF" class="cyber-button glow" :disabled="isExportingPDF">
                    <span class="btn-icon">
                        <svg v-if="!isExportingPDF" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        <span v-else class="spinner-sm"></span>
                    </span>
                    <span class="btn-label">{{ isExportingPDF ? 'Export...' : 'PDF' }}</span>
                </button>
                <button @click="exportToExcel" class="cyber-button secondary" :disabled="isExportingExcel">
                    <span class="btn-icon">
                        <svg v-if="!isExportingExcel" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                        </svg>
                        <span v-else class="spinner-sm"></span>
                    </span>
                    <span class="btn-label">{{ isExportingExcel ? 'Export...' : 'Excel' }}</span>
                </button>
            </div>
        </div>

        <!-- KPI Stats Row -->
        <div class="stats-row">
            <div class="stat-card glass-card" v-for="(stat, index) in statsData" :key="index" :class="stat.variant">
                <div class="stat-icon">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" v-html="stat.icon"></svg>
                </div>
                <div class="stat-content">
                    <div class="stat-value">{{ stat.value }}</div>
                    <div class="stat-label">{{ stat.label }}</div>
                    <div class="stat-trend" :class="stat.trendClass">
                        <svg v-if="stat.trendUp" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M5 15l7-7 7 7"/>
                        </svg>
                        <svg v-else width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M19 9l-7 7-7-7"/>
                        </svg>
                        {{ stat.trend }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts Grid -->
        <div class="charts-grid">
            <!-- Revenue Chart -->
            <div class="chart-card glass-card large">
                <div class="chart-header">
                    <div class="chart-title">
                        <span class="title-icon revenue"></span>
                        Revenus par Departement
                    </div>
                    <div class="chart-legend">
                        <div class="legend-item">
                            <span class="legend-dot volaille"></span>
                            <span>Volaille</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-dot betail"></span>
                            <span>Betail</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-dot pisciculture"></span>
                            <span>Pisciculture</span>
                        </div>
                    </div>
                </div>
                <div class="chart-container">
                    <svg width="100%" height="200" viewBox="0 0 460 200" preserveAspectRatio="none">
                        <g class="grid-lines">
                            <line x1="40" y1="20" x2="460" y2="20" />
                            <line x1="40" y1="70" x2="460" y2="70" />
                            <line x1="40" y1="120" x2="460" y2="120" />
                            <line x1="40" y1="170" x2="460" y2="170" />
                        </g>
                        <defs>
                            <filter id="glow-vol" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                            <linearGradient id="gradVol" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#F59E0B" stop-opacity="1"/>
                                <stop offset="100%" stop-color="#D97706" stop-opacity="0.8"/>
                            </linearGradient>
                            <linearGradient id="gradBet" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#8B5CF6" stop-opacity="1"/>
                                <stop offset="100%" stop-color="#7C3AED" stop-opacity="0.8"/>
                            </linearGradient>
                            <linearGradient id="gradPis" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#0EA5E9" stop-opacity="1"/>
                                <stop offset="100%" stop-color="#0284C7" stop-opacity="0.8"/>
                            </linearGradient>
                        </defs>
                        <rect x="60" y="80" width="22" height="90" fill="url(#gradVol)" rx="4" class="chart-bar volaille" filter="url(#glow-vol)"/>
                        <rect x="85" y="100" width="22" height="70" fill="url(#gradBet)" rx="4" class="chart-bar betail"/>
                        <rect x="110" y="120" width="22" height="50" fill="url(#gradPis)" rx="4" class="chart-bar pisciculture"/>
                        <rect x="180" y="50" width="22" height="120" fill="url(#gradVol)" rx="4" class="chart-bar volaille" filter="url(#glow-vol)"/>
                        <rect x="205" y="80" width="22" height="90" fill="url(#gradBet)" rx="4" class="chart-bar betail"/>
                        <rect x="230" y="110" width="22" height="60" fill="url(#gradPis)" rx="4" class="chart-bar pisciculture"/>
                        <rect x="300" y="40" width="22" height="130" fill="url(#gradVol)" rx="4" class="chart-bar volaille" filter="url(#glow-vol)"/>
                        <rect x="325" y="70" width="22" height="100" fill="url(#gradBet)" rx="4" class="chart-bar betail"/>
                        <rect x="350" y="95" width="22" height="75" fill="url(#gradPis)" rx="4" class="chart-bar pisciculture"/>
                        <rect x="410" y="60" width="22" height="110" fill="url(#gradVol)" rx="4" class="chart-bar volaille" filter="url(#glow-vol)"/>
                        <rect x="435" y="85" width="22" height="85" fill="url(#gradBet)" rx="4" class="chart-bar betail"/>
                        <text x="95" y="195" text-anchor="middle" font-size="11" fill="var(--text-tertiary)" font-weight="500">Jan</text>
                        <text x="205" y="195" text-anchor="middle" font-size="11" fill="var(--text-tertiary)" font-weight="500">Fev</text>
                        <text x="325" y="195" text-anchor="middle" font-size="11" fill="var(--text-tertiary)" font-weight="500">Mars</text>
                        <text x="435" y="195" text-anchor="middle" font-size="11" fill="var(--text-tertiary)" font-weight="500">Avr</text>
                    </svg>
                </div>
            </div>

            <!-- Mortality Chart -->
            <div class="chart-card glass-card">
                <div class="chart-header">
                    <div class="chart-title">
                        <span class="title-icon mortality"></span>
                        Tendance Mortalite
                    </div>
                    <div class="trend-indicator down">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M12 5v14M19 12l-7 7-7-7"/>
                        </svg>
                        -12% vs periode precedente
                    </div>
                </div>
                <div class="chart-container mortality-chart">
                    <svg width="100%" height="180" viewBox="0 0 460 180" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="mortArea" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#EF4444" stop-opacity="0.3"/>
                                <stop offset="100%" stop-color="#EF4444" stop-opacity="0"/>
                            </linearGradient>
                            <linearGradient id="mortLine" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stop-color="#EF4444"/>
                                <stop offset="50%" stop-color="#F87171"/>
                                <stop offset="100%" stop-color="#EF4444"/>
                            </linearGradient>
                        </defs>
                        <g class="grid-lines">
                            <line x1="40" y1="20" x2="460" y2="20" />
                            <line x1="40" y1="60" x2="460" y2="60" />
                            <line x1="40" y1="100" x2="460" y2="100" />
                            <line x1="40" y1="140" x2="460" y2="140" />
                        </g>
                        <path d="M40,120 L100,115 L160,105 L220,110 L280,95 L340,90 L400,85 L460,80 L460,160 L40,160 Z" 
                              fill="url(#mortArea)" class="area-fill"/>
                        <path d="M40,120 L100,115 L160,105 L220,110 L280,95 L340,90 L400,85 L460,80" 
                              fill="none" stroke="url(#mortLine)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="trend-line"/>
                        <circle cx="40" cy="120" r="5" fill="#EF4444" class="data-point"/>
                        <circle cx="100" cy="115" r="5" fill="#EF4444" class="data-point"/>
                        <circle cx="160" cy="105" r="5" fill="#EF4444" class="data-point"/>
                        <circle cx="220" cy="110" r="5" fill="#EF4444" class="data-point"/>
                        <circle cx="280" cy="95" r="6" fill="#EF4444" class="data-point active"/>
                        <circle cx="340" cy="90" r="5" fill="#EF4444" class="data-point"/>
                        <circle cx="400" cy="85" r="5" fill="#EF4444" class="data-point"/>
                        <circle cx="460" cy="80" r="5" fill="#EF4444" class="data-point"/>
                        <text x="40" y="175" font-size="11" fill="var(--text-tertiary)">Jan</text>
                        <text x="250" y="175" text-anchor="middle" font-size="11" fill="var(--text-tertiary)">Fev</text>
                        <text x="460" y="175" text-anchor="end" font-size="11" fill="var(--text-tertiary)">Mars</text>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Bottom Section: Expenses + Performance -->
        <div class="bottom-grid">
            <!-- Expenses Donut -->
            <div class="chart-card glass-card">
                <div class="chart-header">
                    <div class="chart-title">
                        <span class="title-icon expenses"></span>
                        Repartition des Depenses
                    </div>
                </div>
                <div class="donut-container">
                    <svg width="160" height="160" viewBox="0 0 160 160">
                        <defs>
                            <linearGradient id="donutAlim" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stop-color="#F59E0B"/>
                                <stop offset="100%" stop-color="#D97706"/>
                            </linearGradient>
                            <linearGradient id="donutMed" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stop-color="#EF4444"/>
                                <stop offset="100%" stop-color="#DC2626"/>
                            </linearGradient>
                            <linearGradient id="donutWork" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stop-color="#0EA5E9"/>
                                <stop offset="100%" stop-color="#0284C7"/>
                            </linearGradient>
                        </defs>
                        <circle cx="80" cy="80" r="60" fill="none" stroke="var(--glass-border)" stroke-width="16"/>
                        <circle cx="80" cy="80" r="60" fill="none" stroke="url(#donutAlim)" stroke-width="16" 
                                stroke-dasharray="169 207" stroke-dashoffset="-44" transform="rotate(-90 80 80)"
                                class="donut-segment"/>
                        <circle cx="80" cy="80" r="60" fill="none" stroke="url(#donutMed)" stroke-width="16" 
                                stroke-dasharray="94 282" stroke-dashoffset="-213" transform="rotate(-90 80 80)"
                                class="donut-segment"/>
                        <circle cx="80" cy="80" r="60" fill="none" stroke="url(#donutWork)" stroke-width="16" 
                                stroke-dasharray="113 263" stroke-dashoffset="-307" transform="rotate(-90 80 80)"
                                class="donut-segment"/>
                        <text x="80" y="75" text-anchor="middle" font-size="14" font-weight="700" fill="var(--text-primary)">Total</text>
                        <text x="80" y="92" text-anchor="middle" font-size="11" fill="var(--text-tertiary)">2.4M FCFA</text>
                    </svg>
                    <div class="donut-legend">
                        <div class="legend-row">
                            <span class="legend-dot alimentation"></span>
                            <div class="legend-info">
                                <span class="legend-label">Alimentation</span>
                                <span class="legend-value">45%</span>
                            </div>
                        </div>
                        <div class="legend-row">
                            <span class="legend-dot medicaments"></span>
                            <div class="legend-info">
                                <span class="legend-label">Medicaments</span>
                                <span class="legend-value">25%</span>
                            </div>
                        </div>
                        <div class="legend-row">
                            <span class="legend-dot mainoeuvre"></span>
                            <div class="legend-info">
                                <span class="legend-label">Main d'oeuvre</span>
                                <span class="legend-value">30%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Performance Table -->
            <div class="chart-card glass-card wide">
                <div class="chart-header">
                    <div class="chart-title">
                        <span class="title-icon performance"></span>
                        Performances par Ferme
                    </div>
                    <button class="view-all-btn">Voir tout</button>
                </div>
                <div class="table-container">
                    <table class="cyber-table">
                        <thead>
                            <tr>
                                <th>Ferme</th>
                                <th class="text-center">Animaux</th>
                                <th class="text-center">Revenus</th>
                                <th class="text-right">Performance</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(farm, index) in farmPerformance" :key="index" class="table-row">
                                <td>
                                    <div class="farm-cell">
                                        <div class="farm-avatar" :class="farm.variant">
                                            {{ farm.name.charAt(0) }}
                                        </div>
                                        <span class="farm-name">{{ farm.name }}</span>
                                    </div>
                                </td>
                                <td class="text-center">
                                    <span class="cell-value">{{ farm.animals.toLocaleString() }}</span>
                                </td>
                                <td class="text-center">
                                    <span class="cell-value revenue">{{ farm.revenues }}</span>
                                </td>
                                <td class="text-right">
                                    <span class="performance-badge" :class="farm.perfClass">
                                        <svg v-if="farm.perf.startsWith('+')" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                            <path d="M5 15l7-7 7 7"/>
                                        </svg>
                                        <svg v-else width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                            <path d="M19 9l-7 7-7-7"/>
                                        </svg>
                                        {{ farm.perf }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import html2pdf from 'html2pdf.js'
import * as XLSX from 'xlsx'

const period = ref('mois')
const isExportingPDF = ref(false)
const isExportingExcel = ref(false)

const statsData = computed(() => [
    {
        value: '2.4M',
        label: 'Revenus Totaux',
        trend: '+18%',
        trendUp: true,
        trendClass: 'positive',
        variant: 'success',
        icon: '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'
    },
    {
        value: '4,280',
        label: 'Animaux Actifs',
        trend: '+245',
        trendUp: true,
        trendClass: 'positive',
        variant: 'primary',
        icon: '<circle cx="12" cy="8" r="4"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>'
    },
    {
        value: '2.1%',
        label: 'Taux Mortalite',
        trend: '-0.4%',
        trendUp: false,
        trendClass: 'positive',
        variant: 'danger',
        icon: '<path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>'
    },
    {
        value: '1.8M',
        label: 'Depenses',
        trend: '+5%',
        trendUp: true,
        trendClass: 'neutral',
        variant: 'warning',
        icon: '<path d="M17 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2m2 4h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm7-5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>'
    }
])

const farmPerformance = ref([
    { name: 'Ferme Nord', animals: 1850, revenues: '520 000 FCFA', perf: '+12%', perfClass: 'success', variant: 'primary' },
    { name: 'Ferme Sud', animals: 1430, revenues: '380 000 FCFA', perf: '+8%', perfClass: 'success', variant: 'secondary' },
    { name: 'Ferme Est', animals: 1000, revenues: '340 000 FCFA', perf: '-2%', perfClass: 'danger', variant: 'tertiary' }
])

const reportsData = {
    revenues: [
        { mois: 'Janvier', volaille: 70000, betail: 50000, pisciculture: 30000 },
        { mois: 'Fevrier', volaille: 90000, betail: 60000, pisciculture: 35000 },
        { mois: 'Mars', volaille: 100000, betail: 65000, pisciculture: 40000 },
        { mois: 'Avril', volaille: 80000, betail: 55000, pisciculture: 30000 }
    ],
    mortality: [
        { mois: 'Janvier', taux: '2.5%' },
        { mois: 'Fevrier', taux: '2.1%' },
        { mois: 'Mars', taux: '2.8%' }
    ],
    expenses: [
        { categorie: 'Alimentation', pourcentage: '45%', montant: '1 080 000 FCFA' },
        { categorie: 'Medicaments', pourcentage: '25%', montant: '600 000 FCFA' },
        { categorie: 'Main d\'oeuvre', pourcentage: '30%', montant: '720 000 FCFA' }
    ],
    performance: [
        { ferme: 'Ferme Nord', animaux: 1850, revenus: '520 000 FCFA', perf: '+12%' },
        { ferme: 'Ferme Sud', animaux: 1430, revenus: '380 000 FCFA', perf: '+8%' },
        { ferme: 'Ferme Est', animaux: 1000, revenus: '340 000 FCFA', perf: '-2%' }
    ]
}

const exportToPDF = () => {
    isExportingPDF.value = true
    const element = document.getElementById('reports-page')
    
    const opt = {
        margin: 10,
        filename: `Rapports_AgroTrack_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            useCORS: true, 
            logging: false,
            onclone: (clonedDoc) => {
                clonedDoc.documentElement.classList.remove('dark')
                clonedDoc.documentElement.classList.add('light')
                
                const style = clonedDoc.createElement('style')
                style.innerHTML = `
                    * { 
                        color-scheme: light !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    :root {
                        --primary: #0EA5E9 !important;
                        --accent: #8B5CF6 !important;
                        --success: #10B981 !important;
                        --warn: #F59E0B !important;
                        --danger: #EF4444 !important;
                        --text-primary: #0F172A !important;
                        --text-secondary: #475569 !important;
                        --text-tertiary: #94A3B8 !important;
                        --glass-bg: rgba(255, 255, 255, 0.9) !important;
                    }
                `
                clonedDoc.head.appendChild(style)
            }
        },
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
        
        const wsRevenues = XLSX.utils.json_to_sheet(reportsData.revenues)
        const wsMortality = XLSX.utils.json_to_sheet(reportsData.mortality)
        const wsExpenses = XLSX.utils.json_to_sheet(reportsData.expenses)
        const wsPerformance = XLSX.utils.json_to_sheet(reportsData.performance)
        
        XLSX.utils.book_append_sheet(wb, wsRevenues, "Revenus")
        XLSX.utils.book_append_sheet(wb, wsMortality, "Mortalite")
        XLSX.utils.book_append_sheet(wb, wsExpenses, "Depenses")
        XLSX.utils.book_append_sheet(wb, wsPerformance, "Performances")
        
        XLSX.writeFile(wb, `Rapports_AgroTrack_${new Date().toISOString().split('T')[0]}.xlsx`)
        isExportingExcel.value = false
    } catch (err) {
        console.error('Excel Export Error:', err)
        isExportingExcel.value = false
    }
}
</script>

<style scoped>
.reports-container {
    --primary: #0ea5e9;
    --primary-dark: #0284c7;
    --accent: #8b5cf6;
    --success: #10b981;
    --warn: #f59e0b;
    --danger: #ef4444;
    --volaille: #f59e0b;
    --betail: #8b5cf6;
    --pisciculture: #0ea5e9;
    --bg-primary: #ffffff;
    --bg-secondary: #f8fafc;
    --bg-tertiary: #f1f5f9;
    --text-primary: #0f172a;
    --text-secondary: #475569;
    --text-tertiary: #94a3b8;
    --glass-bg: rgba(255, 255, 255, 0.7);
    --glass-border: rgba(148, 163, 184, 0.2);
    --glass-blur: blur(12px);
    --glass-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --glass-shadow-hover: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    --gradient-hologram: linear-gradient(135deg, #0ea5e9, #8b5cf6, #ec4899, #0ea5e9);
    --glow-primary: 0 0 20px rgba(14, 165, 233, 0.4);
    --gap-xs: 4px;
    --gap-sm: 8px;
    --gap-md: 12px;
    --gap-lg: 16px;
    --gap-xl: 24px;
    --gap-2xl: 32px;
    --radius-sm: 6px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    --radius-full: 9999px;
    --transition-base: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (prefers-color-scheme: dark) {
    .reports-container {
        --bg-primary: #0f172a;
        --bg-secondary: #1e293b;
        --bg-tertiary: #334155;
        --text-primary: #f8fafc;
        --text-secondary: #cbd5e1;
        --text-tertiary: #64748b;
        --glass-bg: rgba(30, 41, 59, 0.8);
        --glass-border: rgba(148, 163, 184, 0.1);
    }
}

.reports-container {
    padding: var(--gap-xl);
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
    animation: fadeInUp 0.6s ease-out;
    min-height: 100vh;
}

.hero-section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
    padding-bottom: var(--gap-lg);
    border-bottom: 1px solid var(--glass-border);
}

@media (min-width: 768px) {
    .hero-section {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
    }
}

.hero-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
}

.hero-title {
    font-size: 32px;
    font-weight: 800;
    margin: 0;
    letter-spacing: -0.02em;
}

.holographic-text {
    background: var(--gradient-hologram);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: holographic 4s ease infinite;
}

@keyframes holographic {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
}

.hero-subtitle {
    font-size: 14px;
    color: var(--text-tertiary);
    font-weight: 500;
    margin: 0;
}

.period-selector {
    display: flex;
    gap: var(--gap-xs);
    background: var(--glass-bg);
    padding: var(--gap-xs);
    border-radius: var(--radius-lg);
    border: 1px solid var(--glass-border);
    backdrop-filter: var(--glass-blur);
}

.period-btn {
    position: relative;
    padding: var(--gap-sm) var(--gap-md);
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition-base);
    overflow: hidden;
}

.period-btn:hover { color: var(--text-primary); }

.period-btn.active {
    color: var(--text-primary);
    background: var(--bg-primary);
    box-shadow: var(--glass-shadow);
}

.export-actions {
    display: flex;
    gap: var(--gap-sm);
}

.cyber-button {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--gap-sm) var(--gap-md);
    font-size: 13px;
    font-weight: 600;
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: var(--transition-base);
    border: 1px solid transparent;
    background: var(--glass-bg);
    color: var(--text-secondary);
    backdrop-filter: var(--glass-blur);
}

.cyber-button:hover:not(:disabled) {
    border-color: var(--primary);
    color: var(--primary);
    box-shadow: var(--glow-primary);
    transform: translateY(-1px);
}

.cyber-button.glow {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
}

.cyber-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.stats-row {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: var(--gap-md);
}

@media (min-width: 640px) {
    .stats-row { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
    .stats-row { grid-template-columns: repeat(4, 1fr); }
}

.stat-card {
    display: flex;
    align-items: center;
    gap: var(--gap-md);
    padding: var(--gap-lg);
    border-radius: var(--radius-xl);
    transition: var(--transition-base);
    animation: fadeInUp 0.5s ease-out;
    animation-fill-mode: both;
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.3s; }
.stat-card:nth-child(4) { animation-delay: 0.4s; }

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--glass-shadow-hover);
}

.stat-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.stat-card.success .stat-icon { background: rgba(16, 185, 129, 0.1); color: var(--success); }
.stat-card.primary .stat-icon { background: rgba(14, 165, 233, 0.1); color: var(--primary); }
.stat-card.danger .stat-icon { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
.stat-card.warning .stat-icon { background: rgba(245, 158, 11, 0.1); color: var(--warn); }

.stat-value {
    font-size: 24px;
    font-weight: 800;
    color: var(--text-primary);
    line-height: 1.2;
}

.stat-label {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-tertiary);
    margin-top: 2px;
}

.stat-trend {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 600;
    margin-top: var(--gap-xs);
}

.stat-trend.positive { color: var(--success); }
.stat-trend.negative { color: var(--danger); }
.stat-trend.neutral { color: var(--text-tertiary); }

.glass-card {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-xl);
    box-shadow: var(--glass-shadow);
    transition: var(--transition-base);
}

.glass-card:hover { box-shadow: var(--glass-shadow-hover); }

.charts-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--gap-xl);
}

@media (min-width: 1024px) {
    .charts-grid { grid-template-columns: 2fr 1fr; }
}

.chart-card {
    padding: var(--gap-xl);
    display: flex;
    flex-direction: column;
}

.chart-card.large { min-height: 320px; }

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--gap-lg);
    flex-wrap: wrap;
    gap: var(--gap-md);
}

.chart-title {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
}

.title-icon {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
}

.title-icon.revenue { background: var(--success); box-shadow: 0 0 8px var(--success); }
.title-icon.mortality { background: var(--danger); box-shadow: 0 0 8px var(--danger); }
.title-icon.expenses { background: var(--warn); box-shadow: 0 0 8px var(--warn); }
.title-icon.performance { background: var(--primary); box-shadow: 0 0 8px var(--primary); }

.chart-legend {
    display: flex;
    gap: var(--gap-md);
}

.legend-item {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
}

.legend-dot {
    width: 10px;
    height: 10px;
    border-radius: var(--radius-full);
}

.legend-dot.volaille { background: var(--volaille); }
.legend-dot.betail { background: var(--betail); }
.legend-dot.pisciculture { background: var(--pisciculture); }
.legend-dot.alimentation { background: var(--volaille); }
.legend-dot.medicaments { background: var(--danger); }
.legend-dot.mainoeuvre { background: var(--pisciculture); }

.chart-container {
    flex: 1;
    position: relative;
    min-height: 200px;
}

.grid-lines line {
    stroke: var(--glass-border);
    stroke-width: 1;
    stroke-dasharray: 4;
}

.chart-bar {
    transition: all 0.3s ease;
    cursor: pointer;
}

.chart-bar:hover {
    opacity: 0.8;
    transform: scaleY(1.02);
    transform-origin: bottom;
}

.trend-indicator {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    font-size: 12px;
    font-weight: 600;
    padding: var(--gap-xs) var(--gap-sm);
    border-radius: var(--radius-full);
}

.trend-indicator.down {
    color: var(--success);
    background: rgba(16, 185, 129, 0.1);
}

.trend-line { filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.5)); }

.data-point {
    transition: var(--transition-base);
    cursor: pointer;
}

.data-point:hover {
    r: 8;
    filter: drop-shadow(0 0 8px currentColor);
}

.data-point.active {
    r: 7;
    stroke: var(--bg-primary);
    stroke-width: 3;
}

.bottom-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--gap-xl);
}

@media (min-width: 1024px) {
    .bottom-grid { grid-template-columns: 1fr 2fr; }
}

.chart-card.wide { min-height: 320px; }

.donut-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-2xl);
    flex-wrap: wrap;
    padding: var(--gap-lg) 0;
}

.donut-segment {
    transition: var(--transition-base);
    cursor: pointer;
}

.donut-segment:hover { stroke-width: 20; }

.donut-legend {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
}

.legend-row {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
}

.legend-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.legend-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
}

.legend-value {
    font-size: 14px;
    font-weight: 800;
    color: var(--text-primary);
}

.table-container {
    overflow-x: auto;
    flex: 1;
}

.cyber-table {
    width: 100%;
    border-collapse: collapse;
}

.cyber-table th {
    text-align: left;
    padding: var(--gap-sm) var(--gap-md);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-tertiary);
    border-bottom: 1px solid var(--glass-border);
}

.cyber-table td {
    padding: var(--gap-md);
    font-size: 14px;
    color: var(--text-primary);
    border-bottom: 1px solid var(--glass-border);
}

.cyber-table tbody tr { transition: var(--transition-base); }
.cyber-table tbody tr:hover { background: rgba(148, 163, 184, 0.05); }

.text-center { text-align: center; }
.text-right { text-align: right; }

.farm-cell {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
}

.farm-avatar {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
}

.farm-avatar.primary { background: rgba(14, 165, 233, 0.15); color: var(--primary); }
.farm-avatar.secondary { background: rgba(139, 92, 246, 0.15); color: var(--accent); }
.farm-avatar.tertiary { background: rgba(245, 158, 11, 0.15); color: var(--warn); }

.farm-name { font-weight: 600; }

.cell-value {
    font-weight: 600;
    color: var(--text-secondary);
}

.cell-value.revenue {
    color: var(--success);
    font-weight: 700;
}

.performance-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: var(--gap-xs) var(--gap-sm);
    border-radius: var(--radius-full);
    font-size: 12px;
    font-weight: 700;
}

.performance-badge.success {
    background: rgba(16, 185, 129, 0.1);
    color: var(--success);
}

.performance-badge.danger {
    background: rgba(239, 68, 68, 0.1);
    color: var(--danger);
}

.view-all-btn {
    font-size: 13px;
    font-weight: 600;
    color: var(--primary);
    background: none;
    border: none;
    cursor: pointer;
    transition: var(--transition-base);
}

.view-all-btn:hover { text-decoration: underline; }

.spinner-sm {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    display: inline-block;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

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

@media (max-width: 768px) {
    .reports-container { padding: var(--gap-md); }
    .hero-title { font-size: 24px; }
    .chart-header { flex-direction: column; align-items: flex-start; }
    .chart-legend { width: 100%; justify-content: flex-start; }
    .donut-container { flex-direction: column; }
    .cyber-table th, .cyber-table td {
        padding: var(--gap-sm);
        font-size: 12px;
    }
    .farm-avatar {
        width: 32px;
        height: 32px;
        font-size: 12px;
    }
}

@media print {
    .export-actions, .period-selector, .view-all-btn { display: none !important; }
    .reports-container { background: white !important; }
    .glass-card {
        break-inside: avoid;
        box-shadow: none !important;
        border: 1px solid #e2e8f0 !important;
    }
}
</style>
