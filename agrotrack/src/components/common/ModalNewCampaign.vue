<template>
  <div class="modal-overlay" :class="{open:open}" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">
          <svg width="20" height="20" fill="none" stroke="var(--primary)" stroke-width="1.5" viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
          Nouvelle campagne
        </div>
        <button class="modal-close" @click="$emit('close')">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="form-group">
        <label class="form-label">Nom de la campagne</label>
        <input class="form-input" v-model="form.name" placeholder="Ex: Campagne Avril 2026"/>
      </div>

      <div class="form-group">
        <label class="form-label">Département</label>
        <div class="dept-btns">
          <div class="dept-btn" :class="{sel:form.dept==='vol',vol:true}" @click="form.dept='vol'">
            <svg width="24" height="24" fill="none" :stroke="form.dept==='vol'?'var(--vol)':'var(--soft)'" stroke-width="1.5" viewBox="0 0 24 24"><path d="M5 3h14l-7 8-7-8zM5 3l7 18 7-18"/></svg>
            Volaille
          </div>
          <div class="dept-btn" :class="{sel:form.dept==='bet',bet:true}" @click="form.dept='bet'">
            <svg width="24" height="24" fill="none" :stroke="form.dept==='bet'?'var(--bet)':'var(--soft)'" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="9" r="5"/><path d="M5 20a7 7 0 0 1 14 0"/><path d="M3 9h2m14 0h2"/></svg>
            Bétail
          </div>
          <div class="dept-btn" :class="{sel:form.dept==='pis',pis:true}" @click="form.dept='pis'">
            <svg width="24" height="24" fill="none" :stroke="form.dept==='pis'?'var(--pis)':'var(--soft)'" stroke-width="1.5" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
            Pisciculture
          </div>
        </div>
      </div>

      <div class="grid-2" style="gap:12px">
        <div class="form-group">
          <label class="form-label">Date de début</label>
          <input class="form-input" type="date" v-model="form.startDate"/>
        </div>
        <div class="form-group">
          <label class="form-label">Objectif (animaux)</label>
          <input class="form-input" type="number" v-model="form.target" placeholder="Ex: 500"/>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Budget initial (FCFA)</label>
        <input class="form-input" type="number" v-model="form.budget" placeholder="Ex: 850000"/>
      </div>

      <div class="modal-footer">
        <button class="btn btn-outline" @click="$emit('close')">Annuler</button>
        <button class="btn btn-primary" @click="create">Créer la campagne</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({ open: Boolean })
const emit = defineEmits(['close', 'created'])
const form = ref({ name:'', dept:'', startDate:'', target:'', budget:'' })
function create() {
  if (!form.value.name || !form.value.dept) return alert('Remplissez les champs obligatoires')
  emit('created', { ...form.value })
  emit('close')
  form.value = { name:'', dept:'', startDate:'', target:'', budget:'' }
}
</script>

<style scoped>
.dept-btns { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
.dept-btn {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 14px 10px; border: 1.5px solid var(--border);
  border-radius: 10px; cursor: pointer; font-size: 12px; font-weight: 600;
  color: var(--soft); transition: all 0.15s; text-align: center;
}
.dept-btn:hover { border-color: var(--soft); }
.dept-btn.vol.sel { background: #FEF0E7; border-color: var(--vol); color: var(--vol); }
.dept-btn.bet.sel { background: #F3EBE3; border-color: var(--bet); color: var(--bet); }
.dept-btn.pis.sel { background: #E3EFF5; border-color: var(--pis); color: var(--pis); }
</style>
