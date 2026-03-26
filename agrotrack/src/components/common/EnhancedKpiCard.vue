<template>
    <div class="kpi-card-enhanced glass-card interactive" :class="`kpi-${variant}`">
        <!-- Card Header -->
        <div class="kpi-header">
            <div class="kpi-icon-container" :class="`icon-${variant}`">
                <component :is="icon" class="kpi-icon" />
                <div class="icon-glow"></div>
            </div>
            <div class="kpi-actions">
                <button class="action-btn magnetic" @click="refreshData">
                    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 4v6h6M23 20v-6h-6"/>
                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                    </svg>
                </button>
                <button class="action-btn magnetic" @click="showDetails">
                    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="7" cy="7" r="1"/>
                        <circle cx="7" cy="12" r="1"/>
                        <circle cx="7" cy="2" r="1"/>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Card Body -->
        <div class="kpi-body">
            <div class="kpi-value-section">
                <div class="kpi-value">
                    <span class="value-number" :class="{ 'value-loading': loading }">
                        {{ displayValue }}
                    </span>
                    <span class="value-unit">{{ unit }}</span>
                </div>
                <div class="kpi-change" :class="changeClass">
                    <component :is="changeIcon" class="change-icon" />
                    <span class="change-text">{{ changeText }}</span>
                </div>
            </div>
            
            <div class="kpi-label">
                <h4 class="label-title">{{ title }}</h4>
                <p class="label-description">{{ description }}</p>
            </div>
        </div>

        <!-- Progress Section -->
        <div class="kpi-progress" v-if="showProgress">
            <div class="progress-header">
                <span class="progress-label">{{ progressLabel }}</span>
                <span class="progress-value">{{ progress }}%</span>
            </div>
            <div class="progress-track">
                <div class="progress-fill" :style="{ width: `${progress}%` }">
                    <div class="progress-glow"></div>
                </div>
            </div>
        </div>

        <!-- Mini Chart -->
        <div class="kpi-chart" v-if="showChart">
            <svg class="mini-chart" viewBox="0 0 100 40">
                <defs>
                    <linearGradient :id="`chart-gradient-${id}`" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" :style="`stop-color: ${chartColor};stop-opacity:0.8`" />
                        <stop offset="100%" :style="`stop-color: ${chartColor};stop-opacity:0.1`" />
                    </linearGradient>
                </defs>
                
                <!-- Chart path -->
                <path 
                    :d="chartPath" 
                    :fill="`url(#chart-gradient-${id})`"
                    stroke="none"
                />
                
                <!-- Chart line -->
                <path 
                    :d="chartLinePath" 
                    :stroke="chartColor"
                    stroke-width="2"
                    fill="none"
                />
                
                <!-- Data points -->
                <circle 
                    v-for="(point, index) in chartData" 
                    :key="index"
                    :cx="getPointX(point, index)" 
                    :cy="getPointY(point, index)" 
                    r="2"
                    :fill="chartColor"
                    class="chart-point"
                />
            </svg>
        </div>

        <!-- Footer Stats -->
        <div class="kpi-footer" v-if="footerStats">
            <div class="footer-stats-grid">
                <div v-for="stat in footerStats" :key="stat.label" class="footer-stat">
                    <span class="stat-label">{{ stat.label }}</span>
                    <span class="stat-value">{{ stat.value }}</span>
                </div>
            </div>
        </div>

        <!-- Loading Overlay -->
        <div v-if="loading" class="kpi-loading">
            <div class="loading-spinner"></div>
        </div>

        <!-- Hover Effects -->
        <div class="kpi-effects">
            <div class="hover-glow"></div>
            <div class="click-ripple" v-if="clicked"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    value: {
        type: [Number, String],
        required: true
    },
    unit: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        required: true
    },
    variant: {
        type: String,
        default: 'primary',
        validator: (value) => ['primary', 'secondary', 'success', 'warning', 'danger', 'info'].includes(value)
    },
    change: {
        type: Number,
        default: 0
    },
    changeLabel: {
        type: String,
        default: 'vs last period'
    },
    progress: {
        type: Number,
        default: null
    },
    progressLabel: {
        type: String,
        default: 'Progress'
    },
    chartData: {
        type: Array,
        default: () => []
    },
    footerStats: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    clickable: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['refresh', 'details', 'click'])

const id = ref(Math.random().toString(36).substr(2, 9))
const clicked = ref(false)

const chartData = ref([])
const footerStats = ref([])

// Computed
const displayValue = computed(() => {
    if (props.loading) return '---'
    return props.value
})

const changeClass = computed(() => {
    if (props.change > 0) return 'change-positive'
    if (props.change < 0) return 'change-negative'
    return 'change-neutral'
})

const changeIcon = computed(() => {
    if (props.change > 0) return 'TrendingUpIcon'
    if (props.change < 0) return 'TrendingDownIcon'
    return 'MinusIcon'
})

const changeText = computed(() => {
    const absChange = Math.abs(props.change)
    const sign = props.change > 0 ? '+' : props.change < 0 ? '-' : ''
    return `${sign}${absChange}% ${props.changeLabel}`
})

const showProgress = computed(() => props.progress !== null)
const showChart = computed(() => props.chartData.length > 0)

const chartColor = computed(() => {
    const colors = {
        primary: 'var(--primary)',
        secondary: 'var(--accent)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        info: 'var(--info)'
    }
    return colors[props.variant] || colors.primary
})

const chartPath = computed(() => {
    if (!props.chartData.length) return ''
    
    const points = props.chartData.map((point, index) => {
        const x = (index / (props.chartData.length - 1)) * 100
        const y = 40 - (point.value / Math.max(...props.chartData.map(p => p.value))) * 35
        return `${x},${y}`
    })
    
    return `M 0,40 L ${points.join(' L ')} L 100,40 Z`
})

const chartLinePath = computed(() => {
    if (!props.chartData.length) return ''
    
    const points = props.chartData.map((point, index) => {
        const x = (index / (props.chartData.length - 1)) * 100
        const y = 40 - (point.value / Math.max(...props.chartData.map(p => p.value))) * 35
        return `${x},${y}`
    })
    
    return `M ${points.join(' L ')}`
})

// Methods
const refreshData = () => {
    emit('refresh')
}

const showDetails = () => {
    emit('details')
}

const handleClick = () => {
    if (props.clickable) {
        clicked.value = true
        emit('click')
        
        setTimeout(() => {
            clicked.value = false
        }, 600)
    }
}

const getPointX = (point, index) => {
    return (index / (props.chartData.length - 1)) * 100
}

const getPointY = (point, index) => {
    return 40 - (point.value / Math.max(...props.chartData.map(p => p.value))) * 35
}

// Lifecycle
onMounted(() => {
    // Animate on mount
    setTimeout(() => {
        // Trigger animations
    }, 100)
})
</script>

<style scoped>
.kpi-card-enhanced {
    position: relative;
    padding: var(--gap-xl);
    border-radius: var(--radius-lg);
    transition: var(--transition-base);
    overflow: hidden;
    cursor: pointer;
}

.kpi-card-enhanced:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
}

.kpi-card-enhanced:active {
    transform: translateY(-2px);
}

/* Variant Styles */
.kpi-primary {
    --kpi-color: var(--primary);
    --kpi-bg: rgba(10, 77, 60, 0.1);
    --kpi-border: rgba(10, 77, 60, 0.2);
}

.kpi-secondary {
    --kpi-color: var(--accent);
    --kpi-bg: rgba(0, 212, 170, 0.1);
    --kpi-border: rgba(0, 212, 170, 0.2);
}

.kpi-success {
    --kpi-color: var(--success);
    --kpi-bg: rgba(16, 185, 129, 0.1);
    --kpi-border: rgba(16, 185, 129, 0.2);
}

.kpi-warning {
    --kpi-color: var(--warning);
    --kpi-bg: rgba(245, 158, 11, 0.1);
    --kpi-border: rgba(245, 158, 11, 0.2);
}

.kpi-danger {
    --kpi-color: var(--danger);
    --kpi-bg: rgba(239, 68, 68, 0.1);
    --kpi-border: rgba(239, 68, 68, 0.2);
}

.kpi-info {
    --kpi-color: var(--info);
    --kpi-bg: rgba(59, 130, 246, 0.1);
    --kpi-border: rgba(59, 130, 246, 0.2);
}

/* Header */
.kpi-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: var(--gap-lg);
}

.kpi-icon-container {
    position: relative;
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--kpi-bg);
    border: 1px solid var(--kpi-border);
    color: var(--kpi-color);
    transition: var(--transition-base);
}

.kpi-card-enhanced:hover .kpi-icon-container {
    transform: scale(1.05);
    box-shadow: 0 0 20px var(--kpi-color);
}

.kpi-icon {
    width: 24px;
    height: 24px;
    z-index: 2;
    position: relative;
}

.icon-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 32px;
    height: 32px;
    background: var(--kpi-color);
    border-radius: var(--radius-full);
    opacity: 0.3;
    filter: blur(8px);
    animation: pulse 2s ease-in-out infinite;
}

.kpi-actions {
    display: flex;
    gap: var(--gap-xs);
}

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: transparent;
    border: 1px solid var(--glass-border);
    color: var(--text-tertiary);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition-base);
    opacity: 0;
}

.kpi-card-enhanced:hover .action-btn {
    opacity: 1;
}

.action-btn:hover {
    background: var(--glass-bg);
    color: var(--kpi-color);
    border-color: var(--kpi-color);
}

/* Body */
.kpi-body {
    margin-bottom: var(--gap-lg);
}

.kpi-value-section {
    margin-bottom: var(--gap-md);
}

.kpi-value {
    display: flex;
    align-items: baseline;
    gap: var(--gap-xs);
    margin-bottom: var(--gap-sm);
}

.value-number {
    font-size: 32px;
    font-weight: 800;
    font-family: var(--font-display);
    color: var(--text-primary);
    line-height: 1;
    transition: var(--transition-base);
}

.value-loading {
    opacity: 0.5;
}

.value-unit {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-secondary);
}

.kpi-change {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    font-size: 12px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: var(--radius-sm);
    width: fit-content;
}

.change-positive {
    color: var(--success);
    background: var(--success-light);
}

.change-negative {
    color: var(--danger);
    background: var(--danger-light);
}

.change-neutral {
    color: var(--text-secondary);
    background: var(--bg-tertiary);
}

.change-icon {
    width: 14px;
    height: 14px;
}

.kpi-label {
    color: var(--text-secondary);
}

.label-title {
    font-size: 14px;
    font-weight: 600;
    margin: 0 0 var(--gap-xs) 0;
    color: var(--text-primary);
}

.label-description {
    font-size: 12px;
    margin: 0;
    line-height: 1.4;
}

/* Progress */
.kpi-progress {
    margin-bottom: var(--gap-lg);
}

.progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--gap-xs);
}

.progress-label {
    font-size: 11px;
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.progress-value {
    font-size: 12px;
    font-weight: 600;
    color: var(--kpi-color);
}

.progress-track {
    height: 6px;
    background: var(--bg-tertiary);
    border-radius: var(--radius-full);
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--kpi-color);
    border-radius: var(--radius-full);
    position: relative;
    transition: var(--transition-slow);
}

.progress-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: inherit;
    filter: blur(4px);
    opacity: 0.5;
}

/* Chart */
.kpi-chart {
    margin-bottom: var(--gap-lg);
    height: 40px;
}

.mini-chart {
    width: 100%;
    height: 100%;
}

.chart-point {
    transition: var(--transition-base);
}

.kpi-card-enhanced:hover .chart-point {
    r: 3;
}

/* Footer */
.kpi-footer {
    border-top: 1px solid var(--glass-border);
    padding-top: var(--gap-md);
}

.footer-stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--gap-md);
}

.footer-stat {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
}

.stat-label {
    font-size: 10px;
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.stat-value {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
}

/* Loading */
.kpi-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: inherit;
    z-index: 10;
}

.loading-spinner {
    width: 24px;
    height: 24px;
    border: 2px solid var(--glass-border);
    border-top: 2px solid var(--kpi-color);
    border-radius: var(--radius-full);
    animation: spin 1s linear infinite;
}

/* Effects */
.kpi-effects {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
}

.hover-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--kpi-color);
    opacity: 0;
    border-radius: inherit;
    transition: var(--transition-base);
}

.kpi-card-enhanced:hover .hover-glow {
    opacity: 0.05;
}

.click-ripple {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background: var(--kpi-color);
    border-radius: var(--radius-full);
    opacity: 0.3;
    animation: ripple 0.6s ease-out;
}

/* Animations */
@keyframes pulse {
    0%, 100% {
        opacity: 0.3;
        transform: translate(-50%, -50%) scale(1);
    }
    50% {
        opacity: 0.6;
        transform: translate(-50%, -50%) scale(1.2);
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@keyframes ripple {
    to {
        transform: translate(-50%, -50%) scale(4);
        opacity: 0;
    }
}

/* Responsive Design */
@media (max-width: 768px) {
    .kpi-card-enhanced {
        padding: var(--gap-lg);
    }
    
    .value-number {
        font-size: 24px;
    }
    
    .kpi-icon-container {
        width: 40px;
        height: 40px;
    }
    
    .kpi-icon {
        width: 20px;
        height: 20px;
    }
    
    .footer-stats-grid {
        grid-template-columns: 1fr;
    }
}
</style>
