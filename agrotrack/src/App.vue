<script setup>
    import GlobalOverlay from '@/components/common/GlobalOverlay.vue'
</script>

<template>
    <div class="min-h-screen font-sans selection:bg-emerald-500/30 selection:text-emerald-900
                bg-slate-50 dark:bg-slate-950 
                text-slate-900 dark:text-slate-100
                transition-colors duration-500 ease-in-out">
    
        <main class="relative z-10 w-full min-h-screen overflow-x-hidden">
            <RouterView v-slot="{ Component }">
                <transition 
                    enter-active-class="animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out"
                    leave-active-class="animate-out fade-out duration-300 ease-in"
                    mode="out-in"
                >
                    <component :is="Component" />
                </transition>
            </RouterView>
        </main>

        <GlobalOverlay class="z-50" />
        
        <div class="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[120px] pointer-events-none"></div>
        <div class="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-500/5 dark:bg-blue-600/5 blur-[100px] pointer-events-none"></div>
    </div>
</template>

<style>
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