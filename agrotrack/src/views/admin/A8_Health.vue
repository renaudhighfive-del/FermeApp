<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div><h1 class="page-title">Santé & Alertes</h1><p class="page-subtitle">Vue globale de toutes les alertes actives</p></div>
      <div class="page-actions"><button class="btn btn-primary btn-sm">Tout résoudre</button></div>
    </div>
  </div>
  <div class="alerts-grid">
    <div>
      <div class="alerts-col-title" style="color:var(--danger)">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
        Urgentes (3)
      </div>
      <div class="alert-item alert-item-danger" v-for="a in urgent" :key="a.id">
        <div class="alert-item-campaign">{{ a.campaign }}</div>
        <div class="alert-item-title">{{ a.title }}</div>
        <div class="alert-item-desc">{{ a.desc }}</div>
        <div class="alert-item-footer">
          <span class="text-xs text-soft">{{ a.date }}</span>
          <div class="flex gap-8">
            <button class="btn btn-outline btn-sm">Voir</button>
            <button class="btn btn-danger btn-sm">Résoudre</button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="alerts-col-title" style="color:var(--warn)">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Moyennes (4)
      </div>
      <div class="alert-item alert-item-warning" v-for="a in warning" :key="a.id">
        <div class="alert-item-campaign">{{ a.campaign }}</div>
        <div class="alert-item-title">{{ a.title }}</div>
        <div class="alert-item-desc">{{ a.desc }}</div>
        <div class="alert-item-footer">
          <span class="text-xs text-soft">{{ a.date }}</span>
          <div class="flex gap-8">
            <button class="btn btn-outline btn-sm">Voir</button>
            <button class="btn btn-sm" style="background:#FFF7ED;color:var(--warn);border:1px solid var(--warn)">Résoudre</button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="alerts-col-title" style="color:#B8860B">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        Informations (2)
      </div>
      <div class="alert-item alert-item-info" v-for="a in info" :key="a.id">
        <div class="alert-item-campaign">{{ a.campaign }}</div>
        <div class="alert-item-title">{{ a.title }}</div>
        <div class="alert-item-desc">{{ a.desc }}</div>
        <div class="alert-item-footer">
          <span class="text-xs text-soft">{{ a.date }}</span>
          <button class="btn btn-outline btn-sm">Voir</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script setup>
const urgent = [
  { id:1, campaign:'Camp. Mars 2026', title:'Mortalité élevée Lot B', desc:'15 pertes en 24h — cause inconnue', date:'Aujourd\'hui 06:30' },
  { id:2, campaign:'Bœufs Lot 2', title:'Animal blessé #BET-018', desc:'Boiterie sévère — consultation requise', date:'Aujourd\'hui 08:15' },
  { id:3, campaign:'Camp. Mars 2026', title:'Épizootie suspectée', desc:'Symptômes respiratoires Lot A', date:'Hier 22:00' },
]
const warning = [
  { id:4, campaign:'Camp. Mars 2026', title:'Stock granulés critique', desc:'20kg restants — seuil 50kg', date:'Aujourd\'hui 07:00' },
  { id:5, campaign:'Camp. Mars 2026', title:'Vaccination Newcastle J+14', desc:'Lot C en retard de 2 jours', date:'Hier 08:00' },
  { id:6, campaign:'Carpes Bassin 2', title:'pH bassin anormal', desc:'pH 5.2 — optimal: 6.5-8.5', date:'Hier 14:30' },
  { id:7, campaign:'Bœufs Lot 2', title:'Poids moyen insuffisant', desc:'Croissance 15% en dessous', date:'Il y a 2 jours' },
]
const info = [
  { id:8, campaign:'Bassin Tilapia', title:'Préparation bassin J-5', desc:'Mise en eau prévue le 25/03', date:'Aujourd\'hui' },
  { id:9, campaign:'Toutes', title:'Rapport mensuel disponible', desc:'Mars 2026 — Télécharger PDF', date:'01/03/2026' },
]
</script>
