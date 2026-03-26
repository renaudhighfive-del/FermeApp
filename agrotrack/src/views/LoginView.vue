<template>
  <div class="login-container">
    <!-- Immersive Agriculture Background -->
    <div class="immersive-background">
      <div class="data-grid-overlay"></div>
      <div class="gradient-overlay"></div>
    </div>

    <!-- Login Card -->
    <div class="login-wrapper">
      <!-- Logo Section -->
      <div class="logo-section">
        <div class="brand-logo">
          <div class="logo-core"></div>
          <div class="logo-ring"></div>
        </div>
        <h1 class="brand-title holographic-text">AgroTrack</h1>
        <p class="brand-subtitle">Gestion de campagnes agricoles</p>
      </div>

      <!-- Login Card Glass -->
      <div class="login-card glass-card">
        <div class="card-header">
          <h2 class="card-title">Connexion</h2>
          <p class="card-subtitle">Entrez vos identifiants pour accéder à la plateforme</p>
        </div>

        <!-- Email Field -->
        <div class="form-group">
          <label class="form-label">Adresse email</label>
          <div class="input-wrapper">
            <svg class="input-icon" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <input
              class="form-input cyber-input"
              type="email"
              v-model="email"
              placeholder="agro@track.com"
              @keydown.enter="soumettre"
            />
          </div>
        </div>

        <!-- Password Field -->
        <div class="form-group">
          <label class="form-label">Mot de passe</label>
          <div class="input-wrapper">
            <svg class="input-icon" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <input
              class="form-input cyber-input"
              type="password"
              v-model="password"
              placeholder="••••••••"
              @keydown.enter="soumettre"
            />
          </div>
        </div>

        <!-- Error Alert -->
        <div v-if="error" class="error-alert">
          <svg class="error-icon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ error }}</span>
        </div>

        <!-- Login Button -->
        <button
          class="cyber-button primary"
          :disabled="chargement"
          @click="soumettre"
        >
          <span v-if="chargement" class="loading-spinner"></span>
          <span v-else>Se connecter</span>
        </button>
      </div>

      <!-- Footer -->
      <div class="login-footer">
        <p>Digital Twin OS v2.0</p>
      </div>
    </div>
  </div>
</template>

<script setup>
    import { ref }          from 'vue'
    import { useRouter }    from 'vue-router'
    import { useAuthStore } from '@/stores/auth.js'

    const router     = useRouter()
    const auth       = useAuthStore()
    const email      = ref('')
    const password   = ref('')
    const error      = ref('')
    const chargement = ref(false)

    const dashboardParRole = {
        admin:  '/admin/dashboard',
        gerant: '/gerant/dashboard',
        agent:  '/agent/dashboard',
    }

    async function soumettre() {
        error.value = '';
        if (!email.value || !password.value) {
            error.value = 'Veuillez remplir tous les champs.'
            return
        }
        chargement.value = true
        try {
            const role = await auth.login(email.value, password.value)
            router.push(dashboardParRole[role] || '/login')
        } catch (err) { error.value = err.response?.data?.message || 'Identifiants incorrects'
        } finally { chargement.value = false }
    }
</script>

<style scoped>
/* Login Container */
.login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
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
        linear-gradient(rgba(0, 212, 170, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 212, 170, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: dataStream 20s linear infinite;
}

.gradient-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        180deg,
        rgba(var(--bg-rgb, 255, 255, 255), 0.5) 0%,
        rgba(var(--bg-rgb, 255, 255, 255), 0.2) 50%,
        rgba(var(--bg-rgb, 255, 255, 255), 0.5) 100%
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

/* Login Wrapper */
.login-wrapper {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 440px;
    padding: var(--gap-xl);
    animation: fadeInUp 0.6s ease-out;
}

/* Logo Section */
.logo-section {
    text-align: center;
    margin-bottom: var(--gap-xl);
}

.brand-logo {
    position: relative;
    width: 60px;
    height: 60px;
    margin: 0 auto var(--gap-md);
}

.logo-core {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 28px;
    height: 28px;
    background: var(--gradient-primary);
    border-radius: 50%;
    box-shadow: var(--glow-primary);
    animation: pulse 2s ease-in-out infinite;
}

.logo-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 52px;
    height: 52px;
    border: 2px solid var(--accent);
    border-radius: 50%;
    opacity: 0.6;
    animation: rotate 10s linear infinite;
}

.brand-title {
    font-family: var(--font-display);
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: var(--gap-xs);
}

.holographic-text {
    background: var(--gradient-hologram);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: holographic 3s ease infinite;
}

.brand-subtitle {
    font-family: var(--font-heading);
    font-size: 13px;
    color: var(--text-tertiary);
    letter-spacing: 0.05em;
}

/* Login Card */
.login-card {
    padding: var(--gap-xl);
    animation: fadeInUp 0.6s ease-out 0.1s both;
}

.glass-card {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: var(--border-thin) solid var(--glass-border);
    border-radius: var(--radius-xl);
    box-shadow: var(--glass-shadow);
}

.card-header {
    margin-bottom: var(--gap-lg);
}

.card-title {
    font-family: var(--font-display);
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--gap-xs);
}

.card-subtitle {
    font-size: 13px;
    color: var(--text-tertiary);
}

/* Form Elements */
.form-group {
    margin-bottom: var(--gap-md);
}

.form-label {
    display: block;
    font-family: var(--font-heading);
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-secondary);
    margin-bottom: var(--gap-xs);
}

.input-wrapper {
    position: relative;
}

.input-icon {
    position: absolute;
    left: var(--gap-sm);
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-tertiary);
    pointer-events: none;
    transition: var(--transition-base);
}

.cyber-input {
    width: 80%;
    height: 48px;
    padding: 0 var(--gap-md) 0 calc(var(--gap-md) + 24px);
    background: rgba(var(--bg-rgb, 250, 248, 245), 0.5);
    border: var(--border-thin) solid var(--glass-border);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: 14px;
    transition: var(--transition-base);
}

.cyber-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: var(--glow-primary);
}

.cyber-input:focus + .input-icon,
.input-wrapper:focus-within .input-icon {
    color: var(--primary);
}

/* Error Alert */
.error-alert {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
    background: rgba(239, 68, 68, 0.1);
    border: var(--border-thin) solid rgba(239, 68, 68, 0.3);
    border-radius: var(--radius-md);
    padding: var(--gap-sm) var(--gap-md);
    font-size: 13px;
    color: var(--danger);
    margin-bottom: var(--gap-md);
    animation: shake 0.5s ease-out;
}

.error-icon {
    flex-shrink: 0;
}

/* Cyber Button */
.cyber-button {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-sm);
    font-family: var(--font-heading);
    font-size: 14px;
    font-weight: 600;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition-base);
    border: var(--border-thin) solid transparent;
}

.cyber-button.primary {
    background: var(--gradient-primary);
    color: var(--text-inverse);
    box-shadow: var(--glow-primary);
}

.cyber-button.primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--glow-primary), 0 8px 20px rgba(10, 77, 60, 0.3);
}

.cyber-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Loading Spinner */
.loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

/* Login Footer */
.login-footer {
    text-align: center;
    margin-top: var(--gap-lg);
    font-size: 11px;
    color: var(--text-tertiary);
    letter-spacing: 0.1em;
    text-transform: uppercase;
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

@keyframes holographic {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

@keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
}

@keyframes rotate {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes dataStream {
    0% { background-position: 0 0; }
    100% { background-position: 50px 50px; }
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

/* Responsive */
@media (max-width: 480px) {
    .login-wrapper {
        padding: var(--gap-md);
    }
    
    .login-card {
        padding: var(--gap-lg);
    }
    
    .brand-title {
        font-size: 28px;
    }
}
</style>