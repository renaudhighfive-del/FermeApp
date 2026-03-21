<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div><h1 class="page-title">Ventes globales</h1><p class="page-subtitle">Historique de toutes les ventes</p></div>
      <div class="page-actions">
        <button class="btn btn-primary"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Enregistrer vente</button>
      </div>
    </div>
  </div>
  <div class="kpi-grid-3 mb-gap">
    <div class="kpi-card" style="text-align:center;padding:24px">
      <div class="kpi-label">Total encaissé</div>
      <div class="kpi-value" style="color:var(--success)">2 740 000 FCFA</div>
    </div>
    <div class="kpi-card" style="text-align:center;padding:24px">
      <div class="kpi-label">En attente paiement</div>
      <div class="kpi-value" style="color:var(--warn)">340 000 FCFA</div>
    </div>
    <div class="kpi-card" style="text-align:center;padding:24px">
      <div class="kpi-label">Animaux vendus (total)</div>
      <div class="kpi-value">523</div>
    </div>
  </div>
  <div class="card mb-gap">
    <div class="card-title">Revenus ventes par mois</div>
    <svg width="100%" height="120" viewBox="0 0 520 120">
      <defs><linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2D6A4F" stop-opacity="0.25"/><stop offset="100%" stop-color="#2D6A4F" stop-opacity="0"/></linearGradient></defs>
      <line x1="0" y1="100" x2="520" y2="100" stroke="#E8D9C5" stroke-width="0.5"/>
      <path d="M0,100 L80,100 L160,100 L240,70 L320,40 L400,30 L520,20" fill="none" stroke="#2D6A4F" stroke-width="2.5"/>
      <path d="M0,100 L80,100 L160,100 L240,70 L320,40 L400,30 L520,20 L520,100 Z" fill="url(#salesGrad)"/>
      <text x="0" y="115" font-size="9" fill="#7A6652">Oct</text>
      <text x="80" y="115" text-anchor="middle" font-size="9" fill="#7A6652">Nov</text>
      <text x="160" y="115" text-anchor="middle" font-size="9" fill="#7A6652">Déc</text>
      <text x="240" y="115" text-anchor="middle" font-size="9" fill="#7A6652">Jan</text>
      <text x="320" y="115" text-anchor="middle" font-size="9" fill="#7A6652">Fév</text>
      <text x="400" y="115" text-anchor="middle" font-size="9" fill="#7A6652">Mars</text>
    </svg>
  </div>
  <div class="card">
    <div class="table-wrap">
      <table class="table">
        <thead><tr><th>Date</th><th>Campagne</th><th>Animaux vendus</th><th>Prix unitaire</th><th>Total</th><th>Acheteur</th><th>Paiement</th></tr></thead>
        <tbody>
          <tr><td>15/02/2026</td><td class="fw-600">Lot Bœufs Fév</td><td>20 têtes</td><td>137 000 FCFA</td><td class="fw-600">2 740 000 FCFA</td><td>Abattoir Central</td><td><span class="badge badge-encaisse">Encaissé</span></td></tr>
          <tr><td>28/02/2026</td><td class="fw-600">Lot Bœufs Fév</td><td>23 têtes</td><td>137 000 FCFA</td><td class="fw-600">3 151 000 FCFA</td><td>M. Koné Traoré</td><td><span class="badge badge-attente">En attente</span></td></tr>
          <tr><td>10/01/2026</td><td class="fw-600">Poulet Janv 2026</td><td>480 poulets</td><td>2 500 FCFA</td><td class="fw-600">1 200 000 FCFA</td><td>Marché Central</td><td><span class="badge badge-encaisse">Encaissé</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>
<script setup></script>
