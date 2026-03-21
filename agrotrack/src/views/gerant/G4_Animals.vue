<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div><h1 class="page-title">Gestion Animaux</h1><p class="page-subtitle">Campagne Mars 2026 · 480 animaux</p></div>
      <div class="page-actions"><button class="btn btn-primary"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Ajouter animal</button></div>
    </div>
  </div>
  <div class="filters-bar">
    <div class="search-wrap"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A6652" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input class="search-input" placeholder="Rechercher par ID..."/></div>
    <select class="filter-select"><option>Tous les lots</option><option>Lot A</option><option>Lot B</option><option>Lot C</option></select>
    <select class="filter-select"><option>Tous statuts santé</option><option>Sain</option><option>Anomalie</option><option>Observation</option></select>
  </div>
  <div class="card">
    <div class="table-wrap">
      <table class="table">
        <thead><tr><th>ID</th><th>Lot</th><th>Poids actuel</th><th>Santé</th><th>Vaccins</th><th>QR Code</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-for="a in animals" :key="a.id">
            <td class="fw-600" style="color:var(--primary)">{{ a.id }}</td>
            <td class="text-soft text-sm">{{ a.lot }}</td>
            <td>{{ a.weight }}</td>
            <td><span class="badge" :class="a.healthClass">{{ a.health }}</span></td>
            <td>{{ a.vaccines }}</td>
            <td><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--soft)" stroke-width="1.5"><rect x="2" y="2" width="5" height="5"/><rect x="17" y="2" width="5" height="5"/><rect x="2" y="17" width="5" height="5"/><path d="M10 2h1v1h-1zm2 0h1v1h-1z"/></svg></td>
            <td><div class="table-actions"><RouterLink :to="'/agent/animal/'+a.id.replace('#','')" class="btn btn-outline btn-sm">Voir fiche</RouterLink></div></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination"><button class="page-btn active">1</button><button class="page-btn">2</button><button class="page-btn">3</button><button class="page-btn">›</button></div>
  </div>
</div>
</template>
<script setup>
const animals = [
  { id:'#VOL-001', lot:'Lot A', weight:'1.35 kg', health:'Sain',        healthClass:'badge-sain',        vaccines:'3/4' },
  { id:'#VOL-002', lot:'Lot A', weight:'0.95 kg', health:'Anomalie',    healthClass:'badge-anomalie',     vaccines:'2/4' },
  { id:'#VOL-003', lot:'Lot B', weight:'1.28 kg', health:'Sain',        healthClass:'badge-sain',        vaccines:'3/4' },
  { id:'#VOL-047', lot:'Lot A', weight:'1.42 kg', health:'Sain',        healthClass:'badge-sain',        vaccines:'4/4' },
  { id:'#VOL-088', lot:'Lot C', weight:'1.10 kg', health:'Observation', healthClass:'badge-observation',  vaccines:'2/4' },
  { id:'#VOL-120', lot:'Lot B', weight:'1.38 kg', health:'Sain',        healthClass:'badge-sain',        vaccines:'3/4' },
]
</script>
