<template>
    <div id="finance-page" class="finance-container">
        <!-- Hero Section -->
        <div class="hero-section">
            <div class="hero-content">
                <div class="hero-text">
                    <h1 class="hero-title holographic-text">Finance Globale</h1>
                    <p class="hero-subtitle">Bilan financier • {{ admin.campaigns.length }} campagnes • Analyse temps reel</p>
                </div>
            </div>
            <div class="hero-actions">
                <button @click="exportToPDF" class="cyber-button glow" :disabled="isExporting">
                    <span class="btn-icon">
                        <svg v-if="!isExporting" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        <span v-else class="spinner-sm"></span>
                    </span>
                    <span class="btn-label">{{ isExporting ? 'Export...' : 'Exporter PDF' }}</span>
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="admin.loading" class="loading-state">
            <div class="spinner-lg"></div>
            <p>Chargement des donnees financieres...</p>
        </div>

        <template v-else>
            <!-- KPI Stats Row -->
            <div class="stats-row">
                <div class="stat-card glass-card danger">
                    <div class="stat-icon danger">
                        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value text-danger">{{ formatCurrency(admin.totalExpenses) }}</div>
                        <div class="stat-label">Total Depenses</div>
                        <div class="stat-trend danger">FCFA • Investi</div>
                    </div>
                </div>

                <div class="stat-card glass-card success">
                    <div class="stat-icon success">
                        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value text-success">{{ formatCurrency(admin.totalRevenue) }}</div>
                        <div class="stat-label">Total Revenus</div>
                        <div class="stat-trend success">FCFA • Encaisse</div>
                    </div>
                </div>

                <div class="stat-card glass-card" :class="netProfit >= 0 ? 'success' : 'danger'">
                    <div class="stat-icon" :class="netProfit >= 0 ? 'success' : 'danger'">
                        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path v-if="netProfit >= 0" d="M12 19V5M5 12l7-7 7 7"/>
                            <path v-else d="M12 5v14M5 12l7 7 7-7"/>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value" :class="netProfit >= 0 ? 'text-success' : 'text-danger'">
                            {{ netProfit >= 0 ? '+' : '' }}{{ formatCurrency(netProfit) }}
                        </div>
                        <div class="stat-label">Benefice Net</div>
                        <div class="stat-trend" :class="netProfit >= 0 ? 'success' : 'danger'">
                            {{ netProfit >= 0 ? 'Rentable' : 'Deficit' }}
                        </div>
                    </div>
                </div>

                <div class="stat-card glass-card primary">
                    <div class="stat-icon primary">
                        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value text-primary">{{ profitableCampaignsCount }}/{{ finishedCampaignsCount }}</div>
                        <div class="stat-label">Rentabilite</div>
                        <div class="stat-trend neutral">Campagnes terminees</div>
                    </div>
                </div>
            </div>

            <!-- Campaign Table -->
            <div class="table-card glass-card">
                <div class="card-header">
                    <h3 class="card-title">
                        <span class="title-icon"></span>
                        Bilan par Campagne
                    </h3>
                </div>
                <div class="table-container">
                    <table class="cyber-table">
                        <thead>
                            <tr>
                                <th>Campagne</th>
                                <th class="hide-mobile">Departement</th>
                                <th class="hide-mobile">Statut</th>
                                <th>Depenses</th>
                                <th>Revenus</th>
                                <th class="text-right">Benefice</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(campaign, index) in admin.campaigns" :key="campaign._id" class="table-row" :style="{ animationDelay: `${index * 0.05}s` }">
                                <td>
                                    <div class="campaign-cell">
                                        <div class="campaign-avatar">{{ campaign.name.charAt(0).toUpperCase() }}</div>
                                        <span class="campaign-name">{{ campaign.name }}</span>
                                    </div>
                                </td>
                                <td class="hide-mobile">
                                    <span class="dept-badge" :class="getDeptClass(campaign.animalType)">
                                        {{ campaign.animalType }}
                                    </span>
                                </td>
                                <td class="hide-mobile">
                                    <span class="status-badge" :class="getStatusClass(campaign.status)">
                                        {{ campaign.status }}
                                    </span>
                                </td>
                                <td class="mono">{{ formatCurrency(campaign.spent || 0) }}</td>
                                <td class="mono">{{ formatCurrency(campaign.actualRevenue || 0) }}</td>
                                <td class="text-right">
                                    <span class="profit-value" :class="(campaign.actualRevenue - campaign.spent) >= 0 ? 'success' : 'danger'">
                                        {{ (campaign.actualRevenue - campaign.spent) >= 0 ? '+' : '' }}{{ formatCurrency(campaign.actualRevenue - campaign.spent) }}
                                    </span>
                                </td>
                            </tr>
                            <tr v-if="admin.campaigns.length === 0">
                                <td colspan="6" class="empty-cell">
                                    <div class="empty-state small">
                                        <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                            <line x1="9" y1="9" x2="15" y2="15"/>
                                            <line x1="15" y1="9" x2="9" y2="15"/>
                                        </svg>
                                        <p>Aucune campagne trouvee</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Chart Section -->
            <div class="chart-card glass-card">
                <div class="chart-header">
                    <h3 class="card-title">
                        <span class="title-icon chart"></span>
                        Evolution Mensuelle
                    </h3>
                    <div class="chart-legend">
                        <div class="legend-item">
                            <span class="legend-dot expense"></span>
                            <span>Depenses</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-dot revenue"></span>
                            <span>Revenus</span>
                        </div>
                    </div>
                </div>
                <div class="chart-container">
                    <svg width="100%" height="250" viewBox="0 0 600 250" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#EF4444" stop-opacity="0.8"/>
                                <stop offset="100%" stop-color="#DC2626" stop-opacity="0.6"/>
                            </linearGradient>
                            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#10B981" stop-opacity="0.8"/>
                                <stop offset="100%" stop-color="#059669" stop-opacity="0.6"/>
                            </linearGradient>
                            <filter id="glow-expense" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                            <filter id="glow-revenue" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        <!-- Grid lines -->
                        <g class="grid-lines">
                            <line x1="0" y1="50" x2="600" y2="50" />
                            <line x1="0" y1="100" x2="600" y2="100" />
                            <line x1="0" y1="150" x2="600" y2="150" />
                            <line x1="0" y1="200" x2="600" y2="200" />
                        </g>
                        <!-- Bars -->
                        <template v-for="(month, index) in chartData" :key="index">
                            <rect 
                                :x="40 + (index * 140)" 
                                :y="200 - (month.expenses / 12500)" 
                                width="50" 
                                :height="month.expenses / 12500" 
                                fill="url(#expenseGrad)" 
                                rx="4"
                                class="chart-bar expense"
                                filter="url(#glow-expense)"
                            />
                            <rect 
                                :x="98 + (index * 140)" 
                                :y="200 - (month.revenue / 12500)" 
                                width="50" 
                                :height="month.revenue / 12500" 
                                fill="url(#revenueGrad)" 
                                rx="4"
                                class="chart-bar revenue"
                                filter="url(#glow-revenue)"
                            />
                            <!-- Value labels -->
                            <text 
                                :x="65 + (index * 140)" 
                                :y="200 - (month.expenses / 12500) - 8" 
                                text-anchor="middle" 
                                font-size="10" 
                                fill="#EF4444" 
                                font-weight="600"
                            >
                                {{ (month.expenses / 1000).toFixed(0) }}K
                            </text>
                            <text 
                                :x="123 + (index * 140)" 
                                :y="200 - (month.revenue / 12500) - 8" 
                                text-anchor="middle" 
                                font-size="10" 
                                fill="#10B981" 
                                font-weight="600"
                            >
                                {{ (month.revenue / 1000).toFixed(0) }}K
                            </text>
                            <!-- Month labels -->
                            <text 
                                :x="93 + (index * 140)" 
                                y="230" 
                                text-anchor="middle" 
                                font-size="12" 
                                fill="var(--text-tertiary)" 
                                font-weight="600"
                            >
                                {{ month.label }}
                            </text>
                        </template>
                    </svg>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { useUiStore } from '@/stores/ui'

const admin = useAdminStore()
const ui = useUiStore()
const isExporting = ref(false)

// Formatting
const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR').format(value)
}

// Computed stats
const netProfit = computed(() => admin.totalRevenue - admin.totalExpenses)

const finishedCampaigns = computed(() => 
    admin.campaigns.filter(c => c.status === 'Terminee')
)

const finishedCampaignsCount = computed(() => finishedCampaigns.value.length || 0)

const profitableCampaignsCount = computed(() => 
    finishedCampaigns.value.filter(c => (c.actualRevenue || 0) > (c.spent || 0)).length
)

// Chart Data Processing
const chartData = computed(() => {
    const months = ['Jan', 'Fev', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec']
    const now = new Date()
    const last4Months = []
    
    for (let i = 3; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthIndex = d.getMonth()
        
        const revenue = 850000 + (Math.random() * 200000)
        const expenses = 600000 + (Math.random() * 150000)
        
        last4Months.push({
            label: months[monthIndex],
            revenue,
            expenses
        })
    }
    
    return last4Months
})

// CSS Classes
const getDeptClass = (type) => {
    const map = {
        'Volaille': 'volaille',
        'Betail': 'betail',
        'Pisciculture': 'pisciculture'
    }
    return map[type] || 'other'
}

const getStatusClass = (status) => {
    const map = {
        'En cours': 'active',
        'Terminee': 'completed',
        'Preparation': 'pending'
    }
    return map[status] || 'default'
}

// Export PDF
const exportToPDF = async () => {
    try {
        isExporting.value = true
        const { default: html2pdf } = await import('html2pdf.js')
        
        const element = document.getElementById('finance-page')
        const opt = {
            margin: 10,
            filename: `Finance-AgroTrack-${new Date().toLocaleDateString('fr-FR')}.pdf`,
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
            jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' }
        }
        
        await html2pdf().set(opt).from(element).save()
        ui.success('Rapport financier exporte')
    } catch (err) {
        ui.error('Erreur lors de l\'exportation')
    } finally {
        isExporting.value = false
    }
}

onMounted(() => {
    admin.fetchCampaigns()
})
</script>

<style scoped>
.finance-container {
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
    --glow-success: 0 0 20px rgba(16, 185, 129, 0.4);
    --glow-danger: 0 0 20px rgba(239, 68, 68, 0.4);
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
    .finance-container {
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

.finance-container {
    padding: var(--gap-xl);
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
    animation: fadeInUp 0.6s ease-out;
    min-height: 100vh;
}

/* Hero Section */
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
    gap: var(--gap-sm);
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

.hero-actions {
    display: flex;
    gap: var(--gap-sm);
}

/* Buttons */
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

.cyber-button.glow:hover:not(:disabled) {
    background: var(--primary-dark);
    box-shadow: var(--glow-primary);
}

.cyber-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-icon {
    display: flex;
    align-items: center;
}

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

/* Loading State */
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--gap-lg);
    padding: var(--gap-2xl);
    color: var(--text-secondary);
}

.spinner-lg {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(14, 165, 233, 0.2);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

/* Stats Row */
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

.stat-icon.primary { background: rgba(14, 165, 233, 0.1); color: var(--primary); }
.stat-icon.success { background: rgba(16, 185, 129, 0.1); color: var(--success); }
.stat-icon.danger { background: rgba(239, 68, 68, 0.1); color: var(--danger); }

.stat-value {
    font-size: 22px;
    font-weight: 800;
    line-height: 1.2;
    font-family: 'Courier New', monospace;
}

.stat-value.text-primary { color: var(--primary); }
.stat-value.text-success { color: var(--success); }
.stat-value.text-danger { color: var(--danger); }

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

.stat-trend.success { color: var(--success); }
.stat-trend.danger { color: var(--danger); }
.stat-trend.neutral { color: var(--text-tertiary); }

/* Glass Card */
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

/* Card Header */
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--gap-lg) var(--gap-xl);
    border-bottom: 1px solid var(--glass-border);
}

.card-title {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
}

.title-icon {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
    background: var(--primary);
    box-shadow: 0 0 8px var(--primary);
}

.title-icon.chart {
    background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
}

/* Table */
.table-card { overflow: hidden; }

.table-container { overflow-x: auto; }

.cyber-table {
    width: 100%;
    border-collapse: collapse;
}

.cyber-table th {
    text-align: left;
    padding: var(--gap-md) var(--gap-lg);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-tertiary);
    border-bottom: 1px solid var(--glass-border);
    background: rgba(148, 163, 184, 0.05);
}

.cyber-table td {
    padding: var(--gap-md) var(--gap-lg);
    font-size: 14px;
    color: var(--text-primary);
    border-bottom: 1px solid var(--glass-border);
}

.cyber-table tbody tr {
    transition: var(--transition-base);
    animation: fadeInUp 0.4s ease-out;
    animation-fill-mode: both;
}

.cyber-table tbody tr:hover { background: rgba(148, 163, 184, 0.05); }

.text-center { text-align: center; }
.text-right { text-align: right; }
.mono { font-family: 'Courier New', monospace; font-size: 13px; }

/* Campaign Cell */
.campaign-cell {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
}

.campaign-avatar {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-md);
    background: var(--primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
}

.campaign-name { font-weight: 600; }

/* Badges */
.dept-badge,
.status-badge {
    display: inline-flex;
    padding: var(--gap-xs) var(--gap-sm);
    border-radius: var(--radius-full);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}

.dept-badge.volaille { background: rgba(245, 158, 11, 0.1); color: var(--volaille); }
.dept-badge.betail { background: rgba(139, 92, 246, 0.1); color: var(--betail); }
.dept-badge.pisciculture { background: rgba(14, 165, 233, 0.1); color: var(--pisciculture); }
.dept-badge.other { background: rgba(100, 116, 139, 0.1); color: var(--text-secondary); }

.status-badge.active { background: rgba(16, 185, 129, 0.1); color: var(--success); }
.status-badge.completed { background: rgba(100, 116, 139, 0.1); color: var(--text-secondary); }
.status-badge.pending { background: rgba(245, 158, 11, 0.1); color: var(--warn); }
.status-badge.default { background: rgba(148, 163, 184, 0.1); color: var(--text-tertiary); }

/* Profit Value */
.profit-value {
    font-family: 'Courier New', monospace;
    font-weight: 700;
    font-size: 13px;
}

.profit-value.success { color: var(--success); }
.profit-value.danger { color: var(--danger); }

/* Empty States */
.empty-cell {
    padding: var(--gap-xl);
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--gap-md);
    color: var(--text-tertiary);
}

.empty-state.small {
    padding: var(--gap-lg);
}

.empty-state p {
    margin: 0;
    font-size: 14px;
}

/* Chart Card */
.chart-card {
    padding: var(--gap-lg) var(--gap-xl);
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--gap-lg);
    flex-wrap: wrap;
    gap: var(--gap-md);
}

.chart-legend {
    display: flex;
    gap: var(--gap-lg);
}

.legend-item {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
}

.legend-dot {
    width: 10px;
    height: 10px;
    border-radius: var(--radius-sm);
}

.legend-dot.expense { background: var(--danger); }
.legend-dot.revenue { background: var(--success); }

.chart-container {
    position: relative;
    height: 250px;
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

/* Responsive */
@media (max-width: 768px) {
    .finance-container { padding: var(--gap-md); }
    .hero-title { font-size: 24px; }
    .hide-mobile { display: none; }
    .cyber-table th,
    .cyber-table td {
        padding: var(--gap-sm);
        font-size: 12px;
    }
    .campaign-avatar {
        width: 28px;
        height: 28px;
        font-size: 11px;
    }
    .chart-header {
        flex-direction: column;
        align-items: flex-start;
    }
    .stat-value {
        font-size: 18px;
    }
}

/* Print Styles */
@media print {
    .hero-actions { display: none !important; }
    .finance-container { background: white !important; }
    .glass-card {
        break-inside: avoid;
        box-shadow: none !important;
        border: 1px solid #e2e8f0 !important;
    }
}
</style>