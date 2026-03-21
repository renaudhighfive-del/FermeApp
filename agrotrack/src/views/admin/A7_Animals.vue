<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div><h1 class="page-title">Gestion Animaux</h1><p class="page-subtitle">4 280 animaux dans toutes les campagnes</p></div>
      <div class="page-actions">
        <button class="btn btn-primary"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Ajouter animal</button>
      </div>
    </div>
  </div>
  <div class="filters-bar">
    <div class="search-wrap">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A6652" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input class="search-input" placeholder="Rechercher par ID, lot..."/>
    </div>
    <select class="filter-select"><option>Tous départements</option><option>Volaille</option><option>Bétail</option><option>Pisciculture</option></select>
    <select class="filter-select"><option>Toutes campagnes</option><option>Campagne Mars 2026</option><option>Bassin Tilapia</option></select>
    <select class="filter-select"><option>Tous statuts santé</option><option>Sain</option><option>Anomalie</option><option>Observation</option></select>
  </div>
  <div class="card">
    <div class="table-wrap">
      <table class="table">
        <thead><tr><th>ID</th><th>Campagne</th><th>Lot</th><th>Poids</th><th>Santé</th><th>Vaccins</th><th>Date éclosion</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-for="a in animals" :key="a.id">
            <td class="fw-600" style="color:var(--primary)">{{ a.id }}</td>
            <td class="text-sm">{{ a.campaign }}</td>
            <td class="text-soft text-sm">{{ a.lot }}</td>
            <td>{{ a.weight }}</td>
            <td><span class="badge" :class="a.healthClass">{{ a.health }}</span></td>
            <td>{{ a.vaccines }}</td>
            <td class="text-soft text-sm">{{ a.eclosion }}</td>
            <td><div class="table-actions">
              <RouterLink :to="'/agent/animal/'+a.id.replace('#','')" class="btn btn-outline btn-sm">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </RouterLink>
            </div></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination">
      <button class="page-btn">‹</button>
      <button class="page-btn active">1</button>
      <button class="page-btn">2</button>
      <button class="page-btn">3</button>
      <button class="page-btn">›</button>
    </div>
  </div>
</div>
</template>
<script setup>
const animals = [
  { id:'#VOL-001', campaign:'Camp. Mars 2026', lot:'Lot A', weight:'1.35 kg', health:'Sain',       healthClass:'badge-sain',        vaccines:'3/4', eclosion:'01/03/2026' },
  { id:'#VOL-002', campaign:'Camp. Mars 2026', lot:'Lot A', weight:'0.95 kg', health:'Anomalie',   healthClass:'badge-anomalie',     vaccines:'2/4', eclosion:'01/03/2026' },
  { id:'#VOL-003', campaign:'Camp. Mars 2026', lot:'Lot B', weight:'1.28 kg', health:'Sain',       healthClass:'badge-sain',        vaccines:'3/4', eclosion:'01/03/2026' },
  { id:'#VOL-047', campaign:'Camp. Mars 2026', lot:'Lot A', weight:'1.42 kg', health:'Sain',       healthClass:'badge-sain',        vaccines:'4/4', eclosion:'01/03/2026' },
  { id:'#BET-001', campaign:'Lot Bœufs Fév',  lot:'Lot A', weight:'245 kg',  health:'Sain',       healthClass:'badge-sain',        vaccines:'2/2', eclosion:'15/12/2025' },
  { id:'#PIS-012', campaign:'Carpes Bassin 2', lot:'Bassin', weight:'0.4 kg', health:'Observation', healthClass:'badge-observation', vaccines:'0/1', eclosion:'01/03/2026' },
]
</script>
