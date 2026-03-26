<template>
    <div class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container glass-card" @click.stop>
            <div class="modal-header">
                <div class="modal-icon" :class="`modal-icon-${type}`">
                    <component :is="getIcon(type)" />
                </div>
                <div class="modal-title-section">
                    <h3 class="modal-title">{{ title }}</h3>
                    <p class="modal-subtitle">{{ message }}</p>
                </div>
                <button class="modal-close" @click="handleCancel">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            
            <div class="modal-body" v-if="$slots.default">
                <slot></slot>
            </div>
            
            <div class="modal-footer">
                <button class="modal-btn modal-btn-cancel" @click="handleCancel">
                    <span>{{ cancelText }}</span>
                </button>
                <button class="modal-btn modal-btn-confirm" :class="`modal-btn-${type}`" @click="handleConfirm">
                    <span>{{ confirmText }}</span>
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 15l7-7 7 7"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    title: {
        type: String,
        default: 'Confirmation'
    },
    message: {
        type: String,
        default: 'Are you sure you want to continue?'
    },
    confirmText: {
        type: String,
        default: 'Confirm'
    },
    cancelText: {
        type: String,
        default: 'Cancel'
    },
    type: {
        type: String,
        default: 'warning',
        validator: (value) => ['warning', 'danger', 'info', 'success'].includes(value)
    }
})

const emit = defineEmits(['confirm', 'cancel'])

const getIcon = (type) => {
    const icons = {
        warning: 'WarningIcon',
        danger: 'DangerIcon',
        info: 'InfoIcon',
        success: 'SuccessIcon'
    }
    return icons[type] || 'InfoIcon'
}

const handleOverlayClick = () => {
    handleCancel()
}

const handleConfirm = () => {
    emit('confirm')
}

const handleCancel = () => {
    emit('cancel')
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal);
    padding: var(--gap-lg);
    animation: fadeIn 0.2s ease-out;
}

.modal-container {
    max-width: 480px;
    width: 100%;
    border-radius: var(--radius-xl);
    padding: 0;
    overflow: hidden;
    animation: scaleIn 0.3s ease-out;
    box-shadow: var(--shadow-2xl);
}

.modal-header {
    display: flex;
    align-items: flex-start;
    gap: var(--gap-lg);
    padding: var(--gap-xl);
    border-bottom: 1px solid var(--glass-border);
}

.modal-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.modal-icon-warning {
    background: var(--warning-light);
    color: var(--warning);
}

.modal-icon-danger {
    background: var(--danger-light);
    color: var(--danger);
}

.modal-icon-info {
    background: var(--info-light);
    color: var(--info);
}

.modal-icon-success {
    background: var(--success-light);
    color: var(--success);
}

.modal-title-section {
    flex: 1;
}

.modal-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 var(--gap-xs) 0;
    line-height: 1.2;
}

.modal-subtitle {
    font-size: 14px;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.4;
}

.modal-close {
    background: transparent;
    border: none;
    color: var(--text-tertiary);
    padding: var(--gap-sm);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition-base);
    flex-shrink: 0;
}

.modal-close:hover {
    color: var(--text-primary);
    background: var(--glass-bg);
}

.modal-body {
    padding: var(--gap-xl);
}

.modal-footer {
    display: flex;
    gap: var(--gap-md);
    justify-content: flex-end;
    padding: var(--gap-xl);
    border-top: 1px solid var(--glass-border);
}

.modal-btn {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--gap-md) var(--gap-lg);
    border: none;
    border-radius: var(--radius-md);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition-base);
    min-width: 100px;
    justify-content: center;
}

.modal-btn-cancel {
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border);
}

.modal-btn-cancel:hover {
    background: var(--glass-bg);
    color: var(--text-primary);
}

.modal-btn-confirm {
    background: var(--gradient-primary);
    color: var(--text-inverse);
    border: none;
}

.modal-btn-confirm:hover {
    box-shadow: var(--glow-primary);
    transform: translateY(-1px);
}

.modal-btn-warning.modal-btn-confirm {
    background: var(--gradient-secondary);
}

.modal-btn-warning.modal-btn-confirm:hover {
    box-shadow: 0 0 20px rgba(255, 107, 53, 0.4);
}

.modal-btn-danger.modal-btn-confirm {
    background: linear-gradient(135deg, var(--danger) 0%, #dc2626 100%);
}

.modal-btn-danger.modal-btn-confirm:hover {
    box-shadow: var(--glow-danger);
}

.modal-btn-info.modal-btn-confirm {
    background: linear-gradient(135deg, var(--info) 0%, #2563eb 100%);
}

.modal-btn-info.modal-btn-confirm:hover {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
}

.modal-btn-success.modal-btn-confirm {
    background: linear-gradient(135deg, var(--success) 0%, #059669 100%);
}

.modal-btn-success.modal-btn-confirm:hover {
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Responsive Design */
@media (max-width: 640px) {
    .modal-overlay {
        padding: var(--gap-md);
    }
    
    .modal-container {
        max-width: none;
        width: 100%;
    }
    
    .modal-header,
    .modal-body,
    .modal-footer {
        padding: var(--gap-lg);
    }
    
    .modal-footer {
        flex-direction: column;
    }
    
    .modal-btn {
        width: 100%;
    }
}
</style>
