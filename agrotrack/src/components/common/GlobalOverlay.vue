<template>
  <!-- Global Toast Notifications -->
  <div class="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none w-80">
    <TransitionGroup name="notification">
      <div 
        v-for="notif in ui.notifications" 
        :key="notif.id"
        class="pointer-events-auto flex items-center p-4 rounded-xl shadow-2xl border bg-white overflow-hidden relative group transition-all"
        :class="{
          'border-green-100 bg-green-50': notif.type === 'success',
          'border-red-100 bg-red-50': notif.type === 'error',
          'border-amber-100 bg-amber-50': notif.type === 'warning',
          'border-blue-100 bg-blue-50': notif.type === 'info',
        }"
      >
        <!-- Icon -->
        <div class="mr-3 flex-shrink-0">
          <div v-if="notif.type === 'success'" class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
          </div>
          <div v-if="notif.type === 'error'" class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <div v-if="notif.type === 'warning'" class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div v-if="notif.type === 'info'" class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-grow">
          <div class="text-sm font-semibold" :class="{
            'text-green-800': notif.type === 'success',
            'text-red-800': notif.type === 'error',
            'text-amber-800': notif.type === 'warning',
            'text-blue-800': notif.type === 'info',
          }">
            {{ notif.type === 'success' ? 'Succès' : notif.type === 'error' ? 'Erreur' : notif.type === 'warning' ? 'Attention' : 'Info' }}
          </div>
          <div class="text-xs text-slate-600 leading-relaxed">{{ notif.message }}</div>
        </div>

        <!-- Close Button -->
        <button @click="ui.removeNotification(notif.id)" class="ml-2 p-1 text-slate-400 hover:text-slate-600 transition-colors">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </TransitionGroup>
  </div>

  <!-- Global Confirmation Modal -->
  <div v-if="ui.confirmState.show" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-modal-pop">
      <div class="p-8">
        <!-- Icon Section -->
        <div class="flex justify-center mb-6">
          <div v-if="ui.confirmState.type === 'danger'" class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600">
            <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </div>
          <div v-else-if="ui.confirmState.type === 'warning'" class="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
            <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <div v-else class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
        </div>

        <!-- Text Section -->
        <h2 class="text-2xl font-bold text-slate-900 text-center mb-2">{{ ui.confirmState.title }}</h2>
        <p class="text-slate-600 text-center mb-8 leading-relaxed">{{ ui.confirmState.message }}</p>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button 
            @click="ui.confirmState.onCancel"
            class="flex-1 px-6 py-3.5 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all transform active:scale-95"
          >
            {{ ui.confirmState.cancelText }}
          </button>
          <button 
            @click="ui.confirmState.onConfirm"
            class="flex-1 px-6 py-3.5 rounded-2xl text-white font-bold transition-all transform active:scale-95 shadow-lg shadow-opacity-20"
            :class="{
              'bg-red-600 hover:bg-red-700 shadow-red-600': ui.confirmState.type === 'danger',
              'bg-amber-600 hover:bg-amber-700 shadow-amber-600': ui.confirmState.type === 'warning',
              'bg-blue-600 hover:bg-blue-700 shadow-blue-600': ui.confirmState.type === 'info',
            }"
          >
            {{ ui.confirmState.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
</script>

<style scoped>
/* Transitions pour les notifications */
.notification-enter-active, .notification-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.notification-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
.notification-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* Animation pour la modal */
@keyframes modal-pop {
  0% { transform: scale(0.9) translateY(10px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}
.animate-modal-pop {
  animation: modal-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
</style>
