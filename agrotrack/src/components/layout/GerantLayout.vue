<template>
  <div class="app-layout">
    <AppNavbar />
    <div class="app-body">
      <!-- Overlay for mobile sidebar -->
      <div 
        class="sidebar-overlay"
        :class="{ 'active': ui.isSidebarOpen }"
        @click="ui.closeSidebar"
      ></div>

      <SidebarGerant 
        class="sidebar"
        :class="{ 'open': ui.isSidebarOpen }"
      />

      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppNavbar     from '@/components/layout/AppNavbar.vue'
import SidebarGerant from '@/components/layout/SidebarGerant.vue'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
</script>