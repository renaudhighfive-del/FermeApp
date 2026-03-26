<template>
  <div class="digital-twin-app-layout">
    <!-- Immersive Agriculture Background -->
    <div class="immersive-background">
      <div class="data-grid-overlay"></div>
      <div class="gradient-overlay"></div>
    </div>
    
    <!-- Navbar en haut -->
    <AppNavbar />

    <div class="app-body">
      <!-- Overlay for mobile sidebar -->
      <div 
        class="sidebar-overlay"
        :class="{ 'active': ui.isSidebarOpen }"
        @click="ui.closeSidebar"
      ></div>

      <!-- Sidebar gauche -->
      <SidebarAdmin 
        class="cyber-sidebar"
        :class="{ 'open': ui.isSidebarOpen }"
      />

      <!-- Contenu principal -->
      <main class="main-content-area">
        <div class="content-wrapper">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import AppNavbar    from '@/components/layout/AppNavbar.vue'
import SidebarAdmin from '@/components/layout/SidebarAdmin.vue'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
</script>

<style scoped>
/* Digital Twin App Layout */
.digital-twin-app-layout {
    min-height: 100vh;
    position: relative;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
}

/* Immersive Agriculture Background */
.immersive-background {
    position: fixed;
    inset: 0;
    z-index: 0;
    background-image: url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
}

.data-grid-overlay {
    position: absolute;
    inset: 0;
    background-image: 
        linear-gradient(rgba(0, 212, 170, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 212, 170, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: dataStream 20s linear infinite;
}

.gradient-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        180deg,
        rgba(var(--bg-rgb, 255, 255, 255), 0.97) 0%,
        rgba(var(--bg-rgb, 255, 255, 255), 0.95) 50%,
        rgba(var(--bg-rgb, 255, 255, 255), 0.98) 100%
    );
}

.dark .gradient-overlay {
    background: linear-gradient(
        180deg,
        rgba(10, 15, 20, 0.97) 0%,
        rgba(10, 15, 20, 0.95) 50%,
        rgba(10, 15, 20, 0.98) 100%
    );
}

/* App Body */
.app-body {
    display: flex;
    flex: 1;
    position: relative;
    z-index: 1;
    min-height: calc(100vh - var(--navbar-h));
}

/* Sidebar Overlay */
.sidebar-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 900;
    transition: opacity var(--transition-base);
}

.sidebar-overlay.active {
    display: block;
}

/* Cyber Sidebar */
.cyber-sidebar {
    position: fixed;
    left: 0;
    top: var(--navbar-h);
    height: calc(100vh - var(--navbar-h));
    width: var(--sidebar-w);
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border-right: var(--border-thin) solid var(--glass-border);
    z-index: var(--z-fixed);
    transition: transform var(--transition-base);
    overflow-y: auto;
}

@media (max-width: 1024px) {
    .cyber-sidebar {
        transform: translateX(-100%);
    }
    
    .cyber-sidebar.open {
        transform: translateX(0);
    }
}

/* Main Content Area */
.main-content-area {
    flex: 1;
    margin-left: var(--sidebar-w);
    min-height: calc(100vh - var(--navbar-h));
    position: relative;
    z-index: 1;
    transition: margin-left var(--transition-base);
}

.content-wrapper {
    padding: var(--gap-xl);
    max-width: 1600px;
    margin: 0 auto;
}

@media (max-width: 1024px) {
    .main-content-area {
        margin-left: 0;
    }
    
    .content-wrapper {
        padding: var(--gap-lg);
    }
}

@media (max-width: 640px) {
    .content-wrapper {
        padding: var(--gap-md);
    }
}

/* Animations */
@keyframes dataStream {
    0% { background-position: 0 0; }
    100% { background-position: 50px 50px; }
}
</style>