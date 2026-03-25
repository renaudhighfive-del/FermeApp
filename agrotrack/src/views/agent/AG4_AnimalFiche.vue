<template>
<div v-if="loading" class="text-center py-20">Chargement...</div>
<div v-else-if="!animal" class="text-center py-20">Animal non trouvé</div>
<div v-else>
  <!-- Header animal -->
  <div class="animal-header">
    <div>
      <div class="animal-id">#{{ animal.idNumber }}</div>
      <div class="animal-sub">{{ animal.campaign?.name || 'Sans campagne' }} · {{ animal.location || 'Sans localisation' }}</div>
      <div style="margin-top:10px">
        <span class="badge" style="background:rgba(255,255,255,0.2);color:#fff">{{ animal.healthStatus }}</span>
      </div>
    </div>
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.5">
      <rect x="2" y="2" width="5" height="5" rx="1"/><rect x="17" y="2" width="5" height="5" rx="1"/>
      <rect x="2" y="17" width="5" height="5" rx="1"/>
      <path d="M10 2h1v1h-1zm2 0h1v1h-1zM2 10h1v1H2zm0 2h1v1H2zM14 17h1v1h-1zm2 0h1v1h-1zm0 2h1v1h-1zM10 14h1v1h-1zm4 0h1v1h-1z"/>
    </svg>
  </div>

  <!-- Mini infos -->
  <div class="animal-mini-grid mb-gap">
    <div class="animal-mini-card">
      <div class="animal-mini-icon"><svg width="20" height="20" fill="none" stroke="var(--soft)" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
      <div class="animal-mini-label">Date naissance</div>
      <div class="animal-mini-val">{{ formatDate(animal.dateOfBirth) }}</div>
    </div>
    <div class="animal-mini-card">
      <div class="animal-mini-icon"><svg width="20" height="20" fill="none" stroke="var(--soft)" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
      <div class="animal-mini-label">Âge</div>
      <div class="animal-mini-val">{{ age }}</div>
    </div>
    <div class="animal-mini-card">
      <div class="animal-mini-icon"><svg width="20" height="20" fill="none" stroke="var(--soft)" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 6v6h4"/></svg></div>
      <div class="animal-mini-label">Poids actuel</div>
      <div class="animal-mini-val">{{ animal.weight || '?' }} kg</div>
    </div>
    <div class="animal-mini-card">
      <div class="animal-mini-icon"><svg width="20" height="20" fill="none" stroke="var(--success)" stroke-width="1.5" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
      <div class="animal-mini-label">Vaccins</div>
      <div class="animal-mini-val" style="color:var(--success)">{{ animal.vaccinations?.length || 0 }} reçus</div>
    </div>
  </div>

  <!-- Courbe poids (Statique pour le moment car pas d'historique de poids structuré dans le modèle Animal) -->
  <div class="card mb-gap">
    <div class="card-title">Évolution du poids (Simulation)</div>
    <div class="chart-legend">
      <div class="chart-legend-item"><div class="legend-line" style="background:var(--pis)"></div>Poids réel</div>
      <div class="chart-legend-item"><div class="legend-line" style="background:var(--accent);border-top:2px dashed var(--accent);height:0"></div>Poids de référence</div>
    </div>
    <svg width="100%" height="140" viewBox="0 0 520 140">
      <defs>
        <linearGradient id="normalZone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2D6A4F" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="#2D6A4F" stop-opacity="0.05"/>
        </linearGradient>
      </defs>
      <path d="M0,60 L520,30 L520,50 L0,80 Z" fill="url(#normalZone)"/>
      <path d="M0,70 L60,65 L120,58 L180,52 L240,46 L300,40 L360,35 L420,30 L520,25" fill="none" stroke="#F2B705" stroke-width="1.5" stroke-dasharray="5,4"/>
      <path d="M0,115 L60,105 L120,92 L180,80 L240,68 L300,58 L360,50 L420,44 L520,38" fill="none" stroke="#1A6B8A" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="0"   cy="115" r="4" fill="#1A6B8A"/><text x="0"   y="125" font-size="8" fill="#7A6652" text-anchor="middle">J1</text>
      <circle cx="120" cy="92"  r="4" fill="#1A6B8A"/><text x="120" y="125" font-size="8" fill="#7A6652" text-anchor="middle">J7</text>
      <circle cx="240" cy="68"  r="4" fill="#1A6B8A"/><text x="240" y="125" font-size="8" fill="#7A6652" text-anchor="middle">J14</text>
      <circle cx="420" cy="44"  r="4" fill="#1A6B8A"/><text x="420" y="125" font-size="8" fill="#7A6652" text-anchor="middle">J18</text>
      <text x="525" y="40"  font-size="8" fill="#7A6652">1.4kg</text>
      <text x="525" y="70"  font-size="8" fill="#7A6652">1.0kg</text>
      <text x="525" y="100" font-size="8" fill="#7A6652">0.5kg</text>
      <text x="525" y="120" font-size="8" fill="#7A6652">0.1kg</text>
    </svg>
  </div>

  <!-- Timeline historique -->
  <div class="card mb-gap">
    <div class="card-title">Historique des événements</div>
    <div class="timeline">
      <div v-for="(v, idx) in animal.vaccinations" :key="idx" class="tl-item">
        <div class="tl-dot tl-dot-blue"></div>
        <div class="tl-date">{{ formatDate(v.date) }}</div>
        <div class="tl-title">Vaccin {{ v.vaccine }}</div>
        <div class="tl-desc">Réalisé le {{ formatDate(v.date) }} · Prochain rappel : {{ v.nextDue ? formatDate(v.nextDue) : 'Aucun' }}</div>
      </div>
      <div v-for="(t, idx) in animal.treatmentHistory" :key="idx" class="tl-item">
        <div class="tl-dot tl-dot-orange"></div>
        <div class="tl-date">{{ formatDate(t.date) }}</div>
        <div class="tl-title">{{ t.treatment }}</div>
        <div class="tl-desc">Raison : {{ t.reason }} · Résultat : {{ t.outcome }}</div>
      </div>
      <div class="tl-item">
        <div class="tl-dot tl-dot-gray"></div>
        <div class="tl-date">{{ formatDate(animal.dateOfBirth) }}</div>
        <div class="tl-title">Éclosion / Naissance</div>
        <div class="tl-desc">Animal enregistré dans la campagne</div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { animalService } from '../../services/api'

const route = useRoute()
const animal = ref(null)
const loading = ref(true)

const age = computed(() => {
  if (!animal.value?.dateOfBirth) return '?'
  const diff = new Date() - new Date(animal.value.dateOfBirth)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  return `${days} jours`
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR')
}

const fetchAnimal = async () => {
  loading.value = true
  try {
    const res = await animalService.getById(route.params.id)
    animal.value = res.data
  } catch (error) {
    console.error('Error fetching animal:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchAnimal)
</script>
