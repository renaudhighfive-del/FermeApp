<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppNavbar />
    <div class="flex flex-1 overflow-hidden">
      <SidebarGerant />
      <main class="flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppNavbar     from '@/components/layout/AppNavbar.vue'
import SidebarGerant from '@/components/layout/SidebarGerant.vue'
</script>