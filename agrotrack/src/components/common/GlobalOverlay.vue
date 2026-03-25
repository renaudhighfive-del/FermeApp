<template>
  <!-- Global Toast Notifications -->
  <div class="fixed top-6 right-6 z-[1200] flex flex-col gap-3 pointer-events-none w-full max-w-[320px] px-4 sm:px-0">
    <TransitionGroup name="notification">
      <div 
        v-for="notif in ui.notifications" 
        :key="notif.id"
        class="pointer-events-auto flex items-center p-4 rounded-xl shadow-2xl border bg-[var(--card)] overflow-hidden relative group transition-all"
        :class="{
          'border-[var(--success)]/20 bg-[var(--success)]/5': notif.type === 'success',
          'border-[var(--danger)]/20 bg-[var(--danger)]/5': notif.type === 'error',
          'border-[var(--warn)]/20 bg-[var(--warn)]/5': notif.type === 'warning',
          'border-[var(--primary)]/20 bg-[var(--primary)]/5': notif.type === 'info',
        }"
      >
        <!-- Icon -->
        <div class="mr-3 flex-shrink-0">
          <div v-if="notif.type === 'success'" class="w-8 h-8 rounded-full bg-[var(--success)]/10 flex items-center justify-center text-[var(--success)]">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
          </div>
          <div v-if="notif.type === 'error'" class="w-8 h-8 rounded-full bg-[var(--danger)]/10 flex items-center justify-center text-[var(--danger)]">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <div v-if="notif.type === 'warning'" class="w-8 h-8 rounded-full bg-[var(--warn)]/10 flex items-center justify-center text-[var(--warn)]">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div v-if="notif.type === 'info'" class="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-grow min-w-0">
          <div class="text-sm font-bold" :class="{
            'text-[var(--success)]': notif.type === 'success',
            'text-[var(--danger)]': notif.type === 'error',
            'text-[var(--warn)]': notif.type === 'warning',
            'text-[var(--primary)] dark:text-[var(--accent)]': notif.type === 'info',
          }">
            {{ notif.type === 'success' ? 'Succès' : notif.type === 'error' ? 'Erreur' : notif.type === 'warning' ? 'Attention' : 'Info' }}
          </div>
          <div class="text-xs text-[var(--soft)] leading-relaxed truncate">{{ notif.message }}</div>
        </div>

        <!-- Close Button -->
        <button @click="ui.removeNotification(notif.id)" class="ml-2 p-1 text-[var(--soft)] hover:text-[var(--text)] transition-colors">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </TransitionGroup>
  </div>

  <!-- Global Confirmation Modal -->
  <div v-if="ui.confirmState.show" class="fixed inset-0 z-[1300] flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="ui.confirmState.onCancel"></div>
    <div class="card max-w-md w-full relative z-10 animate-fadeIn p-8 text-center">
      <!-- Icon Section -->
      <div class="flex justify-center mb-6">
        <div v-if="ui.confirmState.type === 'danger'" class="w-20 h-20 bg-[var(--danger)]/10 rounded-full flex items-center justify-center text-[var(--danger)]">
          <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </div>
        <div v-else-if="ui.confirmState.type === 'warning'" class="w-20 h-20 bg-[var(--warn)]/10 rounded-full flex items-center justify-center text-[var(--warn)]">
          <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <div v-else class="w-20 h-20 bg-[var(--primary)]/10 rounded-full flex items-center justify-center text-[var(--primary)] dark:text-[var(--accent)]">
          <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
      </div>

      <!-- Text Section -->
      <h2 class="text-2xl font-bold text-[var(--text)] mb-2">{{ ui.confirmState.title }}</h2>
      <p class="text-[var(--soft)] mb-8 leading-relaxed">{{ ui.confirmState.message }}</p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3">
        <button 
          @click="ui.confirmState.onCancel"
          class="btn btn-ghost flex-1"
        >
          {{ ui.confirmState.cancelText }}
        </button>
        <button 
          @click="ui.confirmState.onConfirm"
          class="btn flex-1"
          :class="{
            'bg-[var(--danger)] text-white hover:bg-[var(--danger)]/90': ui.confirmState.type === 'danger',
            'bg-[var(--warn)] text-white hover:bg-[var(--warn)]/90': ui.confirmState.type === 'warning',
            'btn-primary': ui.confirmState.type !== 'danger' && ui.confirmState.type !== 'warning',
          }"
        >
          {{ ui.confirmState.confirmText }}
        </button>
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
