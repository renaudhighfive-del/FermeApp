<template>
<div>
  <div class="page-header">
    <h1 class="page-title">Mes tâches</h1>
    <p class="page-subtitle">Mardi 19 Mars 2026 · Campagne Mars 2026</p>
  </div>

  <!-- Progression globale -->
  <div class="card mb-gap">
    <div class="flex items-center justify-between mb-12">
      <div class="card-title" style="margin-bottom:0">Progression du jour</div>
      <span style="font-size:13px;font-weight:700;color:var(--primary)">1 / 3 tâches</span>
    </div>
    <div class="progress-wrap">
      <div class="progress-track" style="height:12px">
        <div class="progress-fill fill-green" style="width:33%"></div>
      </div>
    </div>
    <p class="text-soft text-sm" style="margin-top:8px">2 tâches restantes · Prochaine : Distribution aliments à 12h00</p>
  </div>

  <!-- Liste tâches -->
  <div class="task-list-item" v-for="t in tasks" :key="t.id">
    <div class="task-time">{{ t.time }}</div>
    <div class="task-type-icon" :style="{background:t.iconBg}">
      <svg width="18" height="18" fill="none" :stroke="t.iconColor" stroke-width="1.5" viewBox="0 0 24 24" v-html="t.icon"/>
    </div>
    <div class="task-info">
      <div class="task-name">{{ t.name }}</div>
      <div class="task-meta">{{ t.lot }} · {{ t.desc }}</div>
    </div>
    <span class="badge" :class="t.statusClass">{{ t.status }}</span>
    <button v-if="t.status !== 'Terminé'" class="btn btn-primary btn-sm" @click="markDone(t)">Marquer terminé</button>
    <button v-else class="btn btn-outline btn-sm" disabled style="opacity:0.5">
      <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      Terminé
    </button>
  </div>
</div>
</template>

<script setup>
import { ref } from 'vue'
const tasks = ref([
  { id:1, time:'08h00', name:'Pesée Lot A', lot:'Lot A', desc:'50 animaux à peser', status:'Terminé',  statusClass:'badge-termine',  icon:'<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 6v6h4"/>',  iconBg:'#D4EDDA', iconColor:'#2D6A4F' },
  { id:2, time:'12h00', name:'Distribution aliments', lot:'Lot A+B+C', desc:'15kg granulés croissance', status:'À faire', statusClass:'badge-afaire', icon:'<path d="M3 11l19-9-9 19-2-8-8-2z"/>',  iconBg:'#FFF7ED', iconColor:'#E07B39' },
  { id:3, time:'15h00', name:'Vaccination Newcastle', lot:'Lot C', desc:'480 doses — URGENT', status:'À faire', statusClass:'badge-urgent', icon:'<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',  iconBg:'#FDECEA', iconColor:'#D62828' },
])
function markDone(t) { t.status = 'Terminé'; t.statusClass = 'badge-termine' }
</script>
