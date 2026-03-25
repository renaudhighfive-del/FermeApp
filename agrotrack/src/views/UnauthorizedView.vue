<script setup>
    import { useRouter } from 'vue-router'
    const router = useRouter()
</script>

<template>
    <div class="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
        
        <div class="relative w-full max-w-md p-8 text-center rounded-3xl border border-slate-200/60 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl shadow-slate-200/50 dark:shadow-none animate-in fade-in zoom-in-95 duration-500">
            
            <div class="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 group">
                <div class="absolute inset-0 rounded-full bg-red-400/20 animate-ping opacity-25"></div>
                <svg 
                    class="w-12 h-12 text-red-500 dark:text-red-400 transition-transform duration-500 group-hover:scale-110" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="1.5" 
                    viewBox="0 0 24 24"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
            </div>

            <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
                Accès restreint
            </h1>
            
            <p class="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-10 px-4">
                Votre profil actuel ne dispose pas des autorisations nécessaires pour consulter ces données agricoles sensibles.
            </p>

            <button 
                @click="router.back()"
                class="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-300 bg-emerald-600 rounded-2xl hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95 overflow-hidden"
            >
                <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                <svg class="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour au tableau de bord
            </button>
        </div>

        <div class="fixed top-1/4 left-1/4 w-64 h-64 bg-red-500/5 blur-[100px] pointer-events-none"></div>
    </div>
</template>

<style scoped>
@keyframes shimmer {
    100% {
        transform: translateX(100%);
    }
}
</style>