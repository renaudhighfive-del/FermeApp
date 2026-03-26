<template>
  <button 
    @click="ui.toggleTheme"
    class="theme-toggle-btn"
    :class="{ 'dark-mode': ui.theme === 'dark' }"
    :title="`Basculer vers mode ${ui.theme === 'light' ? 'sombre' : 'clair'}`"
  >
    <div class="theme-toggle-track">
      <div class="theme-toggle-thumb">
        <transition name="theme-icon" mode="out-in">
          <!-- Sun Icon for Light Mode -->
          <svg 
            v-if="ui.theme === 'light'" 
            key="sun"
            width="20" height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
            class="theme-icon sun-icon"
          >
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>

          <!-- Moon Icon for Dark Mode -->
          <svg 
            v-else 
            key="moon"
            width="20" height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
            class="theme-icon moon-icon"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </transition>
      </div>
    </div>
    
    <!-- Cyberpunk Glow Effects -->
    <div class="cyber-glow cyber-glow-1"></div>
    <div class="cyber-glow cyber-glow-2"></div>
    
    <!-- Floating Particles -->
    <div class="particle particle-1"></div>
    <div class="particle particle-2"></div>
    <div class="particle particle-3"></div>
  </button>
</template>

<script setup>
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
</script>

<style scoped>
/* =============================================
   PREMIUM CYBERPUNK THEME TOGGLE
   ============================================= */
.theme-toggle-btn {
    position: relative;
    width: 64px;
    height: 32px;
    background: var(--glass-bg);
    border: 2px solid var(--glass-border);
    border-radius: 32px;
    cursor: pointer;
    transition: var(--transition-smooth);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    overflow: hidden;
}

.theme-toggle-btn:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-glow);
}

.theme-toggle-btn:active {
    transform: translateY(0);
}

/* Track Background */
.theme-toggle-track {
    position: absolute;
    inset: 2px;
    background: var(--gradient-surface);
    border-radius: 28px;
    overflow: hidden;
    transition: var(--transition-smooth);
}

.theme-toggle-btn.dark-mode .theme-toggle-track {
    background: var(--gradient-cyber);
}

/* Thumb/Slider */
.theme-toggle-thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 22px;
    height: 22px;
    background: var(--surface);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition-spring);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    z-index: 2;
}

.theme-toggle-btn.dark-mode .theme-toggle-thumb {
    transform: translateX(32px);
    background: var(--surface-elevated);
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.6);
}

/* Theme Icons */
.theme-icon {
    transition: var(--transition-fast);
}

.sun-icon {
    color: var(--warning);
    filter: drop-shadow(0 0 8px rgba(255, 215, 64, 0.6));
    animation: rotateSun 20s linear infinite;
}

.moon-icon {
    color: var(--primary);
    filter: drop-shadow(0 0 8px rgba(0, 229, 255, 0.6));
}

/* Icon Transitions */
.theme-icon-enter-active,
.theme-icon-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-icon-enter-from {
    opacity: 0;
    transform: rotate(-180deg) scale(0.5);
}

.theme-icon-leave-to {
    opacity: 0;
    transform: rotate(180deg) scale(0.5);
}

/* Cyberpunk Glow Effects */
.cyber-glow {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    opacity: 0;
    transition: opacity var(--transition-smooth);
}

.theme-toggle-btn:hover .cyber-glow {
    opacity: 1;
}

.cyber-glow-1 {
    top: -8px;
    left: -8px;
    width: 40px;
    height: 40px;
    background: radial-gradient(circle, rgba(0, 229, 255, 0.3) 0%, transparent 70%);
    animation: pulseGlow 2s ease-in-out infinite;
}

.cyber-glow-2 {
    bottom: -8px;
    right: -8px;
    width: 40px;
    height: 40px;
    background: radial-gradient(circle, rgba(255, 110, 64, 0.3) 0%, transparent 70%);
    animation: pulseGlow 2s ease-in-out infinite 0.5s;
}

/* Floating Particles */
.particle {
    position: absolute;
    width: 3px;
    height: 3px;
    background: var(--primary);
    border-radius: 50%;
    opacity: 0;
    pointer-events: none;
}

.theme-toggle-btn:hover .particle {
    opacity: 1;
}

.particle-1 {
    top: 8px;
    left: 50%;
    animation: floatParticle 3s ease-in-out infinite;
}

.particle-2 {
    top: 50%;
    right: 8px;
    animation: floatParticle 3s ease-in-out infinite 0.5s;
}

.particle-3 {
    bottom: 8px;
    left: 50%;
    animation: floatParticle 3s ease-in-out infinite 1s;
}

/* =============================================
   PREMIUM ANIMATIONS
   ============================================= */
@keyframes rotateSun {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes pulseGlow {
    0%, 100% {
        transform: scale(1);
        opacity: 0.6;
    }
    50% {
        transform: scale(1.2);
        opacity: 0.3;
    }
}

@keyframes floatParticle {
    0%, 100% {
        transform: translate(0, 0) scale(1);
        opacity: 0;
    }
    20% {
        opacity: 1;
    }
    50% {
        transform: translate(var(--particle-x, 10px), var(--particle-y, -10px)) scale(1.5);
        opacity: 0.8;
    }
    80% {
        opacity: 1;
    }
}

/* Particle Direction Variables */
.particle-1 {
    --particle-x: -15px;
    --particle-y: -8px;
}

.particle-2 {
    --particle-x: 8px;
    --particle-y: -15px;
}

.particle-3 {
    --particle-x: -10px;
    --particle-y: 12px;
}

/* =============================================
   RESPONSIVE ADJUSTMENTS
   ============================================= */
@media (max-width: 640px) {
    .theme-toggle-btn {
        width: 56px;
        height: 28px;
    }
    
    .theme-toggle-thumb {
        width: 20px;
        height: 20px;
        top: 2px;
        left: 2px;
    }
    
    .theme-toggle-btn.dark-mode .theme-toggle-thumb {
        transform: translateX(28px);
    }
    
    .theme-icon {
        width: 16px;
        height: 16px;
    }
    
    .cyber-glow-1,
    .cyber-glow-2 {
        width: 32px;
        height: 32px;
    }
}

/* =============================================
   ACCESSIBILITY ENHANCEMENTS
   ============================================= */
@media (prefers-reduced-motion: reduce) {
    .theme-toggle-btn,
    .theme-toggle-track,
    .theme-toggle-thumb,
    .theme-icon,
    .cyber-glow,
    .particle {
        transition: none;
        animation: none;
    }
    
    .sun-icon {
        animation: none;
    }
}

.theme-toggle-btn:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
}
</style>
