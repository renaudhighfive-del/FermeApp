<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div><h1 class="page-title">Santé & Vétérinaire</h1><p class="page-subtitle">Suivi sanitaire · Campagne Mars 2026</p></div>
      <div class="page-actions"><button class="btn btn-primary"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Enregistrer événement</button></div>
    </div>
  </div>
  <div class="kpi-grid mb-gap">
    <div class="kpi-card"><div class="kpi-top"><div><div class="kpi-label">Animaux sains</div><div class="kpi-value" style="color:var(--success)">467</div></div><div class="kpi-icon" style="background:#D4EDDA"><svg width="24" height="24" fill="none" stroke="#2D6A4F" stroke-width="1.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div></div></div>
    <div class="kpi-card"><div class="kpi-top"><div><div class="kpi-label">Anomalies</div><div class="kpi-value" style="color:var(--danger)">8</div></div><div class="kpi-icon" style="background:#FDECEA"><svg width="24" height="24" fill="none" stroke="#D62828" stroke-width="1.5" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg></div></div></div>
    <div class="kpi-card"><div class="kpi-top"><div><div class="kpi-label">Vaccinations dues</div><div class="kpi-value" style="color:var(--warn)">480</div></div><div class="kpi-icon" style="background:#FFF7ED"><svg width="24" height="24" fill="none" stroke="#E07B39" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg></div></div></div>
    <div class="kpi-card"><div class="kpi-top"><div><div class="kpi-label">Traitements en cours</div><div class="kpi-value">5</div></div><div class="kpi-icon" style="background:#E3EFF5"><svg width="24" height="24" fill="none" stroke="#1A6B8A" stroke-width="1.5" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div></div></div>
  </div>
  <div class="grid-2 mb-gap">
    <div class="card">
      <div class="card-title">Événements santé récents</div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Date</th><th>Animal</th><th>Type</th><th>Description</th><th>Agent</th><th>Statut</th></tr></thead>
          <tbody>
            <tr><td class="text-soft text-sm">19/03</td><td class="fw-600">#VOL-002</td><td><span class="badge badge-anomalie">Anomalie</span></td><td>Léthargie, perte appétit</td><td class="text-soft">Paul</td><td><span class="badge badge-urgent">Suivi</span></td></tr>
            <tr><td class="text-soft text-sm">18/03</td><td class="fw-600">Lot C</td><td><span class="badge badge-encours">Vaccination</span></td><td>Newcastle — 480 doses</td><td class="text-soft">Dr. Koffi</td><td><span class="badge badge-termine">Terminé</span></td></tr>
            <tr><td class="text-soft text-sm">17/03</td><td class="fw-600">Lot B</td><td><span class="badge badge-anomalie">Mortalité</span></td><td>3 pertes inexpliquées</td><td class="text-soft">Paul</td><td><span class="badge badge-terminee">Clôturé</span></td></tr>
            <tr><td class="text-soft text-sm">15/03</td><td class="fw-600">#VOL-088</td><td><span class="badge badge-observation">Observation</span></td><td>Comportement inhabituel</td><td class="text-soft">Awa</td><td><span class="badge badge-encours2">En cours</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Calendrier vaccinations — Mars 2026</div>
      <div class="mini-cal">
        <div class="mini-cal-header">
          <button class="btn btn-outline btn-sm">‹</button>
          <span class="fw-600">Mars 2026</span>
          <button class="btn btn-outline btn-sm">›</button>
        </div>
        <div class="mini-cal-grid">
          <div class="mini-cal-day-name" v-for="d in ['L','M','M','J','V','S','D']" :key="d">{{ d }}</div>
          <div class="mini-cal-cell" v-for="n in 31" :key="n" :class="{'today':n===19,'has-event':[7,14,22,28].includes(n),'has-urgent':[18].includes(n)}">{{ n }}</div>
        </div>
        <div class="flex gap-12 mt-auto" style="margin-top:12px;font-size:11px">
          <div class="flex items-center gap-6"><div style="width:8px;height:8px;border-radius:50%;background:var(--success)"></div>Vaccination</div>
          <div class="flex items-center gap-6"><div style="width:8px;height:8px;border-radius:50%;background:var(--danger)"></div>Urgent</div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script setup></script>
