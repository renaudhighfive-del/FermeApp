<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div><h1 class="page-title">Rapports</h1><p class="page-subtitle">Générez et exportez vos rapports</p></div>
      <div class="page-actions"><button class="btn btn-primary"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Générer PDF</button></div>
    </div>
  </div>
  <div class="grid-2 mb-gap" style="align-items:start">
    <div>
      <div class="card mb-gap">
        <div class="card-title">Paramètres du rapport</div>
        <div class="form-group"><label class="form-label">Campagne</label><select class="form-select"><option>Campagne Mars 2026</option><option>Lot Bœufs Fév</option><option>Toutes les campagnes</option></select></div>
        <div class="form-group"><label class="form-label">Période</label>
          <div class="filter-group w-full">
            <button class="filter-btn active" style="flex:1">Mois</button>
            <button class="filter-btn" style="flex:1">Trimestre</button>
            <button class="filter-btn" style="flex:1">Campagne</button>
          </div>
        </div>
        <div class="form-group"><label class="form-label">Sections à inclure</label>
          <div class="flex flex-col gap-8" style="font-size:13px">
            <label class="flex items-center gap-8"><input type="checkbox" checked/> Performances animaux</label>
            <label class="flex items-center gap-8"><input type="checkbox" checked/> Bilan financier</label>
            <label class="flex items-center gap-8"><input type="checkbox" checked/> Résumé santé</label>
            <label class="flex items-center gap-8"><input type="checkbox" checked/> Consommation aliments</label>
            <label class="flex items-center gap-8"><input type="checkbox"/> Détail ventes</label>
          </div>
        </div>
        <button class="btn btn-primary btn-full">Générer le rapport</button>
      </div>
    </div>
    <div class="report-preview">
      <div class="report-preview-header">
        <div class="report-preview-title">Rapport — Campagne Mars 2026</div>
        <div class="report-preview-sub">Généré le 19/03/2026 · AgroTrack</div>
      </div>
      <div class="report-block">
        <div class="report-block-title">Performances animaux</div>
        <div class="report-stat-row"><span>Effectif initial</span><span class="fw-600">500</span></div>
        <div class="report-stat-row"><span>Effectif actuel</span><span class="fw-600" style="color:var(--success)">480</span></div>
        <div class="report-stat-row"><span>Taux de survie</span><span class="fw-600">96%</span></div>
        <div class="report-stat-row"><span>Poids moyen</span><span class="fw-600">1.28 kg</span></div>
      </div>
      <div class="report-block">
        <div class="report-block-title">Bilan financier</div>
        <div class="report-stat-row"><span>Total dépenses</span><span class="fw-600 text-danger">620 000 FCFA</span></div>
        <div class="report-stat-row"><span>Total revenus</span><span class="fw-600 text-soft">0 FCFA</span></div>
        <div class="report-stat-row"><span>Résultat net</span><span class="fw-600 text-danger">-620 000 FCFA</span></div>
      </div>
      <div class="report-block">
        <div class="report-block-title">Résumé santé</div>
        <div class="report-stat-row"><span>Animaux sains</span><span class="fw-600 text-success">467 (97.3%)</span></div>
        <div class="report-stat-row"><span>Anomalies</span><span class="fw-600 text-danger">8 (1.7%)</span></div>
        <div class="report-stat-row"><span>Pertes totales</span><span class="fw-600 text-danger">20 (4%)</span></div>
      </div>
    </div>
  </div>
</div>
</template>
<script setup></script>
