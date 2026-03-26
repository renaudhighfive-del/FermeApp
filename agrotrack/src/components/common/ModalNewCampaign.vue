<template>
  <div class="premium-modal-overlay" :class="{open:open}" @click.self="$emit('close')">
    <div class="premium-modal-container digital-twin-modal">
      <div class="premium-modal-header">
        <div class="premium-modal-title-wrapper">
          <div class="premium-modal-icon icon-campaign">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
          </div>
          <h2 class="premium-modal-title">Nouvelle campagne</h2>
        </div>
        <button class="premium-modal-close magnetic-field" @click="$emit('close')">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="premium-modal-body">
        <div class="form-group">
          <label class="form-label">Nom de la campagne</label>
          <input class="cyber-input" v-model="form.name" placeholder="Ex: Campagne Avril 2026"/>
        </div>

        <div class="form-group">
          <label class="form-label">Département</label>
          <div class="dept-grid">
            <div class="dept-card" :class="{active:form.dept==='vol',vol:true}" @click="form.dept='vol'">
              <div class="dept-icon">
                <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M5 3h14l-7 8-7-8zM5 3l7 18 7-18"/></svg>
              </div>
              <span class="dept-label">Volaille</span>
            </div>
            <div class="dept-card" :class="{active:form.dept==='bet',bet:true}" @click="form.dept='bet'">
              <div class="dept-icon">
                <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="9" r="5"/><path d="M5 20a7 7 0 0 1 14 0"/><path d="M3 9h2m14 0h2"/></svg>
              </div>
              <span class="dept-label">Bétail</span>
            </div>
            <div class="dept-card" :class="{active:form.dept==='pis',pis:true}" @click="form.dept='pis'">
              <div class="dept-icon">
                <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
              <span class="dept-label">Pisciculture</span>
            </div>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Date de début</label>
            <input class="cyber-input" type="date" v-model="form.startDate"/>
          </div>
          <div class="form-group">
            <label class="form-label">Objectif (animaux)</label>
            <input class="cyber-input" type="number" v-model="form.target" placeholder="Ex: 500"/>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Budget initial (FCFA)</label>
          <input class="cyber-input" type="number" v-model="form.budget" placeholder="Ex: 850000"/>
        </div>
      </div>

      <div class="premium-modal-footer">
        <button class="cyber-btn cyber-btn-ghost magnetic-field" @click="$emit('close')">Annuler</button>
        <button class="cyber-btn cyber-btn-primary magnetic-field" @click="create">Créer la campagne</button>
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
/* Premium Modal Overlay */
.premium-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal);
    padding: var(--gap-lg);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.premium-modal-overlay.open {
    opacity: 1;
    visibility: visible;
}

/* Digital Twin Modal Container */
.digital-twin-modal {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: var(--border-thin) solid var(--glass-border);
    border-radius: var(--radius-xl);
    max-width: 480px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    transform: scale(0.9) translateY(20px);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: var(--shadow-2xl);
}

.premium-modal-overlay.open .digital-twin-modal {
    transform: scale(1) translateY(0);
}

/* Modal Header */
.premium-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--gap-xl);
    border-bottom: var(--border-thin) solid var(--glass-border);
}

.premium-modal-title-wrapper {
    display: flex;
    align-items: center;
    gap: var(--gap-md);
}

.premium-modal-icon {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-campaign {
    background: var(--primary-light);
    color: var(--primary);
    box-shadow: 0 0 20px rgba(10, 77, 60, 0.3);
}

.premium-modal-title {
    font-family: var(--font-heading);
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
}

.premium-modal-close {
    background: transparent;
    border: none;
    color: var(--text-tertiary);
    padding: var(--gap-sm);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition-base);
}

.premium-modal-close:hover {
    color: var(--text-primary);
    background: var(--glass-bg);
}

/* Modal Body */
.premium-modal-body {
    padding: var(--gap-xl);
}

/* Form Groups */
.form-group {
    margin-bottom: var(--gap-lg);
}

.form-label {
    display: block;
    font-family: var(--font-heading);
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--gap-sm);
}

/* Cyber Input */
.cyber-input {
    width: 100%;
    padding: 12px 16px;
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    border: var(--border-thin) solid var(--glass-border);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 14px;
    transition: var(--transition-base);
}

.cyber-input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1), var(--glow-accent);
}

.cyber-input::placeholder {
    color: var(--text-tertiary);
}

/* Department Grid */
.dept-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--gap-md);
}

.dept-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--gap-lg);
    background: var(--glass-bg);
    border: var(--border-thin) solid var(--glass-border);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: var(--transition-base);
}

.dept-card:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
    box-shadow: var(--glass-shadow);
}

.dept-card.active {
    border-width: 2px;
}

.dept-card.vol.active {
    border-color: var(--vol);
    background: rgba(196, 94, 26, 0.1);
    box-shadow: 0 0 20px rgba(196, 94, 26, 0.2);
}

.dept-card.bet.active {
    border-color: var(--bet);
    background: rgba(94, 58, 26, 0.1);
    box-shadow: 0 0 20px rgba(94, 58, 26, 0.2);
}

.dept-card.pis.active {
    border-color: var(--pis);
    background: rgba(14, 77, 110, 0.1);
    box-shadow: 0 0 20px rgba(14, 77, 110, 0.2);
}

.dept-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-tertiary);
    color: var(--text-secondary);
    transition: var(--transition-base);
}

.dept-card.active .dept-icon {
    color: inherit;
    background: currentColor;
    background-opacity: 0.2;
}

.dept-card.vol.active .dept-icon {
    background: var(--vol);
    color: white;
}

.dept-card.bet.active .dept-icon {
    background: var(--bet);
    color: white;
}

.dept-card.pis.active .dept-icon {
    background: var(--pis);
    color: white;
}

.dept-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    transition: var(--transition-base);
}

.dept-card.active .dept-label {
    color: var(--text-primary);
}

/* Form Grid */
.form-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--gap-md);
}

/* Modal Footer */
.premium-modal-footer {
    display: flex;
    gap: var(--gap-md);
    padding: var(--gap-xl);
    border-top: var(--border-thin) solid var(--glass-border);
}

/* Cyber Buttons */
.cyber-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-sm);
    padding: var(--gap-md) var(--gap-xl);
    border: none;
    border-radius: var(--radius-md);
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: var(--transition-base);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    flex: 1;
}

.cyber-btn-ghost {
    background: transparent;
    color: var(--text-secondary);
    border: var(--border-thin) solid var(--glass-border);
}

.cyber-btn-ghost:hover {
    background: var(--glass-bg);
    color: var(--text-primary);
    border-color: var(--accent);
}

.cyber-btn-primary {
    background: var(--gradient-primary);
    color: var(--text-inverse);
    box-shadow: var(--shadow-md);
}

.cyber-btn-primary:hover {
    box-shadow: var(--glow-primary);
    transform: translateY(-2px);
}

/* Magnetic Field */
.magnetic-field {
    transition: var(--transition-slow);
}

.magnetic-field:hover {
    transform: scale(1.02);
}

/* Responsive */
@media (max-width: 640px) {
    .premium-modal-overlay {
        padding: var(--gap-md);
    }
    
    .dept-grid {
        grid-template-columns: 1fr;
    }
    
    .dept-card {
        flex-direction: row;
        justify-content: flex-start;
    }
    
    .form-grid-2 {
        grid-template-columns: 1fr;
    }
    
    .premium-modal-footer {
        flex-direction: column;
    }
}
</style>
