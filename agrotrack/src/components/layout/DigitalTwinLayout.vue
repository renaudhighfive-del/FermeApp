<template>
    <div class="digital-twin-layout">
        <!-- Futuristic Background -->
        <div class="background-system">
            <div class="data-grid"></div>
            <div class="floating-particles">
                <div v-for="i in 50" :key="i" class="particle" :style="getParticleStyle(i)"></div>
            </div>
            <div class="gradient-overlay"></div>
        </div>

        <!-- Enhanced Navbar -->
        <nav class="cyber-navbar">
            <div class="navbar-container">
                <div class="navbar-left">
                    <button class="menu-toggle magnetic" @click="toggleSidebar">
                        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 12h18M3 6h18M3 18h18"/>
                        </svg>
                    </button>
                    <div class="brand-container">
                        <div class="brand-logo">
                            <div class="logo-core"></div>
                            <div class="logo-ring"></div>
                        </div>
                        <div class="brand-text">
                            <h1 class="brand-title holographic-text">AgriTrack</h1>
                            <span class="brand-subtitle">Digital Twin OS</span>
                        </div>
                    </div>
                </div>
                
                <div class="navbar-center">
                    <div class="search-container glass-card">
                        <svg class="search-icon" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="9" r="7"/>
                            <path d="M21 21l-6-6"/>
                        </svg>
                        <input type="text" placeholder="Search agricultural data..." class="search-input">
                    </div>
                </div>
                
                <div class="navbar-right">
                    <button class="nav-button magnetic" @click="toggleTheme">
                        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="5"/>
                            <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
                        </svg>
                    </button>
                    
                    <div class="notification-center">
                        <button class="nav-button magnetic" @click="toggleNotifications">
                            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                            </svg>
                            <span class="notification-badge">{{ notifications.length }}</span>
                        </button>
                    </div>
                    
                    <div class="user-profile magnetic">
                        <div class="user-avatar">
                            <img :src="userAvatar" alt="User" class="avatar-image">
                            <div class="avatar-status online"></div>
                        </div>
                        <div class="user-info">
                            <span class="user-name">{{ currentUser.name }}</span>
                            <span class="user-role">{{ currentUser.role }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Enhanced Sidebar -->
        <aside class="cyber-sidebar" :class="{ 'sidebar-open': isSidebarOpen }">
            <div class="sidebar-content glass-card">
                <div class="sidebar-header">
                    <h2 class="sidebar-title">Control Panel</h2>
                    <button class="sidebar-close" @click="closeSidebar">
                        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                
                <nav class="sidebar-nav">
                    <div class="nav-section">
                        <h3 class="nav-section-title">Main Systems</h3>
                        <div class="nav-items">
                            <router-link 
                                v-for="item in mainNavItems" 
                                :key="item.path"
                                :to="item.path" 
                                class="nav-item interactive"
                                :class="{ 'nav-active': isActiveRoute(item.path) }"
                            >
                                <div class="nav-icon">
                                    <component :is="item.icon" />
                                </div>
                                <span class="nav-label">{{ item.label }}</span>
                                <div class="nav-indicator"></div>
                            </router-link>
                        </div>
                    </div>
                    
                    <div class="nav-section">
                        <h3 class="nav-section-title">Analytics</h3>
                        <div class="nav-items">
                            <router-link 
                                v-for="item in analyticsNavItems" 
                                :key="item.path"
                                :to="item.path" 
                                class="nav-item interactive"
                                :class="{ 'nav-active': isActiveRoute(item.path) }"
                            >
                                <div class="nav-icon">
                                    <component :is="item.icon" />
                                </div>
                                <span class="nav-label">{{ item.label }}</span>
                                <div class="nav-indicator"></div>
                            </router-link>
                        </div>
                    </div>
                </nav>
                
                <div class="sidebar-footer">
                    <div class="system-status glass-card">
                        <div class="status-header">
                            <span class="status-title">System Status</span>
                            <div class="status-indicator online"></div>
                        </div>
                        <div class="status-metrics">
                            <div class="metric">
                                <span class="metric-label">CPU</span>
                                <div class="metric-bar">
                                    <div class="metric-fill" style="width: 45%"></div>
                                </div>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Memory</span>
                                <div class="metric-bar">
                                    <div class="metric-fill" style="width: 67%"></div>
                                </div>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Network</span>
                                <div class="metric-bar">
                                    <div class="metric-fill" style="width: 89%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Main Content Area -->
        <main class="main-content">
            <div class="content-container">
                <!-- Page Header -->
                <header class="page-header">
                    <div class="header-content">
                        <div class="header-left">
                            <h1 class="page-title text-display">{{ pageTitle }}</h1>
                            <p class="page-subtitle">{{ pageSubtitle }}</p>
                        </div>
                        <div class="header-actions">
                            <slot name="header-actions"></slot>
                        </div>
                    </div>
                </header>

                <!-- Page Content -->
                <div class="page-content">
                    <slot></slot>
                </div>
            </div>
        </main>

        <!-- Notification System -->
        <div class="notification-container" v-if="showNotifications">
            <div class="notification-panel glass-card">
                <div class="notification-header">
                    <h3 class="notification-title">Notifications</h3>
                    <button class="notification-close" @click="showNotifications = false">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div class="notification-list">
                    <div 
                        v-for="notification in notifications" 
                        :key="notification.id"
                        class="notification-item interactive"
                        :class="`notification-${notification.type}`"
                    >
                        <div class="notification-icon">
                            <component :is="getNotificationIcon(notification.type)" />
                        </div>
                        <div class="notification-content">
                            <h4 class="notification-item-title">{{ notification.title }}</h4>
                            <p class="notification-item-message">{{ notification.message }}</p>
                            <span class="notification-time">{{ formatTime(notification.timestamp) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile Sidebar Overlay -->
        <div 
            class="sidebar-overlay" 
            :class="{ 'overlay-active': isSidebarOpen }"
            @click="closeSidebar"
        ></div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUiStore } from '@/stores/ui'

// Store & Route
const ui = useUiStore()
const route = useRoute()

// State
const isSidebarOpen = ref(false)
const showNotifications = ref(false)
const notifications = ref([
    {
        id: 1,
        type: 'success',
        title: 'Campaign Updated',
        message: 'Volailles Spring 2024 has been successfully updated.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
        id: 2,
        type: 'warning',
        title: 'Low Feed Stock',
        message: 'Feed inventory for Betail campaign is below 20%.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000)
    },
    {
        id: 3,
        type: 'info',
        title: 'System Update',
        message: 'Digital Twin OS v2.1.0 is now available.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
    }
])

// Mock User Data
const currentUser = ref({
    name: 'Admin User',
    role: 'System Administrator',
    avatar: null
})

// Navigation Items
const mainNavItems = ref([
    {
        path: '/admin/dashboard',
        label: 'Dashboard',
        icon: 'DashboardIcon'
    },
    {
        path: '/admin/campaigns',
        label: 'Campaigns',
        icon: 'CampaignIcon'
    },
    {
        path: '/admin/animals',
        label: 'Animals',
        icon: 'AnimalIcon'
    },
    {
        path: '/admin/users',
        label: 'Users',
        icon: 'UserIcon'
    },
    {
        path: '/admin/farms',
        label: 'Farms',
        icon: 'FarmIcon'
    }
])

const analyticsNavItems = ref([
    {
        path: '/admin/reports',
        label: 'Reports',
        icon: 'ReportIcon'
    },
    {
        path: '/admin/finance',
        label: 'Finance',
        icon: 'FinanceIcon'
    },
    {
        path: '/admin/alerts',
        label: 'Alerts',
        icon: 'AlertIcon'
    }
])

// Computed
const pageTitle = computed(() => {
    const routeTitle = route.meta?.title || route.name || 'Unknown'
    return routeTitle.charAt(0).toUpperCase() + routeTitle.slice(1)
})

const pageSubtitle = computed(() => {
    return route.meta?.subtitle || 'Manage your agricultural operations'
})

const userAvatar = computed(() => {
    return currentUser.value.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.value.name)}&background=0A4D3C&color=FFFFFF&bold=true`
})

// Methods
const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
    isSidebarOpen.value = false
}

const toggleTheme = () => {
    ui.toggleTheme()
}

const toggleNotifications = () => {
    showNotifications.value = !showNotifications.value
}

const isActiveRoute = (path) => {
    return route.path === path || route.path.startsWith(path + '/')
}

const getNotificationIcon = (type) => {
    const icons = {
        success: 'SuccessIcon',
        warning: 'WarningIcon',
        error: 'ErrorIcon',
        info: 'InfoIcon'
    }
    return icons[type] || 'InfoIcon'
}

const formatTime = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    
    const days = Math.floor(hours / 24)
    return `${days}d ago`
}

const getParticleStyle = (index) => {
    const size = Math.random() * 4 + 1
    const duration = Math.random() * 20 + 10
    const delay = Math.random() * 5
    const x = Math.random() * 100
    const y = Math.random() * 100
    
    return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}%`,
        top: `${y}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`
    }
}

// Lifecycle
onMounted(() => {
    // Initialize theme
    ui.applyTheme()
    
    // Add keyboard shortcuts
    const handleKeydown = (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'k':
                    e.preventDefault()
                    // Focus search
                    break
                case 'b':
                    e.preventDefault()
                    toggleSidebar()
                    break
            }
        }
    }
    
    document.addEventListener('keydown', handleKeydown)
    
    onUnmounted(() => {
        document.removeEventListener('keydown', handleKeydown)
    })
})
</script>

<style scoped>
/* =============================================
   DIGITAL TWIN LAYOUT SYSTEM
   ============================================= */
.digital-twin-layout {
    position: relative;
    min-height: 100vh;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-family: var(--font-body);
    overflow-x: hidden;
}

/* Background System */
.background-system {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    overflow: hidden;
}

.data-grid {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.1;
}

.floating-particles {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.particle {
    position: absolute;
    background: var(--accent);
    border-radius: var(--radius-full);
    opacity: 0.6;
    animation: float linear infinite;
}

@keyframes float {
    0% {
        transform: translateY(100vh) rotate(0deg);
    }
    100% {
        transform: translateY(-100px) rotate(360deg);
    }
}

.gradient-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 50%, rgba(0, 212, 170, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(10, 77, 60, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 20%, rgba(255, 107, 53, 0.05) 0%, transparent 50%);
    pointer-events: none;
}

/* =============================================
   CYBER NAVBAR
   ============================================= */
.cyber-navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--navbar-h);
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border-bottom: var(--border-thin) solid var(--glass-border);
    z-index: var(--z-fixed);
    transition: var(--transition-base);
}

.navbar-container {
    height: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 var(--gap-lg);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-lg);
}

.navbar-left {
    display: flex;
    align-items: center;
    gap: var(--gap-md);
}

.menu-toggle {
    background: transparent;
    border: none;
    color: var(--text-primary);
    padding: var(--gap-sm);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition-base);
}

.menu-toggle:hover {
    background: var(--glass-bg);
    box-shadow: var(--glow-accent);
}

.brand-container {
    display: flex;
    align-items: center;
    gap: var(--gap-md);
}

.brand-logo {
    position: relative;
    width: 48px;
    height: 48px;
}

.logo-core {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background: var(--gradient-primary);
    border-radius: var(--radius-full);
    animation: glowPulse 2s ease-in-out infinite;
}

.logo-ring {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: var(--border-medium) solid var(--accent);
    border-radius: var(--radius-full);
    animation: rotate 10s linear infinite;
}

@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.brand-text {
    display: flex;
    flex-direction: column;
}

.brand-title {
    font-size: 24px;
    font-weight: 800;
    margin: 0;
    line-height: 1;
}

.brand-subtitle {
    font-size: 11px;
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
}

.navbar-center {
    flex: 1;
    max-width: 400px;
    margin: 0 var(--gap-lg);
}

.search-container {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--gap-sm) var(--gap-md);
    border-radius: var(--radius-full);
}

.search-icon {
    color: var(--text-tertiary);
    flex-shrink: 0;
}

.search-input {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 14px;
    outline: none;
}

.search-input::placeholder {
    color: var(--text-tertiary);
}

.navbar-right {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
}

.nav-button {
    background: transparent;
    border: none;
    color: var(--text-primary);
    padding: var(--gap-sm);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: var(--transition-base);
}

.nav-button:hover {
    background: var(--glass-bg);
    box-shadow: var(--glow-accent);
}

.notification-badge {
    position: absolute;
    top: 6px;
    right: 6px;
    background: var(--danger);
    color: var(--text-inverse);
    font-size: 10px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: var(--radius-full);
    min-width: 18px;
    text-align: center;
}

.user-profile {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--gap-sm);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition-base);
}

.user-profile:hover {
    background: var(--glass-bg);
}

.user-avatar {
    position: relative;
    width: 40px;
    height: 40px;
}

.avatar-image {
    width: 100%;
    height: 100%;
    border-radius: var(--radius-full);
    object-fit: cover;
}

.avatar-status {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 12px;
    height: 12px;
    border-radius: var(--radius-full);
    border: var(--border-thin) solid var(--bg-card);
}

.avatar-status.online {
    background: var(--success);
    animation: pulse 2s ease-in-out infinite;
}

.user-info {
    display: flex;
    flex-direction: column;
}

.user-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.2;
}

.user-role {
    font-size: 12px;
    color: var(--text-tertiary);
    line-height: 1.2;
}

/* =============================================
   CYBER SIDEBAR
   ============================================= */
.cyber-sidebar {
    position: fixed;
    top: var(--navbar-h);
    left: 0;
    bottom: 0;
    width: var(--sidebar-w);
    transform: translateX(-100%);
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border-right: var(--border-thin) solid var(--glass-border);
    z-index: var(--z-sticky);
    transition: var(--transition-base);
}

.cyber-sidebar.sidebar-open {
    transform: translateX(0);
}

.sidebar-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    margin: var(--gap-lg);
    border-radius: var(--radius-lg);
    padding: var(--gap-lg);
}

.sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--gap-xl);
}

.sidebar-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
}

.sidebar-close {
    background: transparent;
    border: none;
    color: var(--text-tertiary);
    padding: var(--gap-sm);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition-base);
}

.sidebar-close:hover {
    color: var(--text-primary);
    background: var(--glass-bg);
}

.sidebar-nav {
    flex: 1;
    overflow-y: auto;
}

.nav-section {
    margin-bottom: var(--gap-xl);
}

.nav-section-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0 0 var(--gap-md) 0;
}

.nav-items {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
}

.nav-item {
    display: flex;
    align-items: center;
    gap: var(--gap-md);
    padding: var(--gap-md);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    text-decoration: none;
    position: relative;
    overflow: hidden;
    transition: var(--transition-base);
}

.nav-item:hover {
    color: var(--text-primary);
    background: var(--glass-bg);
    transform: translateX(4px);
}

.nav-item.nav-active {
    color: var(--accent);
    background: var(--gradient-primary);
    box-shadow: var(--glow-primary);
}

.nav-item.nav-active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: var(--accent);
}

.nav-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
}

.nav-label {
    font-size: 14px;
    font-weight: 500;
}

.nav-indicator {
    margin-left: auto;
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
    background: var(--accent);
    opacity: 0;
    transition: var(--transition-base);
}

.nav-item.nav-active .nav-indicator {
    opacity: 1;
}

/* =============================================
   SIDEBAR FOOTER
   ============================================= */
.sidebar-footer {
    margin-top: auto;
    padding-top: var(--gap-lg);
}

.system-status {
    padding: var(--gap-md);
}

.status-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--gap-md);
}

.status-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.status-indicator {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
}

.status-metrics {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
}

.metric {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
}

.metric-label {
    font-size: 11px;
    color: var(--text-tertiary);
    min-width: 60px;
}

.metric-bar {
    flex: 1;
    height: 4px;
    background: var(--bg-tertiary);
    border-radius: var(--radius-full);
    overflow: hidden;
}

.metric-fill {
    height: 100%;
    background: var(--gradient-accent);
    border-radius: var(--radius-full);
    transition: var(--transition-slow);
}

/* =============================================
   MAIN CONTENT
   ============================================= */
.main-content {
    margin-left: 0;
    margin-top: var(--navbar-h);
    min-height: calc(100vh - var(--navbar-h));
    transition: var(--transition-base);
}

.content-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: var(--gap-xl);
}

.page-header {
    margin-bottom: var(--gap-2xl);
}

.header-content {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--gap-lg);
}

.header-left {
    flex: 1;
}

.page-title {
    font-size: clamp(28px, 4vw, 48px);
    margin: 0 0 var(--gap-sm) 0;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.page-subtitle {
    font-size: 16px;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.5;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-md);
    flex-shrink: 0;
}

.page-content {
    animation: fadeInUp 0.6s ease-out;
}

/* =============================================
   NOTIFICATION SYSTEM
   ============================================= */
.notification-container {
    position: fixed;
    top: calc(var(--navbar-h) + var(--gap-lg));
    right: var(--gap-xl);
    width: 380px;
    max-height: 480px;
    z-index: var(--z-toast);
}

.notification-panel {
    border-radius: var(--radius-lg);
    padding: var(--gap-lg);
    max-height: 480px;
    display: flex;
    flex-direction: column;
}

.notification-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--gap-lg);
}

.notification-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
}

.notification-close {
    background: transparent;
    border: none;
    color: var(--text-tertiary);
    padding: var(--gap-sm);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition-base);
}

.notification-close:hover {
    color: var(--text-primary);
}

.notification-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
}

.notification-item {
    display: flex;
    align-items: flex-start;
    gap: var(--gap-md);
    padding: var(--gap-md);
    border-radius: var(--radius-md);
    border-left: var(--border-medium) solid transparent;
    transition: var(--transition-base);
}

.notification-item:hover {
    transform: translateX(-2px);
}

.notification-item.notification-success {
    border-left-color: var(--success);
    background: var(--success-light);
}

.notification-item.notification-warning {
    border-left-color: var(--warning);
    background: var(--warning-light);
}

.notification-item.notification-error {
    border-left-color: var(--danger);
    background: var(--danger-light);
}

.notification-item.notification-info {
    border-left-color: var(--info);
    background: var(--info-light);
}

.notification-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    margin-top: 2px;
}

.notification-content {
    flex: 1;
}

.notification-item-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 var(--gap-xs) 0;
    line-height: 1.3;
}

.notification-item-message {
    font-size: 13px;
    color: var(--text-secondary);
    margin: 0 0 var(--gap-xs) 0;
    line-height: 1.4;
}

.notification-time {
    font-size: 11px;
    color: var(--text-tertiary);
}

/* =============================================
   MOBILE RESPONSIVE
   ============================================= */
.sidebar-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: var(--z-modal-backdrop);
}

.sidebar-overlay.overlay-active {
    display: block;
}

/* Tablet */
@media (min-width: 768px) {
    .cyber-sidebar {
        transform: translateX(0);
    }
    
    .main-content {
        margin-left: var(--sidebar-w);
    }
    
    .sidebar-overlay {
        display: none !important;
    }
}

/* Mobile */
@media (max-width: 767px) {
    .navbar-container {
        padding: 0 var(--gap-md);
    }
    
    .navbar-center {
        display: none;
    }
    
    .brand-subtitle {
        display: none;
    }
    
    .user-info {
        display: none;
    }
    
    .content-container {
        padding: var(--gap-lg);
    }
    
    .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--gap-md);
    }
    
    .header-actions {
        width: 100%;
        justify-content: flex-start;
    }
    
    .notification-container {
        position: fixed;
        top: var(--navbar-h);
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        max-width: none;
        max-height: none;
        border-radius: 0;
    }
    
    .notification-panel {
        border-radius: 0;
        height: 100%;
        max-height: none;
    }
}

/* Large Desktop */
@media (min-width: 1400px) {
    .navbar-container {
        padding: 0 var(--gap-2xl);
    }
    
    .content-container {
        padding: var(--gap-2xl);
    }
}
</style>
