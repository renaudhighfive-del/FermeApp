<template>
  <!-- Global Toast Notifications -->
  <div class="notification-container">
    <TransitionGroup name="notification">
      <div 
        v-for="notif in ui.notifications" 
        :key="notif.id"
        class="digital-notification"
        :class="`notification-${notif.type}`"
      >
        <!-- Icon -->
        <div class="notification-icon-wrapper">
          <div v-if="notif.type === 'success'" class="notification-icon icon-success">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
          </div>
          <div v-if="notif.type === 'error'" class="notification-icon icon-error">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <div v-if="notif.type === 'warning'" class="notification-icon icon-warning">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div v-if="notif.type === 'info'" class="notification-icon icon-info">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
        </div>

        <!-- Content -->
        <div class="notification-content">
          <div class="notification-title" :class="`title-${notif.type}`">
            {{ notif.type === 'success' ? 'Succès' : notif.type === 'error' ? 'Erreur' : notif.type === 'warning' ? 'Attention' : 'Info' }}
          </div>
          <div class="notification-message">{{ notif.message }}</div>
        </div>

        <!-- Close Button -->
        <button @click="ui.removeNotification(notif.id)" class="notification-close magnetic-field">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        
        <!-- Progress Bar -->
        <div class="notification-progress" :class="`progress-${notif.type}`"></div>
      </div>
    </TransitionGroup>
  </div>

  <!-- Global Confirmation Modal -->
  <div v-if="ui.confirmState.show" class="premium-modal-overlay" @click.self="ui.confirmState.onCancel">
    <div class="premium-modal-container">
      <!-- Icon Section -->
      <div class="premium-modal-icon-section">
        <div v-if="ui.confirmState.type === 'danger'" class="premium-modal-icon icon-danger-large">
          <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </div>
        <div v-else-if="ui.confirmState.type === 'warning'" class="premium-modal-icon icon-warning-large">
          <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <div v-else class="premium-modal-icon icon-info-large">
          <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
      </div>

      <!-- Text Section -->
      <h2 class="premium-modal-main-title">{{ ui.confirmState.title }}</h2>
      <p class="premium-modal-description">{{ ui.confirmState.message }}</p>

      <!-- Actions -->
      <div class="premium-modal-actions">
        <button 
          @click="ui.confirmState.onCancel"
          class="premium-btn premium-btn-cancel magnetic-field"
        >
          {{ ui.confirmState.cancelText }}
        </button>
        <button 
          @click="ui.confirmState.onConfirm"
          class="premium-btn magnetic-field"
          :class="{
            'premium-btn-danger': ui.confirmState.type === 'danger',
            'premium-btn-warning': ui.confirmState.type === 'warning',
            'premium-btn-primary': ui.confirmState.type !== 'danger' && ui.confirmState.type !== 'warning',
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
/* Notification Container */
.notification-container {
    position: fixed;
    top: var(--gap-xl);
    right: var(--gap-xl);
    z-index: var(--z-toast);
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
    pointer-events: none;
    width: 100%;
    max-width: 380px;
    padding: 0 var(--gap-md);
}

/* Digital Notification */
.digital-notification {
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: var(--gap-md);
    padding: var(--gap-lg);
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: var(--border-thin) solid var(--glass-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--glass-shadow);
    overflow: hidden;
    position: relative;
    transition: var(--transition-base);
    animation: slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.digital-notification:hover {
    transform: translateX(-4px);
    box-shadow: var(--shadow-xl);
}

/* Notification Types */
.notification-success {
    border-left: 3px solid var(--success);
}

.notification-error {
    border-left: 3px solid var(--danger);
}

.notification-warning {
    border-left: 3px solid var(--warning);
}

.notification-info {
    border-left: 3px solid var(--info);
}

/* Notification Icon */
.notification-icon-wrapper {
    flex-shrink: 0;
}

.notification-icon {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-success {
    background: var(--success-light);
    color: var(--success);
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
}

.icon-error {
    background: var(--danger-light);
    color: var(--danger);
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
}

.icon-warning {
    background: var(--warning-light);
    color: var(--warning);
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
}

.icon-info {
    background: var(--info-light);
    color: var(--info);
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}

/* Notification Content */
.notification-content {
    flex: 1;
    min-width: 0;
}

.notification-title {
    font-family: var(--font-heading);
    font-size: 14px;
    font-weight: 700;
    margin-bottom: var(--gap-xs);
}

.title-success { color: var(--success); }
.title-error { color: var(--danger); }
.title-warning { color: var(--warning); }
.title-info { color: var(--info); }

.notification-message {
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.4;
}

/* Notification Close */
.notification-close {
    background: transparent;
    border: none;
    color: var(--text-tertiary);
    padding: var(--gap-xs);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition-base);
    flex-shrink: 0;
    opacity: 0;
}

.digital-notification:hover .notification-close {
    opacity: 1;
}

.notification-close:hover {
    color: var(--text-primary);
    background: var(--glass-bg);
}

/* Progress Bar */
.notification-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    animation: progress 4s linear forwards;
}

.progress-success { background: var(--success); }
.progress-error { background: var(--danger); }
.progress-warning { background: var(--warning); }
.progress-info { background: var(--info); }

/* Premium Modal Overlay */
.premium-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal);
    padding: var(--gap-lg);
    animation: fadeIn 0.2s ease-out;
}

/* Premium Modal Container */
.premium-modal-container {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: var(--border-thin) solid var(--glass-border);
    border-radius: var(--radius-xl);
    max-width: 420px;
    width: 100%;
    padding: var(--gap-2xl);
    text-align: center;
    animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: var(--shadow-2xl);
}

/* Premium Modal Icon */
.premium-modal-icon-section {
    display: flex;
    justify-content: center;
    margin-bottom: var(--gap-lg);
}

.premium-modal-icon {
    width: 80px;
    height: 80px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-danger-large {
    background: var(--danger-light);
    color: var(--danger);
    box-shadow: 0 0 30px rgba(239, 68, 68, 0.4);
    animation: pulse-glow 2s ease-in-out infinite;
}

.icon-warning-large {
    background: var(--warning-light);
    color: var(--warning);
    box-shadow: 0 0 30px rgba(245, 158, 11, 0.4);
    animation: pulse-glow 2s ease-in-out infinite;
}

.icon-info-large {
    background: var(--info-light);
    color: var(--info);
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);
    animation: pulse-glow 2s ease-in-out infinite;
}

/* Premium Modal Text */
.premium-modal-main-title {
    font-family: var(--font-heading);
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 var(--gap-sm) 0;
}

.premium-modal-description {
    font-size: 15px;
    color: var(--text-secondary);
    margin: 0 0 var(--gap-xl) 0;
    line-height: 1.6;
}

/* Premium Modal Actions */
.premium-modal-actions {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
}

.premium-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-sm);
    padding: var(--gap-md) var(--gap-xl);
    border: none;
    border-radius: var(--radius-md);
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: var(--transition-base);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.premium-btn-cancel {
    background: transparent;
    color: var(--text-secondary);
    border: var(--border-thin) solid var(--glass-border);
}

.premium-btn-cancel:hover {
    background: var(--glass-bg);
    color: var(--text-primary);
    border-color: var(--accent);
}

.premium-btn-primary {
    background: var(--gradient-primary);
    color: var(--text-inverse);
    box-shadow: var(--shadow-md);
}

.premium-btn-primary:hover {
    box-shadow: var(--glow-primary);
    transform: translateY(-2px);
}

.premium-btn-danger {
    background: linear-gradient(135deg, var(--danger) 0%, #dc2626 100%);
    color: var(--text-inverse);
    box-shadow: var(--shadow-md);
}

.premium-btn-danger:hover {
    box-shadow: var(--glow-danger);
    transform: translateY(-2px);
}

.premium-btn-warning {
    background: var(--gradient-secondary);
    color: var(--text-inverse);
    box-shadow: var(--shadow-md);
}

.premium-btn-warning:hover {
    box-shadow: 0 0 20px rgba(255, 107, 53, 0.4);
    transform: translateY(-2px);
}

/* Magnetic Field */
.magnetic-field {
    transition: var(--transition-slow);
}

.magnetic-field:hover {
    transform: scale(1.02);
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.9) translateY(10px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(100%) scale(0.9);
    }
    to {
        opacity: 1;
        transform: translateX(0) scale(1);
    }
}

@keyframes progress {
    from { width: 100%; }
    to { width: 0%; }
}

@keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px currentColor; }
    50% { box-shadow: 0 0 40px currentColor; }
}

/* Transitions */
.notification-enter-active,
.notification-leave-active {
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

/* Responsive */
@media (max-width: 640px) {
    .notification-container {
        left: var(--gap-md);
        right: var(--gap-md);
        max-width: none;
    }
    
    .premium-modal-container {
        padding: var(--gap-xl);
    }
    
    .premium-modal-main-title {
        font-size: 20px;
    }
    
    .premium-modal-icon {
        width: 64px;
        height: 64px;
    }
}
</style>
