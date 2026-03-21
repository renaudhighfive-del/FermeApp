<template>
<div>
  <!-- Header -->
  <div class="card mb-gap">
    <div class="flex items-start justify-between mb-16">
      <div>
        <div class="flex items-center gap-12 mb-8">
          <h1 class="page-title" style="margin-bottom:0">Campagne Mars 2026</h1>
          <span class="badge badge-vol">Volaille</span>
          <span class="badge badge-encours">En cours</span>
        </div>
        <p class="page-subtitle">Démarré le 01/03/2026 · Durée estimée 45 jours · Lot A, B, C</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline btn-sm"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Modifier</button>
        <button class="btn btn-primary btn-sm"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Exporter PDF</button>
      </div>
    </div>
    <div class="grid-3" style="margin-bottom:0">
      <div style="text-align:center;padding:16px;background:var(--bg);border-radius:10px">
        <div style="font-size:11px;color:var(--soft);margin-bottom:4px">EFFECTIF INITIAL</div>
        <div style="font-family:var(--font-display);font-size:28px">500</div>
      </div>
      <div style="text-align:center;padding:16px;background:#D4EDDA;border-radius:10px">
        <div style="font-size:11px;color:var(--soft);margin-bottom:4px">EFFECTIF ACTUEL</div>
        <div style="font-family:var(--font-display);font-size:28px;color:var(--success)">480</div>
      </div>
      <div style="text-align:center;padding:16px;background:#FDECEA;border-radius:10px">
        <div style="font-size:11px;color:var(--soft);margin-bottom:4px">PERTES</div>
        <div style="font-family:var(--font-display);font-size:28px;color:var(--danger)">20</div>
      </div>
    </div>
  </div>

  <!-- Tabs -->
  <div class="tabs">
    <div class="tab" :class="{active:activeTab==='overview'}" @click="activeTab='overview'">Vue d'ensemble</div>
    <div class="tab" :class="{active:activeTab==='animals'}" @click="activeTab='animals'">Animaux</div>
    <div class="tab" :class="{active:activeTab==='health'}" @click="activeTab='health'">Santé</div>
    <div class="tab" :class="{active:activeTab==='food'}" @click="activeTab='food'">Alimentation</div>
    <div class="tab" :class="{active:activeTab==='finance'}" @click="activeTab='finance'">Finance</div>
    <div class="tab" :class="{active:activeTab==='sales'}" @click="activeTab='sales'">Ventes</div>
  </div>

  <!-- Vue d'ensemble -->
  <div v-if="activeTab==='overview'">
    <div class="grid-2 mb-gap">
      <div class="card">
        <div class="card-title">Évolution de l'effectif — 30 jours</div>
        <svg width="100%" height="130" viewBox="0 0 460 130">
          <defs><linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2D6A4F" stop-opacity="0.2"/><stop offset="100%" stop-color="#2D6A4F" stop-opacity="0"/></linearGradient></defs>
          <line x1="0" y1="110" x2="460" y2="110" stroke="#E8D9C5" stroke-width="0.5"/>
          <line x1="0" y1="40" x2="460" y2="40" stroke="#E8D9C5" stroke-width="0.5" stroke-dasharray="3"/>
          <line x1="0" y1="75" x2="460" y2="75" stroke="#E8D9C5" stroke-width="0.5" stroke-dasharray="3"/>
          <path d="M0,108 L46,106 L92,104 L138,101 L184,99 L230,96 L276,94 L322,92 L368,90 L414,88 L460,86" fill="none" stroke="#2D6A4F" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M0,108 L46,106 L92,104 L138,101 L184,99 L230,96 L276,94 L322,92 L368,90 L414,88 L460,86 L460,110 L0,110 Z" fill="url(#growthGrad)"/>
          <text x="0"   y="124" font-size="9" fill="#7A6652">J1</text>
          <text x="230" y="124" text-anchor="middle" font-size="9" fill="#7A6652">J15</text>
          <text x="460" y="124" text-anchor="end" font-size="9" fill="#7A6652">J30</text>
        </svg>
      </div>
      <div class="card">
        <div class="card-title">Répartition des dépenses</div>
        <div class="flex items-center gap-20">
          <svg width="110" height="110" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r="40" fill="none" stroke="#E8D9C5" stroke-width="18"/>
            <circle cx="55" cy="55" r="40" fill="none" stroke="#E8813A" stroke-width="18" stroke-dasharray="113 138" stroke-dashoffset="-35" transform="rotate(-90 55 55)"/>
            <circle cx="55" cy="55" r="40" fill="none" stroke="#D62828" stroke-width="18" stroke-dasharray="63 188" stroke-dashoffset="-148" transform="rotate(-90 55 55)"/>
            <circle cx="55" cy="55" r="40" fill="none" stroke="#1A6B8A" stroke-width="18" stroke-dasharray="75 176" stroke-dashoffset="-211" transform="rotate(-90 55 55)"/>
          </svg>
          <div style="font-size:12px" class="flex flex-col gap-8">
            <div class="flex items-center gap-8"><div style="width:10px;height:10px;border-radius:50%;background:#E8813A;flex-shrink:0"></div>Alimentation — 45%</div>
            <div class="flex items-center gap-8"><div style="width:10px;height:10px;border-radius:50%;background:#D62828;flex-shrink:0"></div>Médicaments — 25%</div>
            <div class="flex items-center gap-8"><div style="width:10px;height:10px;border-radius:50%;background:#1A6B8A;flex-shrink:0"></div>Main d'œuvre — 30%</div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mb-gap">
      <div class="card-title">Résumé financier</div>
      <div class="grid-3" style="margin-bottom:0">
        <div style="text-align:center;padding:16px;background:var(--bg);border-radius:10px">
          <div style="font-size:11px;color:var(--soft);margin-bottom:4px">DÉPENSES</div>
          <div style="font-family:var(--font-display);font-size:24px;color:var(--danger)">620 000 FCFA</div>
        </div>
        <div style="text-align:center;padding:16px;background:var(--bg);border-radius:10px">
          <div style="font-size:11px;color:var(--soft);margin-bottom:4px">REVENUS</div>
          <div style="font-family:var(--font-display);font-size:24px;color:var(--soft)">0 FCFA</div>
        </div>
        <div style="text-align:center;padding:16px;background:#FDECEA;border-radius:10px">
          <div style="font-size:11px;color:var(--soft);margin-bottom:4px">BÉNÉFICE</div>
          <div style="font-family:var(--font-display);font-size:24px;color:var(--danger)">-620 000 FCFA</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Animaux -->
  <div v-if="activeTab==='animals'">
    <div class="flex items-center justify-between mb-gap">
      <div class="search-wrap">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A6652" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input class="search-input" placeholder="Rechercher par ID..."/>
      </div>
      <button class="btn btn-primary btn-sm">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Ajouter animal
      </button>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>ID</th><th>Date éclosion</th><th>Poids</th><th>Santé</th><th>Vaccins</th><th>QR Code</th><th>Actions</th></tr></thead>
          <tbody>
            <tr v-for="a in animals" :key="a.id" @click="goAnimal(a.id)">
              <td class="fw-600" style="color:var(--primary)">{{ a.id }}</td>
              <td class="text-soft text-sm">{{ a.eclosion }}</td>
              <td>{{ a.weight }}</td>
              <td><span class="badge" :class="a.healthClass">{{ a.health }}</span></td>
              <td>{{ a.vaccines }}</td>
              <td><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--soft)" stroke-width="1.5"><rect x="2" y="2" width="5" height="5"/><rect x="17" y="2" width="5" height="5"/><rect x="2" y="17" width="5" height="5"/><path d="M10 2h1v1h-1zm2 0h1v1h-1z"/><path d="M2 10h1v1H2zm0 2h1v1H2z"/></svg></td>
              <td><button class="btn btn-outline btn-sm"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Santé -->
  <div v-if="activeTab==='health'">
    <div class="card">
      <div class="card-title">Événements santé</div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Date</th><th>Animal</th><th>Type</th><th>Description</th><th>Agent</th><th>Statut</th></tr></thead>
          <tbody>
            <tr><td class="text-soft text-sm">19/03/26</td><td class="fw-600">#VOL-002</td><td><span class="badge badge-anomalie">Anomalie</span></td><td>Comportement anormal, léthargie</td><td class="text-soft">Paul Ahoua</td><td><span class="badge badge-urgent">En cours</span></td></tr>
            <tr><td class="text-soft text-sm">18/03/26</td><td class="fw-600">Lot C</td><td><span class="badge badge-encours">Vaccination</span></td><td>Vaccin Newcastle — 480 doses</td><td class="text-soft">Dr. Koffi</td><td><span class="badge badge-termine">Terminé</span></td></tr>
            <tr><td class="text-soft text-sm">17/03/26</td><td class="fw-600">Lot B</td><td><span class="badge badge-anomalie">Mortalité</span></td><td>3 pertes — cause indéterminée</td><td class="text-soft">Paul Ahoua</td><td><span class="badge badge-terminee">Clôturé</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Alimentation -->
  <div v-if="activeTab==='food'">
    <div class="grid-3 mb-gap" style="gap:14px">
      <div class="kpi-card"><div class="kpi-label">Stock disponible</div><div class="kpi-value" style="color:var(--warn)">120 kg</div></div>
      <div class="kpi-card"><div class="kpi-label">Consommation/jour</div><div class="kpi-value">15 kg</div></div>
      <div class="kpi-card"><div class="kpi-label">Coût total aliments</div><div class="kpi-value">280 000 FCFA</div></div>
    </div>
    <div class="card">
      <div class="card-title">Distributions récentes</div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Date</th><th>Lot</th><th>Quantité</th><th>Type aliment</th><th>Agent</th></tr></thead>
          <tbody>
            <tr><td class="text-soft text-sm">19/03/26</td><td>Lot A+B</td><td>15 kg</td><td>Granulés croissance</td><td class="text-soft">Awa Traoré</td></tr>
            <tr><td class="text-soft text-sm">18/03/26</td><td>Lot A+B+C</td><td>15 kg</td><td>Granulés croissance</td><td class="text-soft">Paul Ahoua</td></tr>
            <tr><td class="text-soft text-sm">17/03/26</td><td>Lot A+B+C</td><td>12 kg</td><td>Granulés démarrage</td><td class="text-soft">Awa Traoré</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Finance -->
  <div v-if="activeTab==='finance'">
    <div class="grid-2 mb-gap">
      <div class="dep-card">
        <div class="dep-rev-title" style="color:var(--danger)">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
          Dépenses
        </div>
        <div class="dep-rev-total text-danger">620 000 FCFA</div>
        <div class="line-item"><div class="line-item-left"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>Alimentation</div><div class="line-item-val">280 000 FCFA</div></div>
        <div class="line-item"><div class="line-item-left"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>Médicaments</div><div class="line-item-val">155 000 FCFA</div></div>
        <div class="line-item"><div class="line-item-left"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>Main d'œuvre</div><div class="line-item-val">185 000 FCFA</div></div>
        <button class="btn btn-danger-outline btn-sm w-full" style="margin-top:14px;justify-content:center">+ Ajouter dépense</button>
      </div>
      <div class="rev-card">
        <div class="dep-rev-title" style="color:var(--success)">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
          Revenus
        </div>
        <div class="dep-rev-total text-soft">0 FCFA</div>
        <div class="empty-state">
          <svg width="40" height="40" fill="none" stroke="#7A6652" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <p>Aucune vente pour le moment</p>
        </div>
        <button class="btn btn-success-outline btn-sm w-full" style="justify-content:center">+ Enregistrer vente</button>
      </div>
    </div>
  </div>

  <!-- Ventes -->
  <div v-if="activeTab==='sales'">
    <div class="card">
      <div class="empty-state" style="padding:48px">
        <svg width="50" height="50" fill="none" stroke="#E8D9C5" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <p style="font-size:16px;color:var(--soft);margin-bottom:16px">Aucune vente enregistrée</p>
        <button class="btn btn-primary">+ Enregistrer une vente</button>
      </div>
    </div>
  </div>

  <!-- FAB -->
  <button class="fab" title="Ajouter événement">
    <svg width="22" height="22" fill="none" stroke="var(--primary)" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  </button>
  <div class="fab-label">Ajouter événement</div>
</div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const activeTab = ref('overview')
const animals = [
  { id:'#VOL-001', eclosion:'01/03/2026', weight:'1.35 kg', health:'Sain',     healthClass:'badge-sain',    vaccines:'3/4' },
  { id:'#VOL-002', eclosion:'01/03/2026', weight:'0.95 kg', health:'Anomalie', healthClass:'badge-anomalie', vaccines:'2/4' },
  { id:'#VOL-003', eclosion:'01/03/2026', weight:'1.28 kg', health:'Sain',     healthClass:'badge-sain',    vaccines:'3/4' },
  { id:'#VOL-047', eclosion:'01/03/2026', weight:'1.42 kg', health:'Sain',     healthClass:'badge-sain',    vaccines:'4/4' },
]
function goAnimal(id) { router.push('/agent/animal/'+id.replace('#','')) }
</script>
