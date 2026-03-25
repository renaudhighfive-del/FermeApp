<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div><h1 class="page-title">Finance</h1><p class="page-subtitle">Campagne Mars 2026 · En cours</p></div>
      <div class="page-actions"><button class="btn btn-primary btn-sm"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Exporter PDF</button></div>
    </div>
  </div>
  <div class="card mb-gap">
    <div class="finance-result">
      <div style="font-size:13px;color:var(--soft);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.08em">Résultat net estimé</div>
      <div class="finance-result-val negative">-620 000 FCFA</div>
      <div class="finance-result-sub">Campagne en cours · Revenus à venir après la vente</div>
    </div>
  </div>
  <div class="dep-rev-grid mb-gap">
    <div class="dep-card">
      <div class="dep-rev-title" style="color:var(--danger)">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
        Dépenses
      </div>
      <div class="dep-rev-total text-danger">620 000 FCFA</div>
      <div class="line-item"><div class="line-item-left"><svg width="14" height="14" fill="none" stroke="#E8813A" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>Alimentation</div><div class="line-item-val">280 000 FCFA</div></div>
      <div class="line-item"><div class="line-item-left"><svg width="14" height="14" fill="none" stroke="#D62828" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>Médicaments</div><div class="line-item-val">155 000 FCFA</div></div>
      <div class="line-item"><div class="line-item-left"><svg width="14" height="14" fill="none" stroke="#1A6B8A" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>Main d'œuvre</div><div class="line-item-val">185 000 FCFA</div></div>
      <button class="btn btn-danger-outline btn-sm w-full" style="margin-top:14px;justify-content:center">+ Ajouter dépense</button>
    </div>
    <div class="rev-card">
      <div class="dep-rev-title" style="color:var(--success)">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
        Revenus
      </div>
      <div class="dep-rev-total text-soft">0 FCFA</div>
      <div class="empty-state">
        <svg width="40" height="40" fill="none" stroke="#E8D9C5" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <p>Aucune vente enregistrée</p>
      </div>
      <button class="btn btn-success-outline btn-sm w-full" style="margin-top:14px;justify-content:center">+ Enregistrer vente</button>
    </div>
  </div>
  <div class="card">
    <div class="card-title">Répartition des dépenses</div>
    <div class="flex items-center justify-center gap-32" style="padding:16px">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r="50" fill="none" stroke="#E8D9C5" stroke-width="22"/>
        <circle cx="65" cy="65" r="50" fill="none" stroke="#E8813A" stroke-width="22" stroke-dasharray="141 173" stroke-dashoffset="-43" transform="rotate(-90 65 65)"/>
        <circle cx="65" cy="65" r="50" fill="none" stroke="#D62828" stroke-width="22" stroke-dasharray="79 235" stroke-dashoffset="-184" transform="rotate(-90 65 65)"/>
        <circle cx="65" cy="65" r="50" fill="none" stroke="#1A6B8A" stroke-width="22" stroke-dasharray="94 220" stroke-dashoffset="-263" transform="rotate(-90 65 65)"/>
        <text x="65" y="60" text-anchor="middle" font-size="11" fill="#7A6652">Total</text>
        <text x="65" y="76" text-anchor="middle" font-size="13" font-weight="600" fill="#1A1008">620k</text>
      </svg>
      <div class="flex flex-col gap-10" style="font-size:13px">
        <div class="flex items-center gap-10"><div style="width:12px;height:12px;border-radius:50%;background:#E8813A"></div><span>Alimentation</span><span class="fw-600" style="margin-left:auto">45%</span></div>
        <div class="flex items-center gap-10"><div style="width:12px;height:12px;border-radius:50%;background:#D62828"></div><span>Médicaments</span><span class="fw-600" style="margin-left:auto">25%</span></div>
        <div class="flex items-center gap-10"><div style="width:12px;height:12px;border-radius:50%;background:#1A6B8A"></div><span>Main d'œuvre</span><span class="fw-600" style="margin-left:auto">30%</span></div>
      </div>
    </div>
  </div>
</div>
</template>
<script setup></script>
