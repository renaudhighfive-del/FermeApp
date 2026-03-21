<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div><h1 class="page-title">Gestion Stock global</h1><p class="page-subtitle">Suivi des intrants et fournitures</p></div>
      <div class="page-actions">
        <button class="btn btn-primary">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Ajouter produit
        </button>
      </div>
    </div>
  </div>
  <div class="kpi-grid mb-gap">
    <div class="kpi-card"><div class="kpi-top"><div><div class="kpi-label">Stock total</div><div class="kpi-value">248</div><div class="kpi-sub">références produits</div></div><div class="kpi-icon" style="background:#E3EFF5"><svg width="24" height="24" fill="none" stroke="#1A6B8A" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg></div></div></div>
    <div class="kpi-card"><div class="kpi-top"><div><div class="kpi-label">Alertes stock faible</div><div class="kpi-value" style="color:var(--danger)">7</div><div class="kpi-sub down">produits sous le seuil</div></div><div class="kpi-icon" style="background:#FDECEA"><svg width="24" height="24" fill="none" stroke="#D62828" stroke-width="1.5" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg></div></div></div>
    <div class="kpi-card"><div class="kpi-top"><div><div class="kpi-label">Valeur totale</div><div class="kpi-value">4 800 000</div><div class="kpi-sub">FCFA</div></div><div class="kpi-icon" style="background:#D4EDDA"><svg width="24" height="24" fill="none" stroke="#2D6A4F" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6"/></svg></div></div></div>
    <div class="kpi-card"><div class="kpi-top"><div><div class="kpi-label">Commandes en cours</div><div class="kpi-value">3</div><div class="kpi-sub warn">livraison sous 48h</div></div><div class="kpi-icon" style="background:#FFF7ED"><svg width="24" height="24" fill="none" stroke="#E07B39" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div></div></div>
  </div>
  <div class="card">
    <div class="flex items-center justify-between mb-16">
      <div class="search-wrap">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A6652" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input class="search-input" placeholder="Rechercher un produit..."/>
      </div>
      <select class="filter-select"><option>Toutes catégories</option><option>Aliments</option><option>Médicaments</option><option>Matériel</option></select>
    </div>
    <div class="table-wrap">
      <table class="table">
        <thead><tr><th>Produit</th><th>Catégorie</th><th>Quantité</th><th>Seuil alerte</th><th>Fournisseur</th><th>Statut</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-for="p in products" :key="p.id">
            <td class="fw-600">{{ p.name }}</td>
            <td class="text-soft text-sm">{{ p.cat }}</td>
            <td :class="p.low ? 'stock-low' : ''">{{ p.qty }}</td>
            <td class="text-soft">{{ p.seuil }}</td>
            <td class="text-soft text-sm">{{ p.fournisseur }}</td>
            <td><span class="badge" :class="p.low ? 'badge-anomalie' : 'badge-encours'">{{ p.low ? 'Stock faible' : 'Normal' }}</span></td>
            <td><div class="table-actions"><button class="btn btn-outline btn-sm">Modifier</button><button class="btn btn-primary btn-sm">Commander</button></div></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>
<script setup>
const products = [
  { id:1, name:'Granulés poulet démarrage', cat:'Aliments', qty:'20 kg', seuil:'50 kg', fournisseur:'AgroFeed SA', low:true },
  { id:2, name:'Granulés poulet croissance', cat:'Aliments', qty:'120 kg', seuil:'50 kg', fournisseur:'AgroFeed SA', low:false },
  { id:3, name:'Vaccin Newcastle', cat:'Médicaments', qty:'5 flacons', seuil:'10 flacons', fournisseur:'VétPharm', low:true },
  { id:4, name:'Vaccin Marek', cat:'Médicaments', qty:'15 flacons', seuil:'5 flacons', fournisseur:'VétPharm', low:false },
  { id:5, name:'Antibiotique Amoxicilline', cat:'Médicaments', qty:'2 boîtes', seuil:'5 boîtes', fournisseur:'MedAnim', low:true },
  { id:6, name:'Aliment tilapia granulé', cat:'Aliments', qty:'80 kg', seuil:'30 kg', fournisseur:'AquaFeed', low:false },
]
</script>
