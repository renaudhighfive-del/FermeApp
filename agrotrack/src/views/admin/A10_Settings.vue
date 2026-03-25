<template>
<div>
  <div class="page-header">
    <h1 class="page-title">Paramètres système</h1>
    <p class="page-subtitle">Configuration de la plateforme AgroTrack</p>
  </div>

  <div class="card settings-card">
    <div class="settings-section-title">Informations ferme</div>
    <div class="settings-section-desc">Renseignements généraux sur votre exploitation</div>
    <div class="grid-2" style="margin-bottom:16px">
      <div class="form-group" style="margin-bottom:0"><label class="form-label">Nom de la ferme</label><input class="form-input" value="AgroTrack Farm"/></div>
      <div class="form-group" style="margin-bottom:0"><label class="form-label">Localisation</label><input class="form-input" value="Abidjan, Côte d'Ivoire"/></div>
    </div>
    <button class="btn btn-primary btn-sm">Sauvegarder</button>
  </div>

  <div class="card settings-card">
    <div class="settings-section-title">Seuils d'alertes automatiques</div>
    <div class="settings-section-desc">Configurez quand les alertes se déclenchent</div>
    <div class="settings-row"><span>Taux mortalité alerte</span><div class="flex items-center gap-8"><input class="form-input" style="width:80px" value="3"/><span class="text-soft text-sm">%</span></div></div>
    <div class="settings-row"><span>Stock aliment seuil faible</span><div class="flex items-center gap-8"><input class="form-input" style="width:80px" value="50"/><span class="text-soft text-sm">kg</span></div></div>
    <div class="settings-row"><span>Jours avant rappel vaccination</span><div class="flex items-center gap-8"><input class="form-input" style="width:80px" value="7"/><span class="text-soft text-sm">jours</span></div></div>
    <button class="btn btn-primary btn-sm" style="margin-top:12px">Sauvegarder</button>
  </div>

  <div class="card settings-card">
    <div class="settings-section-title">Notifications</div>
    <div class="settings-section-desc">Gérez vos canaux de notification</div>
    <div class="settings-row"><span>Alertes par email</span><button class="toggle on" @click="toggleNotif('email')"></button></div>
    <div class="settings-row"><span>Alertes par SMS</span><button class="toggle on" @click="toggleNotif('sms')"></button></div>
    <div class="settings-row"><span>Rapport hebdomadaire auto</span><button class="toggle" @click="toggleNotif('weekly')"></button></div>
  </div>

  <div class="card settings-card">
    <div class="settings-section-title">Sauvegarde des données</div>
    <div class="settings-section-desc">Exportez et sauvegardez votre base de données</div>
    <div class="flex gap-12">
      <button class="btn btn-primary btn-sm">Sauvegarder maintenant</button>
      <button class="btn btn-outline btn-sm">Télécharger backup</button>
    </div>
  </div>
</div>
</template>
<script setup>
function toggleNotif(type) { console.log('toggle', type) }
</script>
