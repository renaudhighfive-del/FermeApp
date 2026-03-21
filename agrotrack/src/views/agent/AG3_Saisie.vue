<template>
<div>
  <div class="page-header">
    <h1 class="page-title">Nouvelle saisie</h1>
    <p class="page-subtitle">Campagne Mars 2026 · {{ new Date().toLocaleDateString('fr-FR') }}</p>
  </div>

  <!-- Étape 1 : Campagne -->
  <div class="card mb-gap">
    <div class="card-title">
      <svg width="16" height="16" fill="none" stroke="var(--accent)" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
      Étape 1 — Sélection campagne
    </div>
    <select class="form-select w-full">
      <option selected>Campagne Mars 2026</option>
      <option>Carpes Bassin 2</option>
    </select>
  </div>

  <!-- Étape 2 : Type de saisie -->
  <div class="card mb-gap">
    <div class="card-title">Étape 2 — Type de saisie</div>
    <div class="radio-grid">
      <div class="radio-opt" :class="{sel:saisieType==='pesee'}" @click="saisieType='pesee'">
        <svg width="22" height="22" fill="none" :stroke="saisieType==='pesee'?'#fff':'var(--soft)'" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 6v6h4"/></svg>
        Pesée
      </div>
      <div class="radio-opt" :class="{sel:saisieType==='alim'}" @click="saisieType='alim'">
        <svg width="22" height="22" fill="none" :stroke="saisieType==='alim'?'#fff':'var(--soft)'" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
        Alimentation
      </div>
      <div class="radio-opt" :class="{sel:saisieType==='sante'}" @click="saisieType='sante'">
        <svg width="22" height="22" fill="none" :stroke="saisieType==='sante'?'#fff':'var(--soft)'" stroke-width="1.5" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        Santé
      </div>
      <div class="radio-opt" :class="{sel:saisieType==='mort'}" @click="saisieType='mort'">
        <svg width="22" height="22" fill="none" :stroke="saisieType==='mort'?'#fff':'var(--soft)'" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        Mortalité
      </div>
      <div class="radio-opt" :class="{sel:saisieType==='vacc'}" @click="saisieType='vacc'">
        <svg width="22" height="22" fill="none" :stroke="saisieType==='vacc'?'#fff':'var(--soft)'" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        Vaccination
      </div>
    </div>
  </div>

  <!-- Formulaire dynamique -->
  <div class="card mb-gap">
    <div class="card-title">Étape 3 — Saisie des données</div>

    <!-- Pesée -->
    <div v-if="saisieType==='pesee'">
      <div class="form-group">
        <label class="form-label">ID Animal</label>
        <div class="input-with-btn">
          <input class="form-input" v-model="form.animalId" placeholder="#VOL-001"/>
          <div class="input-action-btn">
            <svg width="18" height="18" fill="none" stroke="var(--primary)" stroke-width="1.5" viewBox="0 0 24 24"><rect x="2" y="2" width="5" height="5"/><rect x="17" y="2" width="5" height="5"/><rect x="2" y="17" width="5" height="5"/><path d="M10 2h1v1h-1zm2 0h1v1h-1zM2 10h1v1H2zm0 2h1v1H2z"/></svg>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Poids (grammes)</label>
        <input class="form-input" type="number" v-model="form.weight" placeholder="Ex: 1350"/>
      </div>
      <div class="form-group">
        <label class="form-label">Date et heure</label>
        <input class="form-input" :value="now" readonly style="background:var(--bg);color:var(--soft)"/>
      </div>
      <div class="form-group">
        <label class="form-label">Observation</label>
        <textarea class="form-input form-textarea" v-model="form.obs" placeholder="Comportement, anomalie visible..."></textarea>
      </div>
    </div>

    <!-- Alimentation -->
    <div v-if="saisieType==='alim'">
      <div class="form-group"><label class="form-label">Lot concerné</label><select class="form-select w-full"><option>Lot A</option><option>Lot B</option><option>Lot C</option><option>Tous les lots</option></select></div>
      <div class="form-group"><label class="form-label">Quantité (kg)</label><input class="form-input" type="number" placeholder="Ex: 15"/></div>
      <div class="form-group"><label class="form-label">Type d'aliment</label><select class="form-select w-full"><option>Granulés croissance</option><option>Granulés démarrage</option><option>Complément minéral</option></select></div>
      <div class="form-group"><label class="form-label">Observation</label><textarea class="form-input form-textarea" placeholder="Observations sur la distribution..."></textarea></div>
    </div>

    <!-- Mortalité -->
    <div v-if="saisieType==='mort'">
      <div class="form-group">
        <label class="form-label">ID Animal</label>
        <div class="input-with-btn"><input class="form-input" placeholder="#VOL-001"/><div class="input-action-btn"><svg width="18" height="18" fill="none" stroke="var(--primary)" stroke-width="1.5" viewBox="0 0 24 24"><rect x="2" y="2" width="5" height="5"/><rect x="17" y="2" width="5" height="5"/><rect x="2" y="17" width="5" height="5"/></svg></div></div>
      </div>
      <div class="form-group"><label class="form-label">Cause présumée</label><select class="form-select w-full"><option>Cause inconnue</option><option>Maladie</option><option>Accident</option><option>Prédateur</option><option>Stress thermique</option></select></div>
      <div class="form-group"><label class="form-label">Nombre d'animaux</label><input class="form-input" type="number" placeholder="1" value="1"/></div>
      <div class="form-group"><label class="form-label">Photo (optionnel)</label><input class="form-input" type="file" accept="image/*"/></div>
      <div class="form-group"><label class="form-label">Observation</label><textarea class="form-input form-textarea" placeholder="Détaillez les circonstances..."></textarea></div>
    </div>

    <!-- Vaccination -->
    <div v-if="saisieType==='vacc'">
      <div class="form-group">
        <label class="form-label">ID Animal / Lot</label>
        <div class="input-with-btn"><input class="form-input" placeholder="#VOL-001 ou Lot C"/><div class="input-action-btn"><svg width="18" height="18" fill="none" stroke="var(--primary)" stroke-width="1.5" viewBox="0 0 24 24"><rect x="2" y="2" width="5" height="5"/><rect x="17" y="2" width="5" height="5"/><rect x="2" y="17" width="5" height="5"/></svg></div></div>
      </div>
      <div class="form-group"><label class="form-label">Vaccin</label><select class="form-select w-full"><option>Newcastle</option><option>Gumboro</option><option>Marek</option><option>Bronchite infectieuse</option></select></div>
      <div class="form-group"><label class="form-label">Numéro de lot vaccin</label><input class="form-input" placeholder="Ex: VAC-2026-03"/></div>
      <div class="form-group"><label class="form-label">Dose</label><input class="form-input" placeholder="Ex: 1 dose par animal"/></div>
      <div class="form-group"><label class="form-label">Prochain rappel</label><input class="form-input" type="date"/></div>
    </div>

    <!-- Santé -->
    <div v-if="saisieType==='sante'">
      <div class="form-group">
        <label class="form-label">ID Animal</label>
        <div class="input-with-btn"><input class="form-input" placeholder="#VOL-001"/><div class="input-action-btn"><svg width="18" height="18" fill="none" stroke="var(--primary)" stroke-width="1.5" viewBox="0 0 24 24"><rect x="2" y="2" width="5" height="5"/><rect x="17" y="2" width="5" height="5"/><rect x="2" y="17" width="5" height="5"/></svg></div></div>
      </div>
      <div class="form-group"><label class="form-label">Type d'observation</label><select class="form-select w-full"><option>Observation générale</option><option>Symptôme maladie</option><option>Blessure</option><option>Anomalie comportementale</option></select></div>
      <div class="form-group"><label class="form-label">Description</label><textarea class="form-input form-textarea" placeholder="Décrivez les symptômes observés..."></textarea></div>
    </div>
  </div>

  <!-- Indicateur connexion + Bouton submit -->
  <div class="flex items-center justify-between mb-gap">
    <div class="status-indicator">
      <div class="status-dot status-online"></div>
      <span>En ligne · Synchronisé</span>
    </div>
  </div>

  <button class="btn btn-primary btn-full btn-lg" @click="submit" style="height:52px;font-size:15px;margin-bottom:var(--gap)">
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
    Enregistrer la saisie
  </button>
</div>
</template>

<script setup>
import { ref, computed } from 'vue'
const saisieType = ref('pesee')
const form = ref({ animalId: '', weight: '', obs: '' })
const now = computed(() => {
  return new Date().toLocaleDateString('fr-FR') + ' · ' + new Date().toLocaleTimeString('fr-FR', {hour:'2-digit',minute:'2-digit'})
})
function submit() { alert('Saisie enregistrée avec succès !') }
</script>
