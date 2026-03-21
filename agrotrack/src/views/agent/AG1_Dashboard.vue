<template>
<div>
  <div class="banner mb-gap">
    <svg width="28" height="28" fill="none" stroke="#F2B705" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
    <div class="banner-content">
      <h3>Bonjour Paul — Mardi 19 Mars 2026</h3>
      <p>3 tâches assignées aujourd'hui · Campagne Mars 2026</p>
    </div>
  </div>

  <!-- Scanner QR bouton XL -->
  <RouterLink to="/agent/animal/VOL-047" style="display:block;text-decoration:none">
    <button class="btn-xl btn-accent" style="border-radius:var(--radius);border:none;cursor:pointer;font-family:var(--font-body);margin-bottom:var(--gap)">
      <svg width="28" height="28" fill="none" stroke="var(--primary)" stroke-width="1.5" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
      Scanner QR Code Animal
      <small>Voir l'historique d'un animal</small>
    </button>
  </RouterLink>

  <!-- Tâches du jour -->
  <div class="card-title" style="margin-bottom:14px">Mes tâches du jour</div>
  <div class="grid-3 mb-gap">
    <div class="task-card task-card-green">
      <div class="task-icon" style="background:#A3D9B4">
        <svg width="20" height="20" fill="none" stroke="#2D6A4F" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 6v6h4"/></svg>
      </div>
      <div class="task-title">Pesée — Lot A</div>
      <div class="task-sub">08h00 · 50 animaux</div>
      <span class="badge badge-afaire">À faire</span>
    </div>
    <div class="task-card task-card-orange">
      <div class="task-icon" style="background:#F5CBA7">
        <svg width="20" height="20" fill="none" stroke="#E07B39" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
      </div>
      <div class="task-title">Distribution aliments</div>
      <div class="task-sub">12h00 · 15kg granulés</div>
      <span class="badge badge-afaire">À faire</span>
    </div>
    <div class="task-card task-card-red">
      <div class="task-icon" style="background:#F5C6CB">
        <svg width="20" height="20" fill="none" stroke="#D62828" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </div>
      <div class="task-title">Vaccination URGENTE</div>
      <div class="task-sub">Lot C · Newcastle</div>
      <span class="badge badge-urgent">Urgent</span>
    </div>
  </div>

  <!-- Alertes reçues -->
  <div class="card">
    <div class="card-title">
      <svg width="16" height="16" fill="none" stroke="var(--warn)" stroke-width="1.5" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      Alertes reçues
    </div>
    <div class="alert-card alert-danger">
      <svg width="18" height="18" fill="none" stroke="#D62828" stroke-width="1.5" viewBox="0 0 24 24" style="flex-shrink:0;margin-top:2px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
      <div class="alert-content">
        <div class="alert-title">Vaccination Newcastle en retard</div>
        <div class="alert-desc">Lot C — J+14 — À effectuer aujourd'hui</div>
        <RouterLink to="/agent/saisie" class="btn btn-danger btn-sm">Saisir</RouterLink>
      </div>
    </div>
    <div class="alert-card alert-warning">
      <svg width="18" height="18" fill="none" stroke="#E07B39" stroke-width="1.5" viewBox="0 0 24 24" style="flex-shrink:0;margin-top:2px"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
      <div class="alert-content">
        <div class="alert-title">Pesée Lot A en attente</div>
        <div class="alert-desc">Prévu à 08h00 — Pas encore effectuée</div>
        <RouterLink to="/agent/saisie" class="btn btn-sm" style="background:#FFF7ED;color:var(--warn);border:1px solid var(--warn)">Commencer</RouterLink>
      </div>
    </div>
  </div>
</div>
</template>
<script setup></script>
