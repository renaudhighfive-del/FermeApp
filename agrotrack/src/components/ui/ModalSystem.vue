<template>
  <teleport to="body">
    <!-- Confirmation Modal -->
    <div 
      v-if="ui.confirmState.show"
      class="modal-overlay"
      :class="{ 'open': ui.confirmState.show }"
      @click="handleBackdropClick"
    >
      <div class="modal" @click.stop>
        <!-- Holographic Header -->
        <div class="modal-header-decoration"></div>
        
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="modal-title">
            <!-- Modal Icon -->
            <div class="modal-icon" :class="`modal-icon-${ui.confirmState.type}`">
              <!-- Warning Icon -->
              <svg 
                v-if="ui.confirmState.type === 'warning'" 
                width="24" height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              
              <!-- Danger Icon -->
              <svg 
                v-else-if="ui.confirmState.type === 'danger'" 
                width="24" height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              
              <!-- Info Icon -->
              <svg 
                v-else 
                width="24" height="24" 
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
            
            <span>{{ ui.confirmState.title }}</span>
          </div>
          
          <button 
            @click="handleCancel"
            class="modal-close"
            title="Fermer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <!-- Modal Body -->
        <div class="modal-body">
          <p>{{ ui.confirmState.message }}</p>
        </div>
        
        <!-- Modal Footer -->
        <div class="modal-footer">
          <button 
            @click="handleCancel"
            class="btn btn-outline"
            :class="`btn-${ui.confirmState.type}`"
          >
            {{ ui.confirmState.cancelText }}
          </button>
          <button 
            @click="handleConfirm"
            class="btn"
            :class="`btn-primary btn-${ui.confirmState.type}`"
          >
            {{ ui.confirmState.confirmText }}
          </button>
        </div>
        
        <!-- Cyberpunk Glow Effects -->
        <div class="modal-glow modal-glow-1"></div>
        <div class="modal-glow modal-glow-2"></div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()

const handleConfirm = () => {
    if (ui.confirmState.onConfirm) {
        ui.confirmState.onConfirm()
    }
}

const handleCancel = () => {
    if (ui.confirmState.onCancel) {
        ui.confirmState.onCancel()
    }
}

const handleBackdropClick = () => {
    handleCancel()
}
</script>

<style scoped>
/* =============================================
   PREMIUM CYBERPUNK MODAL SYSTEM
   ============================================= */
.modal-overlay {
    display: none; 
    position: fixed; 
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    z-index: var(--z-modal-backdrop);
    align-items: center; 
    justify-content: center;
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.modal-overlay.open { 
    display: flex; 
    opacity: 1;
}

.modal {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    width: 560px; 
    max-width: 95vw;
    max-height: 90vh; 
    overflow-y: auto;
    position: relative;
    box-shadow: var(--shadow-2xl);
    transform: scale(0.9);
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-overlay.open .modal {
    transform: scale(1);
}

/* Holographic Header Decoration */
.modal-header-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--gradient-cyber);
    background-size: 200% 200%;
    animation: holographicShift 4s ease infinite;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

/* Modal Header */
.modal-header {
    display: flex; 
    align-items: center; 
    justify-content: space-between;
    padding: 32px 32px 24px;
    border-bottom: 1px solid var(--divider);
}

.modal-title {
    display: flex; 
    align-items: center; 
    gap: 16px;
    font-family: var(--font-display); 
    font-size: 20px; 
    font-weight: 700;
    color: var(--text-primary);
}

.modal-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface-elevated);
    transition: var(--transition-smooth);
}

.modal-icon-warning {
    color: var(--warning);
    background: var(--warning-bg);
    border: 1px solid var(--warning-border);
    box-shadow: var(--warning-glow);
}

.modal-icon-danger {
    color: var(--danger);
    background: var(--danger-bg);
    border: 1px solid var(--danger-border);
    box-shadow: var(--danger-glow);
}

.modal-icon-info {
    color: var(--info);
    background: var(--info-bg);
    border: 1px solid var(--info-border);
    box-shadow: var(--info-glow);
}

.modal-close {
    cursor: pointer; 
    color: var(--text-muted); 
    padding: 8px;
    border-radius: var(--radius-sm);
    transition: var(--transition-fast); 
    border: none; 
    background: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-close:hover { 
    background: var(--surface-hover);
    color: var(--text-primary);
    transform: scale(1.1);
}

/* Modal Body */
.modal-body {
    padding: 24px 32px;
    color: var(--text);
    font-size: 14px;
    line-height: 1.6;
}

.modal-body p {
    margin: 0;
}

/* Modal Footer */
.modal-footer { 
    display: flex; 
    gap: 12px; 
    justify-content: flex-end; 
    padding: 24px 32px 32px;
    border-top: 1px solid var(--divider);
}

/* Modal Buttons */
.modal-footer .btn {
    min-width: 120px;
    padding: 12px 24px;
    border-radius: var(--radius-btn);
    font-weight: 600;
    font-size: 14px;
    transition: var(--transition-smooth);
    position: relative;
    overflow: hidden;
}

.modal-footer .btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: var(--gradient-primary);
    transition: left var(--transition-spring);
    opacity: 0.1;
}

.modal-footer .btn:hover::before {
    left: 0;
}

.btn-outline {
    background: var(--glass-bg);
    border: 2px solid var(--border);
    color: var(--text-secondary);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
}

.btn-outline:hover {
    border-color: var(--primary);
    color: var(--text-primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-glow);
}

.btn-primary {
    background: var(--gradient-primary);
    border: 2px solid var(--primary);
    color: var(--text-inverse);
    font-weight: 700;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-glow);
}

/* Type-specific button styles */
.btn-warning.btn-outline:hover {
    border-color: var(--warning);
    box-shadow: var(--warning-glow);
}

.btn-warning.btn-primary {
    background: var(--gradient-warning);
    border-color: var(--warning);
}

.btn-danger.btn-outline:hover {
    border-color: var(--danger);
    box-shadow: var(--danger-glow);
}

.btn-danger.btn-primary {
    background: var(--gradient-danger);
    border-color: var(--danger);
}

.btn-info.btn-outline:hover {
    border-color: var(--info);
    box-shadow: var(--info-glow);
}

.btn-info.btn-primary {
    background: var(--gradient-info);
    border-color: var(--info);
}

/* Cyberpunk Glow Effects */
.modal-glow {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    opacity: 0.6;
    animation: modalGlow 4s ease-in-out infinite;
}

.modal-glow-1 {
    top: -20px;
    left: -20px;
    width: 80px;
    height: 80px;
    background: radial-gradient(circle, rgba(0, 229, 255, 0.3) 0%, transparent 70%);
}

.modal-glow-2 {
    bottom: -20px;
    right: -20px;
    width: 80px;
    height: 80px;
    background: radial-gradient(circle, rgba(255, 110, 64, 0.3) 0%, transparent 70%);
    animation-delay: 2s;
}

/* =============================================
   MODAL ANIMATIONS
   ============================================= */
@keyframes modalGlow {
    0%, 100% {
        transform: scale(1);
        opacity: 0.3;
    }
    50% {
        transform: scale(1.2);
        opacity: 0.6;
    }
}

@keyframes holographicShift {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

/* =============================================
   RESPONSIVE DESIGN
   ============================================= */
@media (max-width: 640px) {
    .modal {
        width: 95vw;
        margin: var(--gap);
        padding: 24px;
        border-radius: var(--radius);
    }
    
    .modal-header {
        padding: 24px 24px 20px;
    }
    
    .modal-title {
        font-size: 18px;
        gap: 12px;
    }
    
    .modal-icon {
        width: 40px;
        height: 40px;
    }
    
    .modal-body {
        padding: 20px 24px;
        font-size: 13px;
    }
    
    .modal-footer {
        flex-direction: column;
        padding: 20px 24px 24px;
    }
    
    .modal-footer .btn {
        width: 100%;
        min-width: auto;
    }
}

@media (max-width: 480px) {
    .modal {
        margin: 16px;
        padding: 20px;
    }
    
    .modal-header {
        padding: 20px 20px 16px;
    }
    
    .modal-title {
        font-size: 16px;
    }
    
    .modal-body {
        padding: 16px 20px;
        font-size: 12px;
    }
    
    .modal-footer {
        padding: 16px 20px 20px;
        gap: 8px;
    }
}

/* =============================================
   ACCESSIBILITY & MOTION PREFERENCES
   ============================================= */
@media (prefers-reduced-motion: reduce) {
    .modal-overlay,
    .modal,
    .modal-header-decoration,
    .modal-icon,
    .modal-close,
    .modal-footer .btn,
    .modal-glow {
        transition: none;
        animation: none;
    }
    
    .modal-overlay.open .modal {
        transform: scale(1);
    }
}

.modal:focus-within {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
}
</style>
