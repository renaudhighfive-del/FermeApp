<template>
    <div class="enhanced-alerts-view">
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="hero-content">
                <div class="hero-header">
                    <h1 class="hero-title">
                        <span class="title-prefix">Alert</span>
                        <span class="title-main holographic-text">Management System</span>
                    </h1>
                    <p class="hero-subtitle">Real-time monitoring and alert management for agricultural operations</p>
                </div>
                
                <div class="hero-actions">
                    <EnhancedButtonGroup
                        :buttons="actionButtons"
                        variant="primary"
                        size="medium"
                        @click="handleAction"
                    />
                </div>
            </div>
            
            <div class="hero-visual">
                <div class="alerts-sphere">
                    <div class="sphere-core"></div>
                    <div class="sphere-ring ring-1"></div>
                    <div class="sphere-ring ring-2"></div>
                    <div class="alert-indicators">
                        <div v-for="(indicator, index) in alertIndicators" :key="indicator.id" class="indicator-orbit" :style="getIndicatorStyle(index)">
                            <div class="indicator-dot" :class="`severity-${indicator.severity}`">
                                <div class="dot-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Alert Statistics -->
        <section class="stats-section">
            <div class="section-header">
                <h2 class="section-title">Alert Analytics</h2>
                <div class="live-indicator">
                    <div class="live-dot"></div>
                    <span>Live Monitoring</span>
                </div>
            </div>
            
            <div class="stats-grid">
                <EnhancedKpiCard
                    v-for="kpi in alertStats"
                    :key="kpi.id"
                    :title="kpi.title"
                    :description="kpi.description"
                    :value="kpi.value"
                    :unit="kpi.unit"
                    :icon="kpi.icon"
                    :variant="kpi.variant"
                    :change="kpi.change"
                    :progress="kpi.progress"
                    :chart-data="kpi.chartData"
                    @refresh="refreshStats"
                />
            </div>
        </section>

        <!-- Alert Dashboard -->
        <section class="alert-dashboard-section">
            <div class="section-header">
                <h2 class="section-title">Alert Dashboard</h2>
                <div class="dashboard-controls">
                    <div class="severity-filters">
                        <button 
                            v-for="severity in severityLevels" 
                            :key="severity.value"
                            class="severity-btn"
                            :class="{ active: selectedSeverities.includes(severity.value) }"
                            @click="toggleSeverity(severity.value)"
                        >
                            <div class="severity-dot" :class="`severity-${severity.value}`"></div>
                            <span>{{ severity.label }}</span>
                            <span class="severity-count">{{ getSeverityCount(severity.value) }}</span>
                        </button>
                    </div>
                    <div class="view-controls">
                        <select v-model="alertPeriod" class="period-select">
                            <option value="hour">Last Hour</option>
                            <option value="day">Last 24 Hours</option>
                            <option value="week">Last Week</option>
                            <option value="month">Last Month</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="alert-columns">
                <!-- Critical Alerts -->
                <div class="alert-column critical">
                    <div class="column-header">
                        <h3 class="column-title">Critical</h3>
                        <span class="column-count">{{ criticalAlerts.length }}</span>
                    </div>
                    <div class="alert-list">
                        <div 
                            v-for="alert in criticalAlerts" 
                            :key="alert.id"
                            class="alert-item critical"
                            @click="handleAlert(alert)"
                        >
                            <div class="alert-header">
                                <div class="alert-icon">
                                    <component :is="getAlertIcon(alert.type)" />
                                </div>
                                <div class="alert-time">{{ formatTime(alert.timestamp) }}</div>
                            </div>
                            <div class="alert-content">
                                <h4 class="alert-title">{{ alert.title }}</h4>
                                <p class="alert-message">{{ alert.message }}</p>
                                <div class="alert-meta">
                                    <span class="alert-source">{{ alert.source }}</span>
                                    <span class="alert-campaign">{{ alert.campaign }}</span>
                                </div>
                            </div>
                            <div class="alert-actions">
                                <button class="action-btn acknowledge" @click.stop="acknowledgeAlert(alert)">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                </button>
                                <button class="action-btn resolve" @click.stop="resolveAlert(alert)">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18"/>
                                        <line x1="6" y1="6" x2="18" y2="18"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Warning Alerts -->
                <div class="alert-column warning">
                    <div class="column-header">
                        <h3 class="column-title">Warning</h3>
                        <span class="column-count">{{ warningAlerts.length }}</span>
                    </div>
                    <div class="alert-list">
                        <div 
                            v-for="alert in warningAlerts" 
                            :key="alert.id"
                            class="alert-item warning"
                            @click="handleAlert(alert)"
                        >
                            <div class="alert-header">
                                <div class="alert-icon">
                                    <component :is="getAlertIcon(alert.type)" />
                                </div>
                                <div class="alert-time">{{ formatTime(alert.timestamp) }}</div>
                            </div>
                            <div class="alert-content">
                                <h4 class="alert-title">{{ alert.title }}</h4>
                                <p class="alert-message">{{ alert.message }}</p>
                                <div class="alert-meta">
                                    <span class="alert-source">{{ alert.source }}</span>
                                    <span class="alert-campaign">{{ alert.campaign }}</span>
                                </div>
                            </div>
                            <div class="alert-actions">
                                <button class="action-btn acknowledge" @click.stop="acknowledgeAlert(alert)">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                </button>
                                <button class="action-btn resolve" @click.stop="resolveAlert(alert)">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18"/>
                                        <line x1="6" y1="6" x2="18" y2="18"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Info Alerts -->
                <div class="alert-column info">
                    <div class="column-header">
                        <h3 class="column-title">Info</h3>
                        <span class="column-count">{{ infoAlerts.length }}</span>
                    </div>
                    <div class="alert-list">
                        <div 
                            v-for="alert in infoAlerts" 
                            :key="alert.id"
                            class="alert-item info"
                            @click="handleAlert(alert)"
                        >
                            <div class="alert-header">
                                <div class="alert-icon">
                                    <component :is="getAlertIcon(alert.type)" />
                                </div>
                                <div class="alert-time">{{ formatTime(alert.timestamp) }}</div>
                            </div>
                            <div class="alert-content">
                                <h4 class="alert-title">{{ alert.title }}</h4>
                                <p class="alert-message">{{ alert.message }}</p>
                                <div class="alert-meta">
                                    <span class="alert-source">{{ alert.source }}</span>
                                    <span class="alert-campaign">{{ alert.campaign }}</span>
                                </div>
                            </div>
                            <div class="alert-actions">
                                <button class="action-btn acknowledge" @click.stop="acknowledgeAlert(alert)">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                </button>
                                <button class="action-btn resolve" @click.stop="resolveAlert(alert)">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18"/>
                                        <line x1="6" y1="6" x2="18" y2="18"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Alert Trends -->
        <section class="trends-section glass-card">
            <div class="section-header">
                <h2 class="section-title">Alert Trends Analysis</h2>
                <div class="trend-controls">
                    <select v-model="trendPeriod" class="trend-select">
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                        <option value="quarter">Last Quarter</option>
                    </select>
                </div>
            </div>
            
            <div class="trends-content">
                <div class="trend-chart">
                    <svg class="trend-svg" viewBox="0 0 800 300">
                        <defs>
                            <linearGradient id="criticalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color:var(--danger);stop-opacity:0.8" />
                                <stop offset="100%" style="stop-color:var(--danger);stop-opacity:0.1" />
                            </linearGradient>
                            <linearGradient id="warningGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color:var(--warning);stop-opacity:0.8" />
                                <stop offset="100%" style="stop-color:var(--warning);stop-opacity:0.1" />
                            </linearGradient>
                            <linearGradient id="infoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color:var(--info);stop-opacity:0.8" />
                                <stop offset="100%" style="stop-color:var(--info);stop-opacity:0.1" />
                            </linearGradient>
                        </defs>
                        
                        <!-- Grid -->
                        <g class="chart-grid">
                            <line v-for="i in 6" :key="`h-${i}`" 
                                x1="60" y1="40" x2="740" y2="40" 
                                :y1="i * 35 + 30"
                                stroke="var(--border)" stroke-width="1" stroke-dasharray="2,2" />
                            <line v-for="i in 10" :key="`v-${i}`" 
                                x1="60" y1="30" x2="60" y2="240"
                                :x1="i * 70 + 60"
                                stroke="var(--border)" stroke-width="1" stroke-dasharray="2,2" />
                        </g>
                        
                        <!-- Trend lines -->
                        <g class="trend-lines">
                            <!-- Critical alerts area -->
                            <path :d="criticalTrendPath" fill="url(#criticalGradient)" />
                            <path :d="criticalTrendLine" stroke="var(--danger)" stroke-width="2" fill="none" />
                            
                            <!-- Warning alerts area -->
                            <path :d="warningTrendPath" fill="url(#warningGradient)" />
                            <path :d="warningTrendLine" stroke="var(--warning)" stroke-width="2" fill="none" />
                            
                            <!-- Info alerts area -->
                            <path :d="infoTrendPath" fill="url(#infoGradient)" />
                            <path :d="infoTrendLine" stroke="var(--info)" stroke-width="2" fill="none" />
                        </g>
                    </svg>
                </div>
                
                <div class="trend-summary">
                    <div class="summary-card">
                        <h4 class="summary-title">Peak Alert Time</h4>
                        <p class="summary-value">14:00 - 16:00</p>
                        <p class="summary-description">Most alerts occur during afternoon operations</p>
                    </div>
                    <div class="summary-card">
                        <h4 class="summary-title">Average Resolution Time</h4>
                        <p class="summary-value">23 minutes</p>
                        <p class="summary-description">Down from 45 minutes last month</p>
                    </div>
                    <div class="summary-card">
                        <h4 class="summary-title">Most Common Type</h4>
                        <p class="summary-value">Health Monitoring</p>
                        <p class="summary-description">42% of all alerts this period</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Alert Configuration -->
        <section class="config-section glass-card">
            <div class="section-header">
                <h2 class="section-title">Alert Configuration</h2>
                <div class="config-actions">
                    <button class="config-btn" @click="addNewRule">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Add Rule
                    </button>
                </div>
            </div>
            
            <div class="config-content">
                <EnhancedTable
                    title="Alert Rules"
                    subtitle="Configure automated alert triggers and notifications"
                    :data="alertRules"
                    :columns="ruleColumns"
                    @row-click="editRule"
                    @refresh="loadRules"
                    @export="exportRules"
                >
                    <template #cell-trigger="{ row }">
                        <div class="trigger-cell">
                            <span class="trigger-condition">{{ row.condition }}</span>
                            <span class="trigger-threshold">{{ row.threshold }}</span>
                        </div>
                    </template>
                    
                    <template #cell-actions="{ row }">
                        <div class="rule-actions">
                            <button class="action-btn edit" @click="editRule(row)">
                                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                            </button>
                            <button class="action-btn toggle" @click="toggleRule(row)">
                                <div class="toggle-switch" :class="{ active: row.enabled }">
                                    <div class="toggle-slider"></div>
                                </div>
                            </button>
                            <button class="action-btn delete" @click="deleteRule(row)">
                                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                </svg>
                            </button>
                        </div>
                    </template>
                </EnhancedTable>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { useUiStore } from '@/stores/ui'
import EnhancedKpiCard from '@/components/common/EnhancedKpiCard.vue'
import EnhancedTable from '@/components/common/EnhancedTable.vue'
import EnhancedButtonGroup from '@/components/common/EnhancedButtonGroup.vue'

// Stores
const admin = useAdminStore()
const ui = useUiStore()

// State
const selectedSeverities = ref(['critical', 'warning', 'info'])
const alertPeriod = ref('day')
const trendPeriod = ref('week')

// Mock Data
const alertStats = ref([
    {
        id: 1,
        title: 'Total Alerts',
        description: 'All alerts in the selected period',
        value: '247',
        unit: 'alerts',
        icon: 'AlertIcon',
        variant: 'primary',
        change: -12.5,
        progress: 65,
        chartData: [
            { value: 320 },
            { value: 280 },
            { value: 290 },
            { value: 310 },
            { value: 270 },
            { value: 250 },
            { value: 247 }
        ]
    },
    {
        id: 2,
        title: 'Critical Alerts',
        description: 'High priority alerts requiring immediate action',
        value: '23',
        unit: 'critical',
        icon: 'CriticalIcon',
        variant: 'danger',
        change: -8.3,
        progress: 15,
        chartData: [
            { value: 35 },
            { value: 28 },
            { value: 32 },
            { value: 30 },
            { value: 25 },
            { value: 24 },
            { value: 23 }
        ]
    },
    {
        id: 3,
        title: 'Avg Resolution Time',
        description: 'Average time to resolve alerts',
        value: '23',
        unit: 'minutes',
        icon: 'TimeIcon',
        variant: 'success',
        change: -35.2,
        progress: 78,
        chartData: [
            { value: 45 },
            { value: 42 },
            { value: 38 },
            { value: 35 },
            { value: 30 },
            { value: 25 },
            { value: 23 }
        ]
    },
    {
        id: 4,
        title: 'False Positives',
        description: 'Alerts that were not actual issues',
        value: '8.2',
        unit: '%',
        icon: 'WarningIcon',
        variant: 'warning',
        change: -2.1,
        progress: 12,
        chartData: [
            { value: 12 },
            { value: 11 },
            { value: 10 },
            { value: 9 },
            { value: 8.5 },
            { value: 8.3 },
            { value: 8.2 }
        ]
    }
])

const alertIndicators = ref([
    { id: 'critical', severity: 'critical' },
    { id: 'warning', severity: 'warning' },
    { id: 'info', severity: 'info' }
])

const actionButtons = ref([
    { id: 'test', text: 'Test Alert', icon: 'TestIcon', variant: 'secondary' },
    { id: 'silence', text: 'Silence All', icon: 'SilenceIcon', variant: 'ghost' },
    { id: 'export', text: 'Export Data', icon: 'DownloadIcon', variant: 'ghost' }
])

const severityLevels = ref([
    { value: 'critical', label: 'Critical' },
    { value: 'warning', label: 'Warning' },
    { value: 'info', label: 'Info' }
])

const alerts = ref([
    {
        id: 1,
        title: 'Disease Outbreak Detected',
        message: 'Multiple animals showing symptoms in Farm Alpha',
        type: 'health',
        severity: 'critical',
        source: 'Farm Alpha',
        campaign: 'Volailles Spring 2024',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        status: 'active'
    },
    {
        id: 2,
        title: 'Feed Stock Critical',
        message: 'Poultry feed inventory below 10% threshold',
        type: 'inventory',
        severity: 'critical',
        source: 'Farm Beta',
        campaign: 'Betal Growth Cycle',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: 'active'
    },
    {
        id: 3,
        title: 'Temperature Anomaly',
        message: 'Unusual temperature patterns detected in Livestock area',
        type: 'environmental',
        severity: 'warning',
        source: 'Farm Gamma',
        campaign: 'Aquaculture Q2',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        status: 'active'
    },
    {
        id: 4,
        title: 'Vaccination Due',
        message: 'Scheduled vaccination for 15 animals overdue',
        type: 'health',
        severity: 'warning',
        source: 'Farm Alpha',
        campaign: 'Volailles Spring 2024',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'active'
    },
    {
        id: 5,
        title: 'Water Quality Alert',
        message: 'pH levels slightly outside optimal range',
        type: 'environmental',
        severity: 'info',
        source: 'Farm Gamma',
        campaign: 'Aquaculture Q2',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        status: 'active'
    },
    {
        id: 6,
        title: 'Weight Gain Monitoring',
        message: 'Some animals showing below expected weight gain',
        type: 'performance',
        severity: 'info',
        source: 'Farm Beta',
        campaign: 'Betal Growth Cycle',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        status: 'active'
    }
])

const alertRules = ref([
    {
        id: 1,
        name: 'High Mortality Rate',
        condition: 'Mortality Rate',
        threshold: '> 5%',
        type: 'health',
        enabled: true
    },
    {
        id: 2,
        name: 'Low Feed Inventory',
        condition: 'Feed Stock',
        threshold: '< 20%',
        type: 'inventory',
        enabled: true
    },
    {
        id: 3,
        name: 'Temperature Deviation',
        condition: 'Temperature',
        threshold: '±5°C',
        type: 'environmental',
        enabled: false
    }
])

const ruleColumns = ref([
    { key: 'name', label: 'Rule Name', sortable: true },
    { key: 'trigger', label: 'Trigger' },
    { key: 'type', label: 'Type' },
    { key: 'actions', label: 'Actions' }
])

const trendData = ref([
    { hour: '00:00', critical: 2, warning: 8, info: 12 },
    { hour: '04:00', critical: 1, warning: 5, info: 8 },
    { hour: '08:00', critical: 3, warning: 12, info: 15 },
    { hour: '12:00', critical: 5, warning: 18, info: 22 },
    { hour: '16:00', critical: 8, warning: 25, info: 18 },
    { hour: '20:00', critical: 4, warning: 14, info: 10 }
])

// Computed
const criticalAlerts = computed(() => {
    return alerts.value.filter(alert => alert.severity === 'critical')
})

const warningAlerts = computed(() => {
    return alerts.value.filter(alert => alert.severity === 'warning')
})

const infoAlerts = computed(() => {
    return alerts.value.filter(alert => alert.severity === 'info')
})

const criticalTrendPath = computed(() => {
    const maxCritical = Math.max(...trendData.value.map(d => d.critical))
    const points = trendData.value.map((point, index) => {
        const x = index * 120 + 60
        const y = 240 - (point.critical / maxCritical) * 180
        return `${x},${y}`
    })
    return `M ${points.join(' L ')} L 720,240 L 60,240 Z`
})

const criticalTrendLine = computed(() => {
    const maxCritical = Math.max(...trendData.value.map(d => d.critical))
    const points = trendData.value.map((point, index) => {
        const x = index * 120 + 60
        const y = 240 - (point.critical / maxCritical) * 180
        return `${x},${y}`
    })
    return `M ${points.join(' L ')}`
})

const warningTrendPath = computed(() => {
    const maxWarning = Math.max(...trendData.value.map(d => d.warning))
    const points = trendData.value.map((point, index) => {
        const x = index * 120 + 60
        const y = 240 - (point.warning / maxWarning) * 180
        return `${x},${y}`
    })
    return `M ${points.join(' L ')} L 720,240 L 60,240 Z`
})

const warningTrendLine = computed(() => {
    const maxWarning = Math.max(...trendData.value.map(d => d.warning))
    const points = trendData.value.map((point, index) => {
        const x = index * 120 + 60
        const y = 240 - (point.warning / maxWarning) * 180
        return `${x},${y}`
    })
    return `M ${points.join(' L ')}`
})

const infoTrendPath = computed(() => {
    const maxInfo = Math.max(...trendData.value.map(d => d.info))
    const points = trendData.value.map((point, index) => {
        const x = index * 120 + 60
        const y = 240 - (point.info / maxInfo) * 180
        return `${x},${y}`
    })
    return `M ${points.join(' L ')} L 720,240 L 60,240 Z`
})

const infoTrendLine = computed(() => {
    const maxInfo = Math.max(...trendData.value.map(d => d.info))
    const points = trendData.value.map((point, index) => {
        const x = index * 120 + 60
        const y = 240 - (point.info / maxInfo) * 180
        return `${x},${y}`
    })
    return `M ${points.join(' L ')}`
})

// Methods
const handleAction = (button) => {
    switch (button.id) {
        case 'test':
            ui.info('Test alert sent successfully')
            break
        case 'silence':
            ui.info('All alerts silenced for 1 hour')
            break
        case 'export':
            ui.info('Alert data exported successfully')
            break
    }
}

const toggleSeverity = (severity) => {
    const index = selectedSeverities.value.indexOf(severity)
    if (index > -1) {
        selectedSeverities.value.splice(index, 1)
    } else {
        selectedSeverities.value.push(severity)
    }
}

const getSeverityCount = (severity) => {
    return alerts.value.filter(alert => alert.severity === severity).length
}

const handleAlert = (alert) => {
    console.log('Alert selected:', alert)
    ui.info(`Opening alert details for: ${alert.title}`)
}

const acknowledgeAlert = (alert) => {
    ui.success(`Alert acknowledged: ${alert.title}`)
    // In real app, update alert status
}

const resolveAlert = (alert) => {
    ui.success(`Alert resolved: ${alert.title}`)
    // In real app, remove or update alert
}

const getAlertIcon = (type) => {
    const icons = {
        health: 'HealthIcon',
        inventory: 'InventoryIcon',
        environmental: 'EnvironmentIcon',
        performance: 'PerformanceIcon'
    }
    return icons[type] || 'AlertIcon'
}

const formatTime = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
}

const refreshStats = () => {
    console.log('Refreshing alert stats...')
}

const editRule = (rule) => {
    console.log('Edit rule:', rule)
    ui.info(`Editing rule: ${rule.name}`)
}

const toggleRule = (rule) => {
    rule.enabled = !rule.enabled
    ui.success(`Rule ${rule.name} ${rule.enabled ? 'enabled' : 'disabled'}`)
}

const deleteRule = async (rule) => {
    const confirmed = await ui.confirm({
        title: 'Delete Alert Rule',
        message: `Are you sure you want to delete the rule "${rule.name}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
    })
    
    if (confirmed) {
        ui.success(`Rule deleted: ${rule.name}`)
    }
}

const addNewRule = () => {
    ui.info('Add new rule functionality coming soon')
}

const loadRules = async () => {
    console.log('Loading alert rules...')
}

const exportRules = (data) => {
    console.log('Export alert rules:', data)
    ui.success('Alert rules exported successfully')
}

const getIndicatorStyle = (index) => {
    const angle = (index * 120) * Math.PI / 180
    const radius = 70
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    
    return {
        transform: `translate(${x}px, ${y}px)`,
        animationDelay: `${index * 0.3}s`
    }
}

// Lifecycle
onMounted(() => {
    // Initialize alerts monitoring
    console.log('Alerts monitoring initialized')
})
</script>

<style scoped>
/* =============================================
   ENHANCED ALERTS VIEW STYLES
   ============================================= */
.enhanced-alerts-view {
    min-height: 100vh;
    padding: var(--gap-2xl);
    background: var(--bg-primary);
}

/* Hero Section */
.hero-section {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: var(--gap-2xl);
    align-items: center;
    margin-bottom: var(--gap-2xl);
    min-height: 450px;
}

.hero-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
}

.hero-header {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
}

.hero-title {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
    margin: 0;
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 900;
    line-height: 1.1;
}

.title-prefix {
    color: var(--text-secondary);
    font-size: 0.4em;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.2em;
}

.title-main {
    margin: 0;
}

.hero-subtitle {
    font-size: 18px;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.5;
    max-width: 600px;
}

.hero-visual {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.alerts-sphere {
    position: relative;
    width: 250px;
    height: 250px;
}

.sphere-core {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    background: var(--gradient-primary);
    border-radius: var(--radius-full);
    box-shadow: var(--glow-primary);
    animation: glowPulse 3s ease-in-out infinite;
}

.sphere-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: var(--border-thin) solid var(--accent);
    border-radius: var(--radius-full);
    opacity: 0.6;
}

.ring-1 {
    width: 100px;
    height: 100px;
    animation: rotate 12s linear infinite;
}

.ring-2 {
    width: 150px;
    height: 150px;
    animation: rotate 18s linear infinite reverse;
}

.alert-indicators {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.indicator-orbit {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 36px;
    height: 36px;
    animation: float 4s ease-in-out infinite;
}

.indicator-dot {
    width: 100%;
    height: 100%;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.indicator-dot.severity-critical {
    background: var(--danger);
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
}

.indicator-dot.severity-warning {
    background: var(--warning);
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.6);
}

.indicator-dot.severity-info {
    background: var(--info);
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
}

.dot-pulse {
    width: 8px;
    height: 8px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: var(--radius-full);
    animation: pulse 2s ease-in-out infinite;
}

/* Stats Section */
.stats-section {
    margin-bottom: var(--gap-2xl);
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--gap-xl);
}

.section-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
}

.live-indicator {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--gap-sm) var(--gap-md);
    background: var(--success-light);
    border: var(--border-thin) solid var(--success);
    border-radius: var(--radius-full);
    font-size: 12px;
    font-weight: 600;
    color: var(--success);
}

.live-dot {
    width: 8px;
    height: 8px;
    background: var(--success);
    border-radius: var(--radius-full);
    animation: pulse 2s ease-in-out infinite;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--gap-lg);
}

/* Alert Dashboard Section */
.alert-dashboard-section {
    margin-bottom: var(--gap-2xl);
}

.dashboard-controls {
    display: flex;
    align-items: center;
    gap: var(--gap-lg);
}

.severity-filters {
    display: flex;
    gap: var(--gap-sm);
}

.severity-btn {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    padding: 8px 12px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition-base);
}

.severity-btn:hover {
    border-color: var(--accent);
}

.severity-btn.active {
    background: var(--primary);
    color: var(--text-inverse);
    border-color: var(--primary);
}

.severity-dot {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
}

.severity-dot.severity-critical {
    background: var(--danger);
}

.severity-dot.severity-warning {
    background: var(--warning);
}

.severity-dot.severity-info {
    background: var(--info);
}

.severity-count {
    font-size: 11px;
    font-weight: 600;
    min-width: 16px;
    text-align: center;
}

.view-controls {
    display: flex;
    gap: var(--gap-sm);
}

.period-select {
    padding: 8px 12px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: 12px;
    outline: none;
    cursor: pointer;
}

/* Alert Columns */
.alert-columns {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--gap-lg);
}

.alert-column {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
}

.alert-column.critical {
    border-top: 4px solid var(--danger);
}

.alert-column.warning {
    border-top: 4px solid var(--warning);
}

.alert-column.info {
    border-top: 4px solid var(--info);
}

.column-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--gap-lg);
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--glass-border);
}

.column-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
}

.column-count {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
}

.alert-list {
    max-height: 600px;
    overflow-y: auto;
}

.alert-item {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
    padding: var(--gap-lg);
    border-bottom: 1px solid var(--glass-border);
    cursor: pointer;
    transition: var(--transition-base);
}

.alert-item:hover {
    background: var(--bg-secondary);
}

.alert-item:last-child {
    border-bottom: none;
}

.alert-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.alert-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.alert-time {
    font-size: 11px;
    color: var(--text-tertiary);
}

.alert-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
}

.alert-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    line-height: 1.3;
}

.alert-message {
    font-size: 13px;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.4;
}

.alert-meta {
    display: flex;
    gap: var(--gap-md);
    font-size: 11px;
    color: var(--text-tertiary);
}

.alert-actions {
    display: flex;
    gap: var(--gap-xs);
    margin-top: var(--gap-sm);
}

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: transparent;
    border: none;
    color: var(--text-tertiary);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition-base);
}

.action-btn:hover {
    background: var(--glass-bg);
    color: var(--text-primary);
}

.action-btn.acknowledge:hover {
    color: var(--success);
}

.action-btn.resolve:hover {
    color: var(--danger);
}

/* Trends Section */
.trends-section {
    padding: var(--gap-xl);
    margin-bottom: var(--gap-2xl);
}

.trend-controls {
    display: flex;
    gap: var(--gap-sm);
}

.trend-select {
    padding: 8px 12px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: 12px;
    outline: none;
    cursor: pointer;
}

.trends-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--gap-xl);
}

.trend-chart {
    width: 100%;
    height: 300px;
    position: relative;
}

.trend-svg {
    width: 100%;
    height: 100%;
}

.trend-summary {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
}

.summary-card {
    padding: var(--gap-lg);
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
}

.summary-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
    margin: 0 0 var(--gap-xs) 0;
}

.summary-value {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 var(--gap-xs) 0;
}

.summary-description {
    font-size: 12px;
    color: var(--text-tertiary);
    margin: 0;
    line-height: 1.4;
}

/* Configuration Section */
.config-section {
    padding: var(--gap-xl);
}

.config-actions {
    display: flex;
    gap: var(--gap-sm);
}

.config-btn {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    padding: 8px 16px;
    background: var(--gradient-primary);
    color: var(--text-inverse);
    border: none;
    border-radius: var(--radius-md);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition-base);
}

.config-btn:hover {
    box-shadow: var(--glow-primary);
}

.config-content {
    margin-top: var(--gap-lg);
}

/* Table Custom Styles */
.trigger-cell {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
}

.trigger-condition {
    font-weight: 500;
    color: var(--text-primary);
}

.trigger-threshold {
    font-size: 12px;
    color: var(--text-secondary);
}

.rule-actions {
    display: flex;
    gap: var(--gap-xs);
    align-items: center;
}

.toggle-switch {
    width: 40px;
    height: 20px;
    background: var(--bg-tertiary);
    border-radius: var(--radius-full);
    position: relative;
    cursor: pointer;
    transition: var(--transition-base);
}

.toggle-switch.active {
    background: var(--success);
}

.toggle-slider {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: var(--text-inverse);
    border-radius: var(--radius-full);
    transition: var(--transition-base);
}

.toggle-switch.active .toggle-slider {
    transform: translateX(20px);
}

/* Responsive Design */
@media (max-width: 1200px) {
    .alert-columns {
        grid-template-columns: 1fr;
    }
    
    .trends-content {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .enhanced-alerts-view {
        padding: var(--gap-lg);
    }
    
    .hero-section {
        grid-template-columns: 1fr;
        text-align: center;
    }
    
    .hero-visual {
        order: -1;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
    
    .dashboard-controls {
        flex-direction: column;
        align-items: stretch;
        gap: var(--gap-md);
    }
    
    .severity-filters {
        flex-wrap: wrap;
    }
    
    .trend-summary {
        flex-direction: column;
        gap: var(--gap-md);
    }
    
    .rule-actions {
        flex-direction: column;
        gap: var(--gap-xs);
    }
}
</style>
