<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div><h1 class="page-title">Mes Alertes</h1><p class="page-subtitle">Alertes assignées à Paul Ahoua</p></div>
    </div>
  </div>
  <div class="filters-bar">
    <div class="filter-group">
      <button class="filter-btn active">Toutes</button>
      <button class="filter-btn">Urgentes</button>
      <button class="filter-btn">Non lues</button>
    </div>
  </div>
  <div v-for="a in alerts" :key="a.id" class="alert-item mb-gap" :class="a.level">
    <div class="flex items-start gap-12">
      <svg width="18" height="18" fill="none" :stroke="a.iconColor" stroke-width="1.5" viewBox="0 0 24 24" v-html="a.icon" style="flex-shrink:0;margin-top:2px"/>
      <div style="flex:1">
        <div class="alert-item-campaign">{{ a.campaign }}</div>
        <div class="alert-item-title">{{ a.title }}</div>
        <div class="alert-item-desc">{{ a.desc }}</div>
        <div class="alert-item-footer">
          <span class="text-xs text-soft">{{ a.date }}</span>
          <button class="btn btn-primary btn-sm">Traiter</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script setup>
const alerts = [
  { id:1, level:'alert-item-danger', campaign:'Campagne Mars 2026', title:'Vaccination Newcastle — Lot C en retard', desc:'J+14 — À effectuer impérativement aujourd\'hui', date:'Aujourd\'hui 06:00', iconColor:'#D62828', icon:'<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/>' },
  { id:2, level:'alert-item-warning', campaign:'Campagne Mars 2026', title:'Pesée Lot A non effectuée', desc:'Prévue à 08h00 — En retard de 2h', date:'Aujourd\'hui 10:00', iconColor:'#E07B39', icon:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' },
  { id:3, level:'alert-item-info', campaign:'Campagne Mars 2026', title:'Rapport de pesée hebdomadaire dû', desc:'Rapport semaine du 13 au 19 mars à soumettre', date:'Aujourd\'hui', iconColor:'#B8860B', icon:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>' },
]
</script>
