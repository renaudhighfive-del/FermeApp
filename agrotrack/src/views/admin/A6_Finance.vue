<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div><h1 class="page-title">Finance globale</h1><p class="page-subtitle">Bilan financier de toutes les campagnes</p></div>
      <div class="page-actions">
        <button class="btn btn-primary btn-sm"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Exporter PDF</button>
      </div>
    </div>
  </div>
  <div class="kpi-grid mb-gap">
    <div class="kpi-card"><div class="kpi-label">Total Dépenses</div><div class="kpi-value text-danger">3 850 000</div><div class="kpi-sub">FCFA</div></div>
    <div class="kpi-card"><div class="kpi-label">Total Revenus</div><div class="kpi-value" style="color:var(--success)">2 740 000</div><div class="kpi-sub">FCFA</div></div>
    <div class="kpi-card"><div class="kpi-label">Bénéfice Net</div><div class="kpi-value text-danger">-1 110 000</div><div class="kpi-sub">FCFA · Campagnes en cours</div></div>
    <div class="kpi-card"><div class="kpi-label">Campagnes rentables</div><div class="kpi-value" style="color:var(--success)">2/7</div><div class="kpi-sub">terminées</div></div>
  </div>
  <div class="card mb-gap">
    <div class="card-title">Bilan par campagne</div>
    <div class="table-wrap">
      <table class="table">
        <thead><tr><th>Campagne</th><th>Département</th><th>Statut</th><th>Dépenses</th><th>Revenus</th><th>Bénéfice net</th></tr></thead>
        <tbody>
          <tr><td class="fw-600">Campagne Mars 2026</td><td><span class="badge badge-vol">Volaille</span></td><td><span class="badge badge-encours">En cours</span></td><td>620 000 FCFA</td><td>0 FCFA</td><td class="text-danger fw-600">-620 000</td></tr>
          <tr><td class="fw-600">Lot Bœufs Fév</td><td><span class="badge badge-bet">Bétail</span></td><td><span class="badge badge-terminee">Terminée</span></td><td>2 100 000 FCFA</td><td>2 740 000 FCFA</td><td class="text-success fw-600">+640 000</td></tr>
          <tr><td class="fw-600">Bassin Tilapia</td><td><span class="badge badge-pis">Pisciculture</span></td><td><span class="badge badge-prep">Préparation</span></td><td>80 000 FCFA</td><td>0 FCFA</td><td class="text-danger fw-600">-80 000</td></tr>
          <tr><td class="fw-600">Poulet Janv 2026</td><td><span class="badge badge-vol">Volaille</span></td><td><span class="badge badge-terminee">Terminée</span></td><td>780 000 FCFA</td><td>0 FCFA</td><td class="text-soft fw-600">Ventes en attente</td></tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="card">
    <div class="card-title">Évolution revenus / dépenses par mois</div>
    <div class="chart-legend">
      <div class="chart-legend-item"><div class="legend-box" style="background:var(--primary)"></div>Dépenses</div>
      <div class="chart-legend-item"><div class="legend-box" style="background:var(--success)"></div>Revenus</div>
    </div>
    <svg width="100%" height="160" viewBox="0 0 520 160">
      <line x1="40" y1="10" x2="40" y2="140" stroke="#E8D9C5" stroke-width="0.5"/>
      <line x1="40" y1="140" x2="520" y2="140" stroke="#E8D9C5" stroke-width="0.5"/>
      <line x1="40" y1="50" x2="520" y2="50" stroke="#E8D9C5" stroke-width="0.5" stroke-dasharray="3"/>
      <line x1="40" y1="95" x2="520" y2="95" stroke="#E8D9C5" stroke-width="0.5" stroke-dasharray="3"/>
      <rect x="70"  y="90"  width="28" height="50"  fill="#3D2B1F" rx="3"/><rect x="102" y="110" width="28" height="30"  fill="#2D6A4F" rx="3"/>
      <rect x="180" y="70"  width="28" height="70"  fill="#3D2B1F" rx="3"/><rect x="212" y="95"  width="28" height="45"  fill="#2D6A4F" rx="3"/>
      <rect x="290" y="40"  width="28" height="100" fill="#3D2B1F" rx="3"/><rect x="322" y="60"  width="28" height="80"  fill="#2D6A4F" rx="3"/>
      <rect x="400" y="60"  width="28" height="80"  fill="#3D2B1F" rx="3"/><rect x="432" y="30"  width="28" height="110" fill="#2D6A4F" rx="3"/>
      <text x="100" y="155" text-anchor="middle" font-size="9" fill="#7A6652">Déc</text>
      <text x="210" y="155" text-anchor="middle" font-size="9" fill="#7A6652">Jan</text>
      <text x="320" y="155" text-anchor="middle" font-size="9" fill="#7A6652">Fév</text>
      <text x="430" y="155" text-anchor="middle" font-size="9" fill="#7A6652">Mars</text>
    </svg>
  </div>
</div>
</template>
<script setup></script>
