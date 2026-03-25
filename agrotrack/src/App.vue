<script setup>
    import { onMounted } from 'vue'
    import { useUiStore } from '@/stores/ui'
    import GlobalOverlay from '@/components/common/GlobalOverlay.vue'

    const ui = useUiStore()

    onMounted(() => {
        ui.applyTheme()
    })
</script>

<template>
  <div class="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
    <RouterView v-slot="{ Component }">
      <transition 
        enter-active-class="animate-fadeIn"
        mode="out-in"
      >
        <component :is="Component" />
      </transition>
    </RouterView>

    <GlobalOverlay />
    <Toast />
</div>
</template>
    <style scoped>
    @reference "tailwindcss";
    html {
    scroll-behavior: smooth;
    -webkit-tap-highlight-color: transparent;
    }

    body {
        margin: 0;
        padding: 0;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }

    ::-webkit-scrollbar {
        width: 6px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        @apply bg-slate-300 dark:bg-slate-800 rounded-full hover:bg-emerald-500/50 transition-colors;
    }
</style>