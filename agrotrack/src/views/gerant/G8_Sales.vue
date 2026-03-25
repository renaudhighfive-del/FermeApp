<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div><h1 class="page-title">Ventes</h1><p class="page-subtitle">Campagne Mars 2026</p></div>
      <div class="page-actions"><button class="btn btn-primary" @click="showModal=true"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Enregistrer vente</button></div>
    </div>
  </div>
  <div class="card mb-gap">
    <div class="empty-state" style="padding:48px">
      <svg width="60" height="60" fill="none" stroke="#E8D9C5" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      <p style="font-size:15px;margin-bottom:6px">Aucune vente enregistrée</p>
      <p class="text-sm" style="margin-bottom:20px">La campagne est en cours · Les ventes seront disponibles à la récolte</p>
      <button class="btn btn-primary" @click="showModal=true">+ Enregistrer une vente</button>
    </div>
  </div>
  <div class="card" style="background:var(--bg)">
    <div class="grid-3" style="margin-bottom:0;gap:14px">
      <div style="text-align:center;padding:16px;background:var(--card);border-radius:10px;border:1px solid var(--border)"><div style="font-size:11px;color:var(--soft);margin-bottom:4px">TOTAL VENDU</div><div style="font-family:var(--font-display);font-size:22px">0 FCFA</div></div>
      <div style="text-align:center;padding:16px;background:var(--card);border-radius:10px;border:1px solid var(--border)"><div style="font-size:11px;color:var(--soft);margin-bottom:4px">ENCAISSÉ</div><div style="font-family:var(--font-display);font-size:22px;color:var(--success)">0 FCFA</div></div>
      <div style="text-align:center;padding:16px;background:var(--card);border-radius:10px;border:1px solid var(--border)"><div style="font-size:11px;color:var(--soft);margin-bottom:4px">EN ATTENTE</div><div style="font-family:var(--font-display);font-size:22px;color:var(--warn)">0 FCFA</div></div>
    </div>
  </div>

  <!-- Modal vente -->
  <div class="modal-overlay" :class="{open:showModal}" @click.self="showModal=false">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">Enregistrer une vente</div>
        <button class="modal-close" @click="showModal=false"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div class="grid-2" style="gap:12px">
        <div class="form-group"><label class="form-label">Date de vente</label><input class="form-input" type="date" value="2026-03-19"/></div>
        <div class="form-group"><label class="form-label">Lot</label><select class="form-select"><option>Lot A</option><option>Lot B</option><option>Lot C</option></select></div>
      </div>
      <div class="grid-2" style="gap:12px">
        <div class="form-group"><label class="form-label">Nb animaux vendus</label><input class="form-input" type="number" placeholder="Ex: 100"/></div>
        <div class="form-group"><label class="form-label">Prix unitaire (FCFA)</label><input class="form-input" type="number" placeholder="Ex: 2500"/></div>
      </div>
      <div class="form-group"><label class="form-label">Acheteur</label><input class="form-input" placeholder="Nom de l'acheteur"/></div>
      <div class="form-group"><label class="form-label">Statut paiement</label><select class="form-select"><option>Encaissé</option><option>En attente</option></select></div>
      <div class="modal-footer">
        <button class="btn btn-outline" @click="showModal=false">Annuler</button>
        <button class="btn btn-primary">Enregistrer</button>
      </div>
    </div>
  </div>
</div>
</template>
<script setup>
import { ref } from 'vue'
const showModal = ref(false)
</script>
