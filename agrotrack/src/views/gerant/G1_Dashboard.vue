<template>
<div>
  <div class="banner">
    <svg width="28" height="28" fill="none" stroke="#F2B705" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
    <div class="banner-content"><h3>Bonjour Marie — 4 tâches à effectuer aujourd'hui</h3><p>Mercredi 19 Mars 2026 · Campagne Mars 2026 en cours</p></div>
  </div>
  <div class="kpi-grid mb-gap">
    <div class="kpi-card"><div class="kpi-top"><div><div class="kpi-label">Animaux vivants</div><div class="kpi-value" style="color:var(--success)">480</div><div class="kpi-sub up">Campagne Mars 2026</div></div><div class="kpi-icon" style="background:#D4EDDA"><svg width="24" height="24" fill="none" stroke="#2D6A4F" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></svg></div></div></div>
    <div class="kpi-card"><div class="kpi-top"><div><div class="kpi-label">Pertes aujourd'hui</div><div class="kpi-value" style="color:var(--danger)">3</div><div class="kpi-sub down">↑ +2 vs hier</div></div><div class="kpi-icon" style="background:#FDECEA"><svg width="24" height="24" fill="none" stroke="#D62828" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg></div></div></div>
    <div class="kpi-card"><div class="kpi-top"><div><div class="kpi-label">Aliments restants</div><div class="kpi-value" style="color:var(--warn)">120 kg</div><div class="kpi-sub warn">Seuil : 50kg</div></div><div class="kpi-icon" style="background:#FFF7ED"><svg width="24" height="24" fill="none" stroke="#E07B39" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg></div></div></div>
    <div class="kpi-card"><div class="kpi-top"><div><div class="kpi-label">Bénéfice estimé</div><div class="kpi-value" style="color:var(--success)">+340 000</div><div class="kpi-sub">FCFA prévisionnel</div></div><div class="kpi-icon" style="background:#D4EDDA"><svg width="24" height="24" fill="none" stroke="#2D6A4F" stroke-width="1.5" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></div></div></div>
  </div>
  <div class="grid-2-1 mb-gap">
    <div class="flex flex-col gap-20">
      <div class="card">
        <div class="card-header">
          <div class="card-title" style="margin-bottom:0">Campagne Mars 2026 <span class="badge badge-encours">En cours</span></div>
          <RouterLink to="/gerant/campaigns/1" class="btn btn-outline btn-sm">Voir détail</RouterLink>
        </div>
        <div class="progress-wrap mb-12">
          <div class="progress-header"><span>Animaux vivants</span><span class="fw-600">480/500 (96%)</span></div>
          <div class="progress-track"><div class="progress-fill fill-green" style="width:96%"></div></div>
        </div>
        <div class="progress-wrap">
          <div class="progress-header"><span>Budget consommé</span><span class="fw-600">620k/850k FCFA (73%)</span></div>
          <div class="progress-track"><div class="progress-fill fill-yellow" style="width:73%"></div></div>
        </div>
        <div class="flex gap-20 mt-auto" style="margin-top:14px;font-size:12px;color:var(--soft)">
          <span class="flex items-center gap-8"><svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Démarré le 1 Mars 2026</span>
          <span class="flex items-center gap-8"><svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Durée estimée : 45 jours</span>
        </div>
      </div>
      <div class="card">
        <div class="card-title">5 derniers événements</div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Agent</th></tr></thead>
            <tbody>
              <tr><td class="text-soft text-sm">19/03</td><td><span class="badge badge-vol">Pesée</span></td><td>Pesée lot A — poids moy. 1.2kg</td><td class="text-soft text-sm">Paul Ahoua</td></tr>
              <tr><td class="text-soft text-sm">19/03</td><td><span class="badge badge-pis">Alimentation</span></td><td>Distribution 15kg granulés</td><td class="text-soft text-sm">Awa Traoré</td></tr>
              <tr><td class="text-soft text-sm">18/03</td><td><span class="badge badge-anomalie">Mortalité</span></td><td>3 pertes lot B</td><td class="text-soft text-sm">Paul Ahoua</td></tr>
              <tr><td class="text-soft text-sm">18/03</td><td><span class="badge badge-encours">Vaccination</span></td><td>Vaccin Newcastle lot C</td><td class="text-soft text-sm">Dr. Koffi</td></tr>
              <tr><td class="text-soft text-sm">17/03</td><td><span class="badge badge-inactif">Observation</span></td><td>Comportement normal général</td><td class="text-soft text-sm">Paul Ahoua</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="card" style="align-self:start">
      <div class="card-title">Prochaines vaccinations</div>
      <div class="vacc-item"><div class="vacc-date-badge"><div class="vacc-day">22</div><div class="vacc-mon">Mars</div></div><div><div class="vacc-name">Vaccin Gumboro</div><div class="vacc-lot">Lot A · 500 doses</div></div></div>
      <div class="vacc-item"><div class="vacc-date-badge"><div class="vacc-day">28</div><div class="vacc-mon">Mars</div></div><div><div class="vacc-name">Rappel Newcastle</div><div class="vacc-lot">Lot C · 480 doses</div></div></div>
      <div class="vacc-item"><div class="vacc-date-badge"><div class="vacc-day">05</div><div class="vacc-mon">Avr</div></div><div><div class="vacc-name">Déparasitage</div><div class="vacc-lot">Tous lots</div></div></div>
    </div>
  </div>
</div>
</template>
<script setup></script>
