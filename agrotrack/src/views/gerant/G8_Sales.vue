<template>
<div>
  <div class="page-header">
    <div class="page-header-row">
      <div>
        <h1 class="page-title">Ventes</h1>
        <p class="page-subtitle" v-if="campaign">{{ campaign.name }}</p>
        <p class="page-subtitle" v-else>Aucune campagne active</p>
      </div>
      <div class="page-actions"><button class="btn btn-primary" @click="showModal=true" :disabled="!campaign"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Enregistrer vente</button></div>
    </div>
  </div>

  <div v-if="!campaign" class="card" style="text-align: center; padding: 40px;">
    <p class="text-soft" style="font-size: 16px;">Aucune campagne active</p>
    <RouterLink to="/gerant/campaigns" class="btn btn-primary" style="margin-top: 20px;">Voir les campagnes</RouterLink>
  </div>

  <div v-else>
    <div class="card mb-gap" v-if="sales.length === 0">
      <div class="empty-state" style="padding:48px">
        <svg width="60" height="60" fill="none" stroke="#E8D9C5" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <p style="font-size:15px;margin-bottom:6px">Aucune vente enregistrée</p>
        <p class="text-sm" style="margin-bottom:20px">Les ventes seront affichées ici une fois enregistrées</p>
        <button class="btn btn-primary" @click="showModal=true">+ Enregistrer une vente</button>
      </div>
    </div>

    <div class="card" v-else style="background:var(--bg);margin-bottom:16px;overflow-x:auto">
      <table class="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Lot</th>
            <th>Nb vendus</th>
            <th>Prix unitaire</th>
            <th>Total</th>
            <th>Acheteur</th>
            <th>Paiement</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sale in sales" :key="sale._id">
            <td>{{ formatDate(sale.date) }}</td>
            <td>{{ sale.lot || '-' }}</td>
            <td>{{ sale.quantity }}</td>
            <td>{{ formatCurrency(sale.unitPrice) }}</td>
            <td class="fw-600">{{ formatCurrency(sale.quantity * sale.unitPrice) }}</td>
            <td>{{ sale.buyer || '-' }}</td>
            <td><span :class="getPaymentClass(sale.paymentStatus)">{{ sale.paymentStatus }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card" style="background:var(--bg)" v-if="sales.length > 0">
      <div class="grid-3" style="margin-bottom:0;gap:14px">
        <div style="text-align:center;padding:16px;background:var(--card);border-radius:10px;border:1px solid var(--border)"><div style="font-size:11px;color:var(--soft);margin-bottom:4px">TOTAL VENDU</div><div style="font-family:var(--font-display);font-size:22px">{{ formatCurrency(totalSold) }}</div></div>
        <div style="text-align:center;padding:16px;background:var(--card);border-radius:10px;border:1px solid var(--border)"><div style="font-size:11px;color:var(--soft);margin-bottom:4px">ENCAISSÉ</div><div style="font-family:var(--font-display);font-size:22px;color:var(--success)">{{ formatCurrency(collected) }}</div></div>
        <div style="text-align:center;padding:16px;background:var(--card);border-radius:10px;border:1px solid var(--border)"><div style="font-size:11px;color:var(--soft);margin-bottom:4px">EN ATTENTE</div><div style="font-family:var(--font-display);font-size:22px;color:var(--warn)">{{ formatCurrency(pending) }}</div></div>
      </div>
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
        <div class="form-group"><label class="form-label">Date de vente</label><input class="form-input" type="date" v-model="formData.date"/></div>
        <div class="form-group"><label class="form-label">Lot</label><input class="form-input" v-model="formData.lot" placeholder="Ex: Lot A"/></div>
      </div>
      <div class="grid-2" style="gap:12px">
        <div class="form-group"><label class="form-label">Nb animaux vendus</label><input class="form-input" type="number" v-model="formData.quantity" placeholder="Ex: 100"/></div>
        <div class="form-group"><label class="form-label">Prix unitaire (FCFA)</label><input class="form-input" type="number" v-model="formData.unitPrice" placeholder="Ex: 2500"/></div>
      </div>
      <div class="form-group"><label class="form-label">Acheteur</label><input class="form-input" v-model="formData.buyer" placeholder="Nom de l'acheteur"/></div>
      <div class="form-group"><label class="form-label">Statut paiement</label><select class="form-select" v-model="formData.paymentStatus"><option value="Encaissé">Encaissé</option><option value="En attente">En attente</option></select></div>
      <div class="modal-footer">
        <button class="btn btn-outline" @click="showModal=false">Annuler</button>
        <button class="btn btn-primary" @click="submitSale" :disabled="isLoading">{{ isLoading ? 'Enregistrement...' : 'Enregistrer' }}</button>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGerantStore } from '@/stores/gerant'
import { saleService } from '@/services/api'

const gerantStore = useGerantStore()
const campaign = computed(() => gerantStore.activeCampaigns[0] || null)
const sales = ref([])
const isLoading = ref(false)
const showModal = ref(false)

const formData = ref({
  date: new Date().toISOString().split('T')[0],
  lot: '',
  quantity: '',
  unitPrice: '',
  buyer: '',
  paymentStatus: 'Encaissé'
})

const totalSold = computed(() => {
  return sales.value.reduce((sum, sale) => sum + (sale.quantity * sale.unitPrice), 0)
})

const collected = computed(() => {
  return sales.value
    .filter(s => s.paymentStatus === 'Encaissé')
    .reduce((sum, sale) => sum + (sale.quantity * sale.unitPrice), 0)
})

const pending = computed(() => {
  return sales.value
    .filter(s => s.paymentStatus === 'En attente')
    .reduce((sum, sale) => sum + (sale.quantity * sale.unitPrice), 0)
})

onMounted(async () => {
  if (campaign.value) {
    try {
      const res = await saleService.getAll({ campaign: campaign.value._id, limit: 100 })
      sales.value = res.data || []
    } catch (error) {
      console.error('Error loading sales:', error)
    }
  }
})

async function submitSale() {
  if (!campaign.value || !formData.value.quantity || !formData.value.unitPrice) {
    alert('Veuillez remplir tous les champs obligatoires')
    return
  }
  
  try {
    isLoading.value = true
    await saleService.create({
      campaign: campaign.value._id,
      ...formData.value,
      quantity: parseInt(formData.value.quantity),
      unitPrice: parseFloat(formData.value.unitPrice)
    })
    
    // Reload sales
    const res = await saleService.getAll({ campaign: campaign.value._id, limit: 100 })
    sales.value = res.data || []
    
    // Reset form and close modal
    formData.value = {
      date: new Date().toISOString().split('T')[0],
      lot: '',
      quantity: '',
      unitPrice: '',
      buyer: '',
      paymentStatus: 'Encaissé'
    }
    showModal.value = false
  } catch (error) {
    console.error('Error creating sale:', error)
    alert('Erreur lors de l\'enregistrement de la vente')
  } finally {
    isLoading.value = false
  }
}

function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR')
}

function formatCurrency(value) {
  if (!value) return '0 FCFA'
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M FCFA`
  return `${(value / 1000).toFixed(0)}k FCFA`
}

function getPaymentClass(status) {
  if (status === 'Encaissé') return 'badge badge-success'
  return 'badge badge-warn'
}
</script>
