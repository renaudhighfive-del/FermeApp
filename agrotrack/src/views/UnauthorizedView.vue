<script setup>
    import { useRouter } from 'vue-router'
    const router = useRouter()
</script>

<template>
    <div class="unauthorized-container">
        <!-- Immersive Agriculture Background -->
        <div class="immersive-background">
            <div class="data-grid-overlay"></div>
            <div class="gradient-overlay"></div>
        </div>

        <!-- Error Card -->
        <div class="error-card glass-card">
            <!-- Error Icon -->
            <div class="error-icon-wrapper">
                <div class="icon-glow"></div>
                <svg class="error-icon" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
                </svg>
            </div>

            <!-- Error Content -->
            <h1 class="error-title">Accès restreint</h1>
            <p class="error-description">
                Votre profil actuel ne dispose pas des autorisations nécessaires pour consulter ces données agricoles sensibles.
            </p>

            <!-- Back Button -->
            <button 
                @click="router.back()"
                class="cyber-button"
            >
                <svg class="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                Retour au tableau de bord
            </button>
        </div>

        <!-- Decorative Elements -->
        <div class="glow-orb orb-1"></div>
        <div class="glow-orb orb-2"></div>
    </div>
</template>

<style scoped>
/* Unauthorized Container */
.unauthorized-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding: var(--gap-xl);
}

/* Immersive Agriculture Background */
.immersive-background {
    position: fixed;
    inset: 0;
    z-index: 0;
    background-image: url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
}

.data-grid-overlay {
    position: absolute;
    inset: 0;
    background-image: 
        linear-gradient(rgba(239, 68, 68, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(239, 68, 68, 0.02) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: dataStream 20s linear infinite;
}

.gradient-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        180deg,
        rgba(var(--bg-rgb, 255, 255, 255), 0.95) 0%,
        rgba(var(--bg-rgb, 255, 255, 255), 0.92) 50%,
        rgba(var(--bg-rgb, 255, 255, 255), 0.95) 100%
    );
}

.dark .gradient-overlay {
    background: linear-gradient(
        180deg,
        rgba(10, 15, 20, 0.95) 0%,
        rgba(10, 15, 20, 0.92) 50%,
        rgba(10, 15, 20, 0.95) 100%
    );
}

/* Error Card */
.error-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 480px;
    padding: var(--gap-xl);
    text-align: center;
    animation: fadeInUp 0.6s ease-out;
}

.glass-card {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: var(--border-thin) solid var(--glass-border);
    border-radius: var(--radius-xl);
    box-shadow: var(--glass-shadow);
}

/* Error Icon */
.error-icon-wrapper {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto var(--gap-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-full);
    background: rgba(239, 68, 68, 0.1);
    border: var(--border-thin) solid rgba(239, 68, 68, 0.3);
}

.icon-glow {
    position: absolute;
    inset: 0;
    border-radius: var(--radius-full);
    background: radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%);
    animation: pulse-glow 2s ease-in-out infinite;
}

.error-icon {
    width: 40px;
    height: 40px;
    color: var(--danger);
    position: relative;
    z-index: 1;
    animation: shake-icon 0.5s ease-out 0.3s both;
}

/* Error Content */
.error-title {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--gap-sm);
    animation: fadeInUp 0.6s ease-out 0.1s both;
}

.error-description {
    font-size: 15px;
    line-height: 1.6;
    color: var(--text-secondary);
    margin-bottom: var(--gap-lg);
    padding: 0 var(--gap-md);
    animation: fadeInUp 0.6s ease-out 0.2s both;
}

/* Cyber Button */
.cyber-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-sm);
    padding: var(--gap-sm) var(--gap-lg);
    font-family: var(--font-heading);
    font-size: 14px;
    font-weight: 600;
    color: var(--text-inverse);
    background: var(--gradient-primary);
    border: var(--border-thin) solid transparent;
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: var(--transition-base);
    box-shadow: var(--glow-primary);
    animation: fadeInUp 0.6s ease-out 0.3s both;
    position: relative;
    overflow: hidden;
}

.cyber-button::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
    );
    transform: translateX(-100%);
    transition: transform 0.5s ease;
}

.cyber-button:hover {
    transform: translateY(-2px);
    box-shadow: var(--glow-primary), 0 8px 20px rgba(10, 77, 60, 0.3);
}

.cyber-button:hover::before {
    transform: translateX(100%);
}

.cyber-button:active {
    transform: translateY(0);
}

.button-icon {
    width: 18px;
    height: 18px;
    transition: transform var(--transition-base);
}

.cyber-button:hover .button-icon {
    transform: translateX(-3px);
}

/* Decorative Glow Orbs */
.glow-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
}

.orb-1 {
    width: 300px;
    height: 300px;
    background: rgba(239, 68, 68, 0.08);
    top: 10%;
    left: 10%;
    animation: float-orb 15s ease-in-out infinite;
}

.orb-2 {
    width: 250px;
    height: 250px;
    background: rgba(10, 212, 170, 0.06);
    bottom: 10%;
    right: 10%;
    animation: float-orb 12s ease-in-out infinite reverse;
}

/* Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes dataStream {
    0% { background-position: 0 0; }
    100% { background-position: 50px 50px; }
}

@keyframes pulse-glow {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.8; }
}

@keyframes shake-icon {
    0%, 100% { transform: rotate(0); }
    25% { transform: rotate(-10deg); }
    75% { transform: rotate(10deg); }
}

@keyframes float-orb {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(30px, -30px); }
}

/* Responsive */
@media (max-width: 480px) {
    .unauthorized-container {
        padding: var(--gap-md);
    }
    
    .error-card {
        padding: var(--gap-lg);
    }
    
    .error-title {
        font-size: 24px;
    }
    
    .error-description {
        font-size: 14px;
        padding: 0;
    }
    
    .error-icon-wrapper {
        width: 64px;
        height: 64px;
    }
    
    .error-icon {
        width: 32px;
        height: 32px;
    }
}
</style>