<template>
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg)">
    <div style="width:420px">

      <!-- Logo -->
      <div style="text-align:center;margin-bottom:32px">
        <div style="display:flex;align-items:center;justify-content:center;gap:10px;font-family:var(--font-display);font-size:28px;color:var(--primary);margin-bottom:8px">
          <svg width="30" height="30" fill="none" stroke="var(--accent)" stroke-width="1.5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 6c-2.5 1-4 3.5-4 5.5 0 2.5 1.8 4.5 4 4.5s4-2 4-4.5c0-2-1.5-4.5-4-5.5z"/>
            <path d="M12 2v3M8.5 3.5l1.5 2.5M15.5 3.5l-1.5 2.5"/>
          </svg>
          AgroTrack
        </div>
        <p style="color:var(--soft);font-size:14px">Gestion de campagnes agricoles</p>
      </div>

      <div class="card" style="padding:32px">
        <h2 style="font-size:22px;margin-bottom:6px;font-family:var(--font-display)">Connexion</h2>
        <p style="color:var(--soft);font-size:13px;margin-bottom:24px">
          Entrez vos identifiants pour accéder à la plateforme
        </p>

        <!-- Email -->
        <div class="form-group">
          <label class="form-label">Adresse email</label>
          <input
            class="form-input"
            type="email"
            v-model="email"
            placeholder="vous@agrotrack.com"
            @keydown.enter="soumettre"
          />
        </div>

        <!-- Mot de passe -->
        <div class="form-group">
          <label class="form-label">Mot de passe</label>
          <input
            class="form-input"
            type="password"
            v-model="password"
            placeholder="••••••••"
            @keydown.enter="soumettre"
          />
        </div>

        <!-- Erreur -->
        <div
          v-if="error"
          style="background:#FDECEA;border:1px solid #F5C6CB;border-radius:8px;padding:10px 14px;font-size:13px;color:var(--danger);margin-bottom:16px"
        >
          {{ error }}
        </div>

        <!-- Bouton -->
        <button
          class="btn btn-primary btn-full"
          style="height:46px;margin-bottom:16px"
          :disabled="chargement"
          @click="soumettre"
        >
          <span v-if="chargement">Connexion...</span>
          <span v-else>Se connecter</span>
        </button>

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
  error.value = ''

  if (!email.value || !password.value) {
    error.value = 'Veuillez remplir tous les champs.'
    return
  }

  chargement.value = true
  try {
    const role = await auth.login(email.value, password.value)
    router.push(dashboardParRole[role] || '/login')
  } catch (err) {
    error.value = err.response?.data?.message || 'Identifiants incorrects'
  } finally {
    chargement.value = false
  }
}
</script>