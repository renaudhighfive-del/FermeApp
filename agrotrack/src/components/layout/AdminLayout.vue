<template>
  <div class="app-layout">
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
        class="sidebar"
        :class="{ 'open': ui.isSidebarOpen }"
      />

      <!-- Contenu principal -->
      <main class="main-content">
        <router-view />
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