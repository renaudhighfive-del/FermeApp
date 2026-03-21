<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div><h1 class="page-title">Rapports globaux</h1><p class="page-subtitle">Analyses et performances</p></div>
      <div class="page-actions">
        <div class="filter-group">
          <button class="filter-btn" :class="{active:period==='mois'}" @click="period='mois'">Mois</button>
          <button class="filter-btn" :class="{active:period==='trimestre'}" @click="period='trimestre'">Trimestre</button>
          <button class="filter-btn" :class="{active:period==='annee'}" @click="period='annee'">Année</button>
        </div>
        <button class="btn btn-primary btn-sm">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Exporter PDF
        </button>
        <button class="btn btn-outline btn-sm">Exporter Excel</button>
      </div>
    </div>
  </div>
  <div class="grid-2 mb-gap">
    <div class="card">
      <div class="card-title">Revenus par département</div>
      <div class="chart-legend">
        <div class="chart-legend-item"><div class="legend-box" style="background:var(--vol)"></div>Volaille</div>
        <div class="chart-legend-item"><div class="legend-box" style="background:var(--bet)"></div>Bétail</div>
        <div class="chart-legend-item"><div class="legend-box" style="background:var(--pis)"></div>Pisciculture</div>
      </div>
      <svg width="100%" height="150" viewBox="0 0 460 150">
        <line x1="30" y1="10" x2="30" y2="130" stroke="#E8D9C5" stroke-width="0.5"/>
        <line x1="30" y1="130" x2="460" y2="130" stroke="#E8D9C5" stroke-width="0.5"/>
        <line x1="30" y1="50" x2="460" y2="50" stroke="#E8D9C5" stroke-width="0.5" stroke-dasharray="3"/>
        <line x1="30" y1="90" x2="460" y2="90" stroke="#E8D9C5" stroke-width="0.5" stroke-dasharray="3"/>
        <rect x="50" y="60" width="18" height="70" fill="#E8813A" rx="2"/>
        <rect x="70" y="80" width="18" height="50" fill="#8B5E3C" rx="2"/>
        <rect x="90" y="100" width="18" height="30" fill="#1A6B8A" rx="2"/>
        <rect x="150" y="40" width="18" height="90" fill="#E8813A" rx="2"/>
        <rect x="170" y="70" width="18" height="60" fill="#8B5E3C" rx="2"/>
        <rect x="190" y="95" width="18" height="35" fill="#1A6B8A" rx="2"/>
        <rect x="250" y="30" width="18" height="100" fill="#E8813A" rx="2"/>
        <rect x="270" y="65" width="18" height="65" fill="#8B5E3C" rx="2"/>
        <rect x="290" y="90" width="18" height="40" fill="#1A6B8A" rx="2"/>
        <rect x="350" y="50" width="18" height="80" fill="#E8813A" rx="2"/>
        <rect x="370" y="75" width="18" height="55" fill="#8B5E3C" rx="2"/>
        <rect x="390" y="100" width="18" height="30" fill="#1A6B8A" rx="2"/>
        <text x="79" y="145" text-anchor="middle" font-size="9" fill="#7A6652">Jan</text>
        <text x="179" y="145" text-anchor="middle" font-size="9" fill="#7A6652">Fév</text>
        <text x="279" y="145" text-anchor="middle" font-size="9" fill="#7A6652">Mars</text>
        <text x="379" y="145" text-anchor="middle" font-size="9" fill="#7A6652">Avr</text>
      </svg>
    </div>
    <div class="card">
      <div class="card-title">Mortalité globale</div>
      <svg width="100%" height="150" viewBox="0 0 460 150">
        <defs><linearGradient id="mortGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#D62828" stop-opacity="0.2"/><stop offset="100%" stop-color="#D62828" stop-opacity="0"/></linearGradient></defs>
        <line x1="30" y1="130" x2="460" y2="130" stroke="#E8D9C5" stroke-width="0.5"/>
        <line x1="30" y1="10" x2="30" y2="130" stroke="#E8D9C5" stroke-width="0.5"/>
        <line x1="30" y1="50" x2="460" y2="50" stroke="#E8D9C5" stroke-width="0.5" stroke-dasharray="3"/>
        <line x1="30" y1="90" x2="460" y2="90" stroke="#E8D9C5" stroke-width="0.5" stroke-dasharray="3"/>
        <path d="M30,110 L100,105 L150,100 L200,108 L250,95 L300,90 L350,85 L400,88 L450,80" fill="none" stroke="#D62828" stroke-width="2"/>
        <path d="M30,110 L100,105 L150,100 L200,108 L250,95 L300,90 L350,85 L400,88 L450,80 L450,130 L30,130 Z" fill="url(#mortGrad)"/>
        <text x="30" y="145" font-size="9" fill="#7A6652">Jan</text>
        <text x="240" y="145" text-anchor="middle" font-size="9" fill="#7A6652">Fév</text>
        <text x="450" y="145" text-anchor="end" font-size="9" fill="#7A6652">Mars</text>
      </svg>
    </div>
  </div>
  <div class="grid-2 mb-gap">
    <div class="card">
      <div class="card-title">Répartition des dépenses</div>
      <div class="flex gap-20 items-center">
        <svg width="130" height="130" viewBox="0 0 130 130">
          <circle cx="65" cy="65" r="50" fill="none" stroke="#E8D9C5" stroke-width="22"/>
          <circle cx="65" cy="65" r="50" fill="none" stroke="#E8813A" stroke-width="22" stroke-dasharray="141 173" stroke-dashoffset="-43" transform="rotate(-90 65 65)"/>
          <circle cx="65" cy="65" r="50" fill="none" stroke="#D62828" stroke-width="22" stroke-dasharray="79 235" stroke-dashoffset="-184" transform="rotate(-90 65 65)"/>
          <circle cx="65" cy="65" r="50" fill="none" stroke="#1A6B8A" stroke-width="22" stroke-dasharray="94 220" stroke-dashoffset="-263" transform="rotate(-90 65 65)"/>
        </svg>
        <div class="flex flex-col gap-8">
          <div class="flex items-center gap-8 text-sm"><div class="legend-dot" style="background:#E8813A;width:10px;height:10px;border-radius:50%"></div>Alimentation — 45%</div>
          <div class="flex items-center gap-8 text-sm"><div class="legend-dot" style="background:#D62828;width:10px;height:10px;border-radius:50%"></div>Médicaments — 25%</div>
          <div class="flex items-center gap-8 text-sm"><div class="legend-dot" style="background:#1A6B8A;width:10px;height:10px;border-radius:50%"></div>Main d'œuvre — 30%</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Performances par ferme</div>
      <table class="table">
        <thead><tr><th>Ferme</th><th>Animaux</th><th>Revenus</th><th>Perf.</th></tr></thead>
        <tbody>
          <tr><td class="fw-600">Ferme Nord</td><td>1 850</td><td>520 000 FCFA</td><td><span class="badge badge-encours">+12%</span></td></tr>
          <tr><td class="fw-600">Ferme Sud</td><td>1 430</td><td>380 000 FCFA</td><td><span class="badge badge-encours">+8%</span></td></tr>
          <tr><td class="fw-600">Ferme Est</td><td>1 000</td><td>340 000 FCFA</td><td><span class="badge badge-anomalie">-2%</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>
<script setup>
import { ref } from 'vue'
const period = ref('mois')
</script>
