<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div><h1 class="page-title">Mes Campagnes</h1><p class="page-subtitle">Gérez vos campagnes agricoles</p></div>
      <div class="page-actions">
        <button class="btn btn-primary" @click="showModal=true">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nouvelle campagne
        </button>
      </div>
    </div>
  </div>
  <div class="filters-bar">
    <div class="filter-group">
      <button class="filter-btn active">Toutes</button>
      <button class="filter-btn">En cours</button>
      <button class="filter-btn">Terminées</button>
      <button class="filter-btn">En préparation</button>
    </div>
    <select class="filter-select"><option>Tous départements</option><option>Volaille</option><option>Bétail</option><option>Pisciculture</option></select>
  </div>
  <div class="campaign-cards">
    <div class="campaign-card" v-for="c in campaigns" :key="c.id">
      <div class="campaign-card-header">
        <div>
          <div class="campaign-card-name">{{ c.name }}</div>
          <div class="flex gap-8 mb-12"><span class="badge" :class="c.deptClass">{{ c.dept }}</span><span class="badge" :class="c.statusClass">{{ c.status }}</span></div>
        </div>
      </div>
      <div class="campaign-card-meta"><svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Démarré le {{ c.start }} · <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>{{ c.days }} jours restants</div>
      <div class="progress-wrap">
        <div class="progress-header"><span>Animaux</span><span>{{ c.animals }}</span></div>
        <div class="progress-track"><div class="progress-fill fill-green" :style="{width:c.animalPct+'%'}"></div></div>
      </div>
      <div class="progress-wrap">
        <div class="progress-header"><span>Budget</span><span>{{ c.budget }}</span></div>
        <div class="progress-track"><div class="progress-fill fill-yellow" :style="{width:c.budgetPct+'%'}"></div></div>
      </div>
      <div class="campaign-card-actions">
        <RouterLink :to="'/gerant/campaigns/'+c.id" class="btn btn-primary btn-sm">Voir détail</RouterLink>
        <button class="btn btn-outline btn-sm">Modifier</button>
      </div>
    </div>
  </div>
  <ModalNewCampaign :open="showModal" @close="showModal=false"/>
</div>
</template>
<script setup>
import { ref } from 'vue'
import ModalNewCampaign from '@/components/common/ModalNewCampaign.vue'
const showModal = ref(false)
const campaigns = [
  { id:1, name:'Campagne Mars 2026', dept:'Volaille', deptClass:'badge-vol', status:'En cours', statusClass:'badge-encours', start:'01/03/2026', days:'27', animals:'480/500', animalPct:96, budget:'620k/850k FCFA', budgetPct:73 },
  { id:2, name:'Lot Bœufs Fév', dept:'Bétail', deptClass:'badge-bet', status:'Terminée', statusClass:'badge-terminee', start:'01/02/2026', days:'0', animals:'43/45', animalPct:96, budget:'2.4M/2.4M FCFA', budgetPct:100 },
  { id:3, name:'Bassin Tilapia', dept:'Pisciculture', deptClass:'badge-pis', status:'En préparation', statusClass:'badge-prep', start:'25/03/2026', days:'45', animals:'0/1000', animalPct:0, budget:'0/320k FCFA', budgetPct:0 },
]
</script>
