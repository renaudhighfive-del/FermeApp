<template>
  <teleport to="body">
    <div class="notification-container">
      <transition-group name="notification" tag="div">
        <div
          v-for="notification in ui.notifications"
          :key="notification.id"
          class="notification"
          :class="[`notification-${notification.type}`, 'show']"
        >
          <!-- Cyberpunk Border Animation -->
          <div class="notification-border"></div>
          
          <!-- Notification Content -->
          <div class="notification-content">
            <div class="notification-header">
              <div class="notification-icon">
                <!-- Success Icon -->
                <svg 
                  v-if="notification.type === 'success'" 
                  width="20" height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2"
                >
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                
                <!-- Error Icon -->
                <svg 
                  v-else-if="notification.type === 'error'" 
                  width="20" height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                
                <!-- Warning Icon -->
                <svg 
                  v-else-if="notification.type === 'warning'" 
                  width="20" height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                
                <!-- Info Icon -->
                <svg 
                  v-else 
                  width="20" height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              </div>
              
              <div class="notification-title">
                {{ getNotificationTitle(notification.type) }}
              </div>
              
              <button 
                @click="ui.removeNotification(notification.id)"
                class="notification-close"
                title="Fermer la notification"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <div class="notification-message">
              {{ notification.message }}
            </div>
            
            <!-- Progress Bar -->
            <div class="notification-progress">
              <div 
                class="notification-progress-fill"
                :style="{ animationDuration: '3000ms' }"
              ></div>
            </div>
          </div>
          
          <!-- Holographic Glow Effect -->
          <div class="notification-glow"></div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()

const getNotificationTitle = (type) => {
    const titles = {
        success: 'Succès',
        error: 'Erreur',
        warning: 'Attention',
        info: 'Information'
    }
    return titles[type] || 'Notification'
}
</script>

<style scoped>
/* =============================================
   PREMIUM CYBERPUNK NOTIFICATION SYSTEM
   ============================================= */
.notification-container {
    position: fixed;
    top: var(--navbar-h);
    right: var(--gap);
    z-index: var(--z-toast);
    pointer-events: none;
    max-width: 400px;
    width: 100%;
}

.notification {
    position: relative;
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-2xl);
    margin-bottom: var(--gap-sm);
    pointer-events: all;
    overflow: hidden;
    transform: translateX(120%);
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.notification.show {
    transform: translateX(0);
}

/* Notification Type Variants */
.notification-success {
    border-color: var(--success-border);
    background: var(--glass-bg);
}

.notification-success .notification-border {
    background: var(--gradient-success);
}

.notification-success .notification-icon {
    color: var(--success);
    filter: drop-shadow(0 0 8px rgba(0, 230, 118, 0.6));
}

.notification-error {
    border-color: var(--danger-border);
    background: var(--glass-bg);
}

.notification-error .notification-border {
    background: var(--gradient-danger);
}

.notification-error .notification-icon {
    color: var(--danger);
    filter: drop-shadow(0 0 8px rgba(255, 82, 82, 0.6));
}

.notification-warning {
    border-color: var(--warning-border);
    background: var(--glass-bg);
}

.notification-warning .notification-border {
    background: var(--gradient-warning);
}

.notification-warning .notification-icon {
    color: var(--warning);
    filter: drop-shadow(0 0 8px rgba(255, 215, 64, 0.6));
}

.notification-info {
    border-color: var(--info-border);
    background: var(--glass-bg);
}

.notification-info .notification-border {
    background: var(--gradient-info);
}

.notification-info .notification-icon {
    color: var(--info);
    filter: drop-shadow(0 0 8px rgba(68, 138, 255, 0.6));
}

/* Animated Border */
.notification-border {
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    border-radius: 2px 0 0 2px;
    animation: borderGlow 2s ease-in-out infinite;
}

/* Notification Content */
.notification-content {
    padding: 20px;
    position: relative;
    z-index: 2;
}

.notification-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}

.notification-icon {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--surface-elevated);
    transition: var(--transition-smooth);
}

.notification:hover .notification-icon {
    transform: scale(1.1);
}

.notification-title {
    flex: 1;
    font-weight: 700;
    font-size: 14px;
    color: var(--text-primary);
    font-family: var(--font-display);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.notification-close {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px;
    border-radius: var(--radius-sm);
    transition: var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
}

.notification-close:hover {
    background: var(--surface-hover);
    color: var(--text-primary);
    transform: scale(1.1);
}

.notification-message {
    color: var(--text-secondary);
    font-size: 13px;
    line-height: 1.5;
    margin-bottom: 12px;
}

/* Progress Bar */
.notification-progress {
    position: relative;
    height: 2px;
    background: var(--border);
    border-radius: 1px;
    overflow: hidden;
}

.notification-progress-fill {
    height: 100%;
    background: var(--gradient-primary);
    border-radius: 1px;
    animation: progressShrink 3000ms linear forwards;
}

.notification-success .notification-progress-fill {
    background: var(--gradient-success);
}

.notification-error .notification-progress-fill {
    background: var(--gradient-danger);
}

.notification-warning .notification-progress-fill {
    background: var(--gradient-warning);
}

.notification-info .notification-progress-fill {
    background: var(--gradient-info);
}

/* Holographic Glow Effect */
.notification-glow {
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: var(--gradient-holographic);
    border-radius: var(--radius);
    opacity: 0;
    transition: opacity var(--transition-smooth);
    pointer-events: none;
    z-index: -1;
}

.notification:hover .notification-glow {
    opacity: 0.2;
}

/* =============================================
   NOTIFICATION ANIMATIONS
   ============================================= */
.notification-enter-active {
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.notification-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-enter-from {
    opacity: 0;
    transform: translateX(120%) scale(0.8);
}

.notification-leave-to {
    opacity: 0;
    transform: translateX(120%) scale(0.8);
}

.notification-move {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes borderGlow {
    0%, 100% {
        opacity: 0.8;
        filter: brightness(1);
    }
    50% {
        opacity: 1;
        filter: brightness(1.2);
    }
}

@keyframes progressShrink {
    from {
        width: 100%;
    }
    to {
        width: 0%;
    }
}

/* =============================================
   RESPONSIVE DESIGN
   ============================================= */
@media (max-width: 640px) {
    .notification-container {
        top: var(--navbar-h);
        right: var(--gap-sm);
        left: var(--gap-sm);
        max-width: none;
    }
    
    .notification {
        margin-bottom: var(--gap-xs);
    }
    
    .notification-content {
        padding: 16px;
    }
    
    .notification-title {
        font-size: 13px;
    }
    
    .notification-message {
        font-size: 12px;
    }
}

@media (max-width: 480px) {
    .notification-container {
        right: 8px;
        left: 8px;
    }
    
    .notification-content {
        padding: 12px;
    }
}

/* =============================================
   ACCESSIBILITY & MOTION PREFERENCES
   ============================================= */
@media (prefers-reduced-motion: reduce) {
    .notification,
    .notification-border,
    .notification-icon,
    .notification-close,
    .notification-glow,
    .notification-progress-fill {
        transition: none;
        animation: none;
    }
    
    .notification-progress-fill {
        animation: progressShrink 3000ms linear forwards;
    }
}

.notification:focus-within {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
}
</style>
