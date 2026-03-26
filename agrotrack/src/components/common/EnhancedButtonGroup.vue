<template>
    <div class="enhanced-button-group">
        <button 
            v-for="(btn, index) in buttons" 
            :key="btn.id"
            :class="getButtonClasses(btn)"
            :disabled="btn.disabled || loading"
            @click="handleClick(btn)"
        >
            <span class="button-content">
                <component v-if="btn.icon" :is="btn.icon" class="button-icon" />
                <span class="button-text">{{ btn.text }}</span>
                <span v-if="btn.badge" class="button-badge">{{ btn.badge }}</span>
            </span>
            
            <div class="button-effects">
                <div class="button-glow"></div>
                <div class="button-ripple" v-if="btn.ripple"></div>
            </div>
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    buttons: {
        type: Array,
        required: true
    },
    variant: {
        type: String,
        default: 'primary',
        validator: (value) => ['primary', 'secondary', 'ghost', 'danger', 'success'].includes(value)
    },
    size: {
        type: String,
        default: 'medium',
        validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['click'])

const getButtonClasses = (btn) => {
    const classes = [
        'enhanced-button',
        `enhanced-button-${props.size}`,
        `enhanced-button-${btn.variant || props.variant}`,
        { 'enhanced-button-disabled': btn.disabled },
        { 'enhanced-button-loading': props.loading },
        { 'enhanced-button-magnetic': btn.magnetic }
    ]
    
    if (btn.active) {
        classes.push('enhanced-button-active')
    }
    
    return classes.join(' ')
}

const handleClick = (btn) => {
    if (!btn.disabled && !props.loading) {
        emit('click', btn)
        
        // Add ripple effect
        if (btn.ripple) {
            createRipple(event)
        }
    }
}

const createRipple = (event) => {
    const button = event.currentTarget
    const ripple = button.querySelector('.button-ripple')
    if (!ripple) return
    
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2
    
    ripple.style.width = ripple.style.height = size + 'px'
    ripple.style.left = x + 'px'
    ripple.style.top = y + 'px'
    
    ripple.classList.add('ripple-animate')
    
    setTimeout(() => {
        ripple.classList.remove('ripple-animate')
    }, 600)
}
</script>

<style scoped>
.enhanced-button-group {
    display: flex;
    gap: var(--gap-sm);
    align-items: center;
    flex-wrap: wrap;
}

.enhanced-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: var(--radius-md);
    font-family: var(--font-heading);
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: var(--transition-base);
    overflow: hidden;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

/* Size Variants */
.enhanced-button-small {
    padding: 8px 16px;
    font-size: 12px;
    min-height: 36px;
}

.enhanced-button-medium {
    padding: 12px 24px;
    font-size: 14px;
    min-height: 44px;
}

.enhanced-button-large {
    padding: 16px 32px;
    font-size: 16px;
    min-height: 52px;
}

/* Variant Styles */
.enhanced-button-primary {
    background: var(--gradient-primary);
    color: var(--text-inverse);
    box-shadow: var(--shadow-md);
}

.enhanced-button-primary:hover {
    box-shadow: var(--glow-primary);
    transform: translateY(-2px);
}

.enhanced-button-secondary {
    background: var(--gradient-accent);
    color: var(--text-inverse);
    box-shadow: var(--shadow-md);
}

.enhanced-button-secondary:hover {
    box-shadow: var(--glow-accent);
    transform: translateY(-2px);
}

.enhanced-button-ghost {
    background: transparent;
    color: var(--text-primary);
    border: 1px solid var(--glass-border);
    backdrop-filter: var(--glass-blur);
}

.enhanced-button-ghost:hover {
    background: var(--glass-bg);
    border-color: var(--accent);
    box-shadow: var(--glow-accent);
}

.enhanced-button-danger {
    background: linear-gradient(135deg, var(--danger) 0%, #dc2626 100%);
    color: var(--text-inverse);
    box-shadow: var(--shadow-md);
}

.enhanced-button-danger:hover {
    box-shadow: var(--glow-danger);
    transform: translateY(-2px);
}

.enhanced-button-success {
    background: linear-gradient(135deg, var(--success) 0%, #059669 100%);
    color: var(--text-inverse);
    box-shadow: var(--shadow-md);
}

.enhanced-button-success:hover {
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
    transform: translateY(-2px);
}

/* Interactive States */
.enhanced-button-active {
    box-shadow: var(--glow-primary);
    transform: scale(1.05);
}

.enhanced-button-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
}

.enhanced-button-loading {
    cursor: wait;
}

.enhanced-button-magnetic {
    transition: var(--transition-bounce);
}

.enhanced-button-magnetic:hover {
    transform: scale(1.05);
}

/* Button Content */
.button-content {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
}

.button-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
}

.button-text {
    white-space: nowrap;
}

.button-badge {
    background: var(--danger);
    color: var(--text-inverse);
    font-size: 10px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: var(--radius-full);
    min-width: 18px;
    text-align: center;
}

/* Effects */
.button-effects {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
}

.button-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: inherit;
    border-radius: inherit;
    opacity: 0;
    transition: var(--transition-base);
}

.enhanced-button:hover .button-glow {
    opacity: 0.3;
    filter: blur(8px);
}

.button-ripple {
    position: absolute;
    border-radius: var(--radius-full);
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    pointer-events: none;
}

.button-ripple.ripple-animate {
    animation: ripple 0.6s ease-out;
}

/* Loading State */
.enhanced-button-loading::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: loading-shimmer 1.5s infinite;
}

/* Animations */
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes loading-shimmer {
    to {
        left: 100%;
    }
}

/* Responsive Design */
@media (max-width: 640px) {
    .enhanced-button-group {
        flex-direction: column;
        width: 100%;
    }
    
    .enhanced-button {
        width: 100%;
        justify-content: center;
    }
}

/* Group Variants */
.enhanced-button-group.vertical {
    flex-direction: column;
}

.enhanced-button-group.stacked {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
}

.enhanced-button-group.pill .enhanced-button {
    border-radius: var(--radius-full);
}

.enhanced-button-group.glass .enhanced-button {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
}

.enhanced-button-group.glass .enhanced-button:hover {
    background: var(--bg-glass);
}
</style>
