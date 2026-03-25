<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div><h1 class="page-title">Alimentation</h1><p class="page-subtitle">Gestion des stocks et distributions</p></div>
      <div class="page-actions">
        <button class="btn btn-outline btn-sm">+ Commander</button>
        <button class="btn btn-primary btn-sm">+ Distribution</button>
      </div>
    </div>
  </div>
  <div class="kpi-grid mb-gap">
    <div class="kpi-card"><div class="kpi-label">Stock disponible</div><div class="kpi-value" style="color:var(--warn)">120 kg</div><div class="kpi-sub warn">⚠ Seuil critique : 50kg</div></div>
    <div class="kpi-card"><div class="kpi-label">Consommation/jour</div><div class="kpi-value">15 kg</div><div class="kpi-sub">8 jours restants</div></div>
    <div class="kpi-card"><div class="kpi-label">Consommation semaine</div><div class="kpi-value">105 kg</div></div>
    <div class="kpi-card"><div class="kpi-label">Coût total aliments</div><div class="kpi-value">280 000 FCFA</div></div>
  </div>

  <div class="alert-card alert-warning mb-gap">
    <svg width="18" height="18" fill="none" stroke="#E07B39" stroke-width="1.5" viewBox="0 0 24 24" style="flex-shrink:0;margin-top:2px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
    <div class="alert-content">
      <div class="alert-title">Stock aliment faible — Granulés croissance</div>
      <div class="alert-desc">120kg restants · Consommation : 15kg/jour · Durée estimée : 8 jours</div>
      <button class="btn btn-sm" style="background:#FFF7ED;color:var(--warn);border:1px solid var(--warn)">Commander maintenant</button>
    </div>
  </div>

  <div class="card mb-gap">
    <div class="card-title">Consommation quotidienne — 30 jours</div>
    <svg width="100%" height="120" viewBox="0 0 520 120">
      <line x1="0" y1="100" x2="520" y2="100" stroke="#E8D9C5" stroke-width="0.5"/>
      <line x1="0" y1="40" x2="520" y2="40" stroke="#E8D9C5" stroke-width="0.5" stroke-dasharray="3"/>
      <line x1="0" y1="70" x2="520" y2="70" stroke="#E8D9C5" stroke-width="0.5" stroke-dasharray="3"/>
      <path d="M0,80 L18,78 L36,82 L54,76 L72,74 L90,79 L108,73 L126,75 L144,70 L162,72 L180,68 L198,65 L216,67 L234,62 L252,60 L270,63 L288,58 L306,55 L324,57 L342,53 L360,50 L378,52 L396,48 L414,45 L432,47 L450,43 L468,41 L486,40 L504,38 L520,36" fill="none" stroke="#E8813A" stroke-width="2"/>
      <text x="0" y="115" font-size="9" fill="#7A6652">J1</text><text x="260" y="115" text-anchor="middle" font-size="9" fill="#7A6652">J15</text><text x="520" y="115" text-anchor="end" font-size="9" fill="#7A6652">J30</text>
    </svg>
  </div>

  <div class="card">
    <div class="card-title">Distributions récentes</div>
    <div class="table-wrap">
      <table class="table">
        <thead><tr><th>Date</th><th>Lot</th><th>Quantité</th><th>Type aliment</th><th>Agent</th></tr></thead>
        <tbody>
          <tr><td class="text-soft text-sm">19/03/26</td><td>Lot A+B+C</td><td class="fw-600">15 kg</td><td>Granulés croissance</td><td class="text-soft">Awa Traoré</td></tr>
          <tr><td class="text-soft text-sm">18/03/26</td><td>Lot A+B+C</td><td class="fw-600">15 kg</td><td>Granulés croissance</td><td class="text-soft">Paul Ahoua</td></tr>
          <tr><td class="text-soft text-sm">17/03/26</td><td>Lot A+B+C</td><td class="fw-600">12 kg</td><td>Granulés démarrage</td><td class="text-soft">Awa Traoré</td></tr>
          <tr><td class="text-soft text-sm">16/03/26</td><td>Lot A+B</td><td class="fw-600">10 kg</td><td>Granulés croissance</td><td class="text-soft">Paul Ahoua</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>
<script setup></script>
