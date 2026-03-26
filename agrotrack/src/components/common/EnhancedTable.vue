<template>
    <div class="enhanced-table-container glass-card">
        <!-- Table Header -->
        <div class="table-header">
            <div class="table-title-section">
                <h3 class="table-title">{{ title }}</h3>
                <p v-if="subtitle" class="table-subtitle">{{ subtitle }}</p>
            </div>
            
            <div class="table-controls">
                <div class="search-container">
                    <svg class="search-icon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="7" cy="7" r="6"/>
                        <path d="M13 13l4 4"/>
                    </svg>
                    <input 
                        v-model="searchQuery" 
                        type="text" 
                        :placeholder="searchPlaceholder"
                        class="search-input"
                    />
                </div>
                
                <div class="filter-controls">
                    <select v-model="selectedFilter" class="filter-select">
                        <option value="">All Categories</option>
                        <option v-for="filter in filters" :key="filter.value" :value="filter.value">
                            {{ filter.label }}
                        </option>
                    </select>
                    
                    <button class="table-action-btn magnetic" @click="refreshData">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 4v6h6M23 20v-6h-6"/>
                            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                        </svg>
                        Refresh
                    </button>
                    
                    <button class="table-action-btn magnetic" @click="exportData">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                        </svg>
                        Export
                    </button>
                </div>
            </div>
        </div>

        <!-- Table Content -->
        <div class="table-content">
            <div class="table-wrapper">
                <table class="enhanced-table">
                    <thead>
                        <tr>
                            <th 
                                v-for="column in columns" 
                                :key="column.key"
                                :class="getHeaderClasses(column)"
                                @click="handleSort(column)"
                            >
                                <div class="header-content">
                                    <span class="header-text">{{ column.label }}</span>
                                    <div v-if="column.sortable" class="sort-indicator">
                                        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M5 10l2-2M5 6l2 2M9 6l2 2M9 10l2-2"/>
                                        </svg>
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        <tr 
                            v-for="(row, index) in paginatedData" 
                            :key="row.id"
                            :class="getRowClasses(row, index)"
                            @click="handleRowClick(row)"
                        >
                            <td 
                                v-for="column in columns" 
                                :key="column.key"
                                :class="getCellClasses(column, row)"
                            >
                                <slot 
                                    :name="`cell-${column.key}`" 
                                    :row="row" 
                                    :column="column"
                                    :value="getCellValue(row, column)"
                                >
                                    <component 
                                        v-if="column.component" 
                                        :is="column.component"
                                        :value="getCellValue(row, column)"
                                        :row="row"
                                        :column="column"
                                    />
                                    <span v-else class="cell-content">
                                        {{ formatCellValue(getCellValue(row, column), column) }}
                                    </span>
                                </slot>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Empty State -->
            <div v-if="filteredData.length === 0" class="empty-state">
                <div class="empty-icon">
                    <svg width="64" height="64" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3">
                        <rect x="16" y="8" width="32" height="48" rx="2"/>
                        <line x1="24" y1="16" x2="40" y2="16"/>
                        <line x1="24" y1="24" x2="40" y2="24"/>
                        <line x1="24" y1="32" x2="32" y2="32"/>
                    </svg>
                </div>
                <h4 class="empty-title">{{ emptyState.title }}</h4>
                <p class="empty-message">{{ emptyState.message }}</p>
                <button v-if="emptyState.action" class="empty-action-btn cyber-button" @click="emptyState.action">
                    {{ emptyState.actionText }}
                </button>
            </div>
        </div>

        <!-- Table Footer -->
        <div class="table-footer">
            <div class="table-info">
                <span class="info-text">
                    Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredData.length }} entries
                </span>
            </div>
            
            <div class="pagination-controls">
                <button 
                    class="pagination-btn" 
                    :disabled="currentPage === 1"
                    @click="goToPage(currentPage - 1)"
                >
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </button>
                
                <div class="page-numbers">
                    <button 
                        v-for="page in visiblePages" 
                        :key="page"
                        class="page-btn"
                        :class="{ active: page === currentPage }"
                        @click="goToPage(page)"
                    >
                        {{ page }}
                    </button>
                </div>
                
                <button 
                    class="pagination-btn"
                    :disabled="currentPage === totalPages"
                    @click="goToPage(currentPage + 1)"
                >
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, useAttrs } from 'vue'

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        default: ''
    },
    data: {
        type: Array,
        required: true
    },
    columns: {
        type: Array,
        required: true
    },
    filters: {
        type: Array,
        default: () => []
    },
    searchPlaceholder: {
        type: String,
        default: 'Search...'
    },
    pageSize: {
        type: Number,
        default: 10
    },
    emptyState: {
        type: Object,
        default: () => ({
            title: 'No data found',
            message: 'Try adjusting your search or filters',
            action: null,
            actionText: 'Add New'
        })
    }
})

const emit = defineEmits(['row-click', 'refresh', 'export'])
const attrs = useAttrs()

// State
const searchQuery = ref('')
const selectedFilter = ref('')
const currentPage = ref(1)
const sortColumn = ref(null)
const sortDirection = ref('asc')

// Computed
const filteredData = computed(() => {
    let filtered = props.data

    // Apply search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(row => {
            return props.columns.some(column => {
                const value = getCellValue(row, column)
                return String(value).toLowerCase().includes(query)
            })
        })
    }

    // Apply category filter
    if (selectedFilter.value) {
        filtered = filtered.filter(row => {
            return row.category === selectedFilter.value
        })
    }

    // Apply sorting
    if (sortColumn.value) {
        filtered = [...filtered].sort((a, b) => {
            const aValue = getCellValue(a, sortColumn.value)
            const bValue = getCellValue(b, sortColumn.value)
            
            if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1
            if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1
            return 0
        })
    }

    return filtered
})

const totalPages = computed(() => {
    return Math.ceil(filteredData.value.length / props.pageSize)
})

const startIndex = computed(() => {
    return (currentPage.value - 1) * props.pageSize
})

const endIndex = computed(() => {
    return Math.min(startIndex.value + props.pageSize, filteredData.value.length)
})

const paginatedData = computed(() => {
    return filteredData.value.slice(startIndex.value, endIndex.value)
})

const visiblePages = computed(() => {
    const pages = []
    const maxVisible = 5
    const start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
    const end = Math.min(totalPages.value, start + maxVisible - 1)
    
    for (let i = start; i <= end; i++) {
        pages.push(i)
    }
    
    return pages
})

// Methods
const getCellValue = (row, column) => {
    if (typeof column.key === 'function') {
        return column.key(row)
    }
    return row[column.key]
}

const formatCellValue = (value, column) => {
    if (column.formatter) {
        return column.formatter(value)
    }
    return value
}

const getHeaderClasses = (column) => {
    return {
        'sortable': column.sortable,
        'sorted': sortColumn.value === column.key,
        'sorted-desc': sortColumn.value === column.key && sortDirection.value === 'desc'
    }
}

const getRowClasses = (row, index) => {
    return {
        'clickable': props.onRowClick || attrs.onRowClick,
        'striped': index % 2 === 1
    }
}

const getCellClasses = (column, row) => {
    return {
        [`cell-${column.key}`]: true,
        [`cell-type-${column.type}`]: column.type,
        [row.status]: row.status
    }
}

const handleSort = (column) => {
    if (!column.sortable) return
    
    if (sortColumn.value === column.key) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortColumn.value = column
        sortDirection.value = 'asc'
    }
}

const handleRowClick = (row) => {
    emit('row-click', row)
}

const refreshData = () => {
    emit('refresh')
}

const exportData = () => {
    emit('export', filteredData.value)
}

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

// Watch for search/filter changes to reset pagination
watch([searchQuery, selectedFilter], () => {
    currentPage.value = 1
})
</script>

<style scoped>
.enhanced-table-container {
    display: flex;
    flex-direction: column;
    border-radius: var(--radius-xl);
    overflow: hidden;
    padding: 0;
}

/* Table Header */
.table-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--gap-lg);
    padding: var(--gap-xl);
    border-bottom: 1px solid var(--glass-border);
    flex-wrap: wrap;
}

.table-title-section {
    flex: 1;
    min-width: 200px;
}

.table-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 var(--gap-xs) 0;
}

.table-subtitle {
    font-size: 14px;
    color: var(--text-secondary);
    margin: 0;
}

.table-controls {
    display: flex;
    align-items: center;
    gap: var(--gap-md);
    flex-wrap: wrap;
}

.search-container {
    position: relative;
    display: flex;
    align-items: center;
    min-width: 200px;
}

.search-icon {
    position: absolute;
    left: 12px;
    color: var(--text-tertiary);
    z-index: 1;
}

.search-input {
    width: 100%;
    padding: 10px 12px 10px 36px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: 14px;
    outline: none;
    transition: var(--transition-base);
}

.search-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
}

.filter-controls {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
}

.filter-select {
    padding: 10px 12px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: 14px;
    outline: none;
    cursor: pointer;
    transition: var(--transition-base);
}

.filter-select:focus {
    border-color: var(--accent);
}

.table-action-btn {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    padding: 10px 16px;
    background: transparent;
    border: 1px solid var(--glass-border);
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 500;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition-base);
}

.table-action-btn:hover {
    background: var(--glass-bg);
    color: var(--text-primary);
    border-color: var(--accent);
}

/* Table Content */
.table-content {
    flex: 1;
    overflow: hidden;
}

.table-wrapper {
    overflow-x: auto;
}

.enhanced-table {
    width: 100%;
    border-collapse: collapse;
}

.enhanced-table th {
    background: var(--bg-tertiary);
    padding: var(--gap-md) var(--gap-lg);
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid var(--glass-border);
    white-space: nowrap;
}

.enhanced-table th.sortable {
    cursor: pointer;
    transition: var(--transition-base);
}

.enhanced-table th.sortable:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-sm);
}

.sort-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    opacity: 0.5;
    transition: var(--transition-base);
}

.enhanced-table th.sorted .sort-indicator {
    opacity: 1;
    color: var(--accent);
}

.enhanced-table td {
    padding: var(--gap-md) var(--gap-lg);
    border-bottom: 1px solid var(--glass-border);
    color: var(--text-primary);
    font-size: 14px;
}

.enhanced-table tbody tr {
    transition: var(--transition-base);
}

.enhanced-table tbody tr.clickable {
    cursor: pointer;
}

.enhanced-table tbody tr:hover td {
    background: var(--bg-secondary);
}

.enhanced-table tbody tr.striped td {
    background: var(--bg-tertiary);
}

.cell-content {
    display: block;
    line-height: 1.4;
}

/* Cell Type Styles */
.cell-type-currency {
    font-family: var(--font-display);
    font-weight: 600;
    text-align: right;
}

.cell-type-status {
    text-align: center;
}

.cell-type-progress {
    width: 100%;
}

.cell-type-number {
    font-family: var(--font-display);
    font-weight: 600;
    text-align: right;
}

/* Empty State */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--gap-2xl);
    text-align: center;
}

.empty-icon {
    margin-bottom: var(--gap-lg);
    color: var(--text-tertiary);
}

.empty-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 var(--gap-sm) 0;
}

.empty-message {
    font-size: 14px;
    color: var(--text-secondary);
    margin: 0 0 var(--gap-lg) 0;
    max-width: 400px;
}

.empty-action-btn {
    padding: 12px 24px;
}

/* Table Footer */
.table-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--gap-lg) var(--gap-xl);
    border-top: 1px solid var(--glass-border);
    flex-wrap: wrap;
    gap: var(--gap-md);
}

.table-info {
    font-size: 12px;
    color: var(--text-secondary);
}

.pagination-controls {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
}

.pagination-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: transparent;
    border: 1px solid var(--glass-border);
    color: var(--text-secondary);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition-base);
}

.pagination-btn:hover:not(:disabled) {
    background: var(--glass-bg);
    color: var(--text-primary);
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-numbers {
    display: flex;
    gap: var(--gap-xs);
}

.page-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    padding: 0 var(--gap-sm);
    background: transparent;
    border: 1px solid var(--glass-border);
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 500;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition-base);
}

.page-btn:hover {
    background: var(--glass-bg);
    color: var(--text-primary);
}

.page-btn.active {
    background: var(--gradient-primary);
    color: var(--text-inverse);
    border-color: var(--primary);
}

/* Responsive Design */
@media (max-width: 768px) {
    .table-header {
        flex-direction: column;
        align-items: stretch;
        gap: var(--gap-md);
    }
    
    .table-controls {
        flex-direction: column;
        align-items: stretch;
    }
    
    .filter-controls {
        flex-wrap: wrap;
    }
    
    .search-container {
        min-width: auto;
    }
    
    .table-footer {
        flex-direction: column;
        align-items: stretch;
        gap: var(--gap-md);
    }
    
    .pagination-controls {
        justify-content: center;
    }
}

@media (max-width: 640px) {
    .enhanced-table th,
    .enhanced-table td {
        padding: var(--gap-sm);
        font-size: 12px;
    }
    
    .table-action-btn {
        padding: 8px 12px;
        font-size: 11px;
    }
}
</style>
