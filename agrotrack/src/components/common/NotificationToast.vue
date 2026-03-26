<template>
    <div class="digital-notification" :class="`toast-${notification.type}`" @click="handleClick">
        <div class="notification-glow" :class="`glow-${notification.type}`"></div>
        <div class="toast-icon-wrapper" :class="`icon-${notification.type}`">
            <component :is="getIcon(notification.type)" class="toast-icon" />
        </div>
        <div class="toast-content">
            <h4 class="toast-title holographic-text">{{ notification.title }}</h4>
            <p class="toast-message">{{ notification.message }}</p>
        </div>
        <div class="toast-progress-bar" :class="`progress-${notification.type}`" :style="{ animationDuration: `${duration}ms` }"></div>
        <button class="toast-close magnetic-field" @click.stop="remove">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    notification: {
        type: Object,
        required: true
    },
    duration: {
        type: Number,
        default: 4000
    }
})

const emit = defineEmits(['remove'])

const getIcon = (type) => {
    const icons = {
        success: 'SuccessIcon',
        error: 'ErrorIcon',
        warning: 'WarningIcon',
        info: 'InfoIcon'
    }
    return icons[type] || 'InfoIcon'
}

const handleClick = () => {
    if (props.notification.onClick) {
        props.notification.onClick()
    }
}

const remove = () => {
    emit('remove', props.notification.id)
}
</script>

<style scoped>
.digital-notification {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--glass-shadow);
    min-width: 320px;
    max-width: 400px;
    cursor: pointer;
    transition: var(--transition-base);
    animation: slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    overflow: hidden;
}

.digital-notification:hover {
    transform: translateX(-4px);
    box-shadow: var(--shadow-xl);
}

/* Background Glow Effect */
.notification-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.05;
    transition: var(--transition-base);
    pointer-events: none;
}

.digital-notification:hover .notification-glow {
    opacity: 0.1;
}

.glow-success { background: var(--success); }
.glow-error { background: var(--danger); }
.glow-warning { background: var(--warning); }
.glow-info { background: var(--info); }

/* Toast Icon Wrapper */
.toast-icon-wrapper {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    z-index: 1;
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

.toast-icon {
    width: 22px;
    height: 22px;
}

.toast-content {
    flex: 1;
}

.toast-title {
    font-family: var(--font-heading);
    font-size: 14px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 4px 0;
    line-height: 1.3;
}

.holographic-text {
    background: var(--gradient-hologram);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: holographic 3s ease infinite;
}

.toast-message {
    font-size: 13px;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.4;
}

.toast-progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    animation: progress linear;
    border-radius: var(--radius-full);
}

.progress-success { background: var(--success); box-shadow: 0 0 10px var(--success); }
.progress-error { background: var(--danger); box-shadow: 0 0 10px var(--danger); }
.progress-warning { background: var(--warning); box-shadow: 0 0 10px var(--warning); }
.progress-info { background: var(--info); box-shadow: 0 0 10px var(--info); }

.toast-close {
    position: absolute;
    top: 8px;
    right: 8px;
    background: transparent;
    border: none;
    color: var(--text-tertiary);
    padding: 6px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    opacity: 0;
    transition: var(--transition-base);
    z-index: 1;
}

.digital-notification:hover .toast-close {
    opacity: 1;
}

.toast-close:hover {
    color: var(--text-primary);
    background: var(--glass-bg);
    box-shadow: var(--glow-accent);
}

/* Type-specific styles */
.toast-success {
    border-left: 3px solid var(--success);
    color: var(--success);
}

.toast-success .toast-icon {
    color: var(--success);
}

.toast-error {
    border-left: 3px solid var(--danger);
    color: var(--danger);
}

.toast-error .toast-icon {
    color: var(--danger);
}

.toast-warning {
    border-left: 3px solid var(--warning);
    color: var(--warning);
}

.toast-warning .toast-icon {
    color: var(--warning);
}

.toast-info {
    border-left: 3px solid var(--info);
    color: var(--info);
}

.toast-info .toast-icon {
    color: var(--info);
}

/* Animations */
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
    from {
        width: 100%;
    }
    to {
        width: 0%;
    }
}

@keyframes holographic {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* Magnetic Field */
.magnetic-field {
    transition: var(--transition-slow);
}

.magnetic-field:hover {
    transform: scale(1.05);
}
</style>
