<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { animalService, campaignService, eventService } from '@/services/api'
import { formatCurrency, formatDate, getHealthClass, getEventBadgeClass } from '@/utils/formatters'
import QRCode from 'qrcode'
import ModalEditAnimal from '@/components/common/ModalEditAnimal.vue'

const router = useRouter()
const route = useRoute()

const animal = ref(null)
const campaign = ref(null)
const events = ref([])
const loading = ref(false)
const error = ref(null)
const activeTab = ref('general')
const showQRModal = ref(false)
const showEditModal = ref(false)
const qrCodeDataURL = ref('')

onMounted(async () => {
  await loadAnimalData()
})

async function loadAnimalData() {
  loading.value = true
  error.value = null

  try {
    const animalId = route.params.id
    const response = await animalService.getById(animalId)
    animal.value = response.data

    // Charger la campagne associée si nécessaire
    if (animal.value.campaign) {
      const campaignId = typeof animal.value.campaign === 'object' ? animal.value.campaign._id : animal.value.campaign;
      const campRes = await campaignService.getById(campaignId);
      campaign.value = campRes.data;
    }

    // Charger l'historique des événements
    const eventsRes = await eventService.getAll({ animal: animalId, limit: 100 });
    events.value = eventsRes.data.events || [];

    // Générer le QR code immédiatement
    if (animal.value) {
      qrCodeDataURL.value = await generateQRCode(animal.value.idNumber || animal.value._id)
    }
  } catch (err) {
    error.value = 'Erreur lors du chargement de l\'animal'
    console.error(err)
  } finally {
    loading.value = false
  }
}



async function showQRCode() {
  showQRModal.value = true
  // Le QR code est déjà généré au chargement
}

async function generateQRCode(text) {
  try {
    return await QRCode.toDataURL(text, {
      width: 250,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
  } catch (err) {
    console.error('Erreur lors de la génération du QR code:', err)
    return ''
  }
}

function downloadQR() {
  const qrImg = document.querySelector('.qr-code-image')
  if (qrImg && qrImg.src) {
    const link = document.createElement('a')
    link.href = qrImg.src
    link.download = `QR_${animal.value.idNumber || animal.value._id}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

function printQR() {
  const printWindow = window.open('', '_blank')
  const qrImg = document.querySelector('.qr-code-image')
  if (qrImg && qrImg.src) {
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${animal.value.idNumber}</title>
          <style>
            body { text-align: center; font-family: Arial, sans-serif; margin: 20px; }
            img { max-width: 300px; margin: 20px 0; }
            .info { margin-top: 20px; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <h2>QR Code Animal</h2>
          <img src="${qrImg.src}" alt="QR Code" />
          <div class="info">
            <p><strong>ID Animal:</strong> ${animal.value.idNumber}</p>
            <p><strong>Type:</strong> ${animal.value.type || 'N/A'}</p>
            <p><strong>Race:</strong> ${animal.value.breed || 'N/A'}</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }
}

function editAnimal() {
  showEditModal.value = true
}

async function handleAnimalUpdated() {
  await loadAnimalData()
}
</script>
<template>
<div class="page">
  <div class="page-header">
    <div class="page-title">
      <RouterLink to="/gerant/campaigns" class="back-btn">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      </RouterLink>
      Fiche Animal - {{ animal?.idNumber }}
    </div>
    <div class="page-actions">
      <button class="btn btn-outline btn-sm" @click="showQRCode">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="2" y="2" width="5" height="5"/><rect x="17" y="2" width="5" height="5"/><rect x="2" y="17" width="5" height="5"/><path d="M10 2h1v1h-1zm2 0h1v1h-1z"/></svg>
        QR Code
      </button>
      <button class="btn btn-primary btn-sm" @click="editAnimal">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        Modifier
      </button>
    </div>
  </div>

  <div v-if="loading" class="loading-state">
    <div class="spinner"></div>
    <p>Chargement de l'animal...</p>
  </div>

  <div v-else-if="error" class="error-state">
    <svg width="50" height="50" fill="none" stroke="#E8D9C5" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
    <p>{{ error }}</p>
    <RouterLink to="/gerant/campaigns" class="btn btn-primary">Retour aux campagnes</RouterLink>
  </div>

  <div v-else-if="animal" class="animal-fiche">
    <!-- En-tête avec infos principales -->
    <div class="fiche-header">
      <div class="animal-avatar">
        <img v-if="qrCodeDataURL" :src="qrCodeDataURL" alt="QR Code" style="width: 100%; height: 100%; object-fit: contain; padding: 5px;">
        <div v-else class="spinner-sm"></div>
      </div>
      <div class="animal-info">
        <h2>{{ animal.idNumber }}</h2>
        <div class="animal-meta">
          <span class="badge" :class="getHealthClass(animal.healthStatus)">{{ animal.healthStatus }}</span>
          <span class="text-soft">{{ animal.type || 'Type non spécifié' }}</span>
          <span class="text-soft">{{ animal.breed ? `Race: ${animal.breed}` : '' }}</span>
        </div>
        <div class="animal-stats">
          <div class="stat">
            <span class="stat-label">Poids</span>
            <span class="stat-value">{{ animal.weight ? animal.weight.toFixed(2) + ' kg' : '-' }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Lot</span>
            <span class="stat-value">{{ animal.location || '-' }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Vaccins</span>
            <span class="stat-value">{{ animal.vaccinations?.length || 0 }}/4</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Onglets -->
    <div class="tabs">
      <button :class="['tab', { active: activeTab === 'general' }]" @click="activeTab = 'general'">Général</button>
      <button :class="['tab', { active: activeTab === 'health' }]" @click="activeTab = 'health'">Santé</button>
      <button :class="['tab', { active: activeTab === 'feeding' }]" @click="activeTab = 'feeding'">Alimentation</button>
      <button :class="['tab', { active: activeTab === 'history' }]" @click="activeTab = 'history'">Historique</button>
    </div>

    <!-- Contenu des onglets -->
    <div class="tab-content">
      <!-- Général -->
      <div v-if="activeTab === 'general'" class="tab-pane">
        <div class="card">
          <div class="card-title">Informations générales</div>
          <div class="info-grid">
            <div class="info-item">
              <label>ID Animal</label>
              <span>{{ animal.idNumber }}</span>
            </div>
            <div class="info-item">
              <label>Type</label>
              <span>{{ animal.type || '-' }}</span>
            </div>
            <div class="info-item">
              <label>Race</label>
              <span>{{ animal.breed || '-' }}</span>
            </div>
            <div class="info-item">
              <label>Poids actuel</label>
              <span>{{ animal.weight ? animal.weight.toFixed(2) + ' kg' : '-' }}</span>
            </div>
            <div class="info-item">
              <label>Location</label>
              <span>{{ animal.location || '-' }}</span>
            </div>
            <div class="info-item">
              <label>Statut santé</label>
              <span class="badge" :class="getHealthClass(animal.healthStatus)">{{ animal.healthStatus }}</span>
            </div>
            <div class="info-item">
              <label>Date de naissance</label>
              <span>{{ animal.dateOfBirth ? formatDate(animal.dateOfBirth) : '-' }}</span>
            </div>
            <div class="info-item">
              <label>Campagne</label>
              <span>{{ campaign?.name || '-' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Santé -->
      <div v-if="activeTab === 'health'" class="tab-pane">
        <div class="card">
          <div class="card-title">Historique vaccinal</div>
          <div v-if="animal.vaccinations?.length" class="table-wrap">
            <table class="table">
              <thead><tr><th>Vaccin</th><th>Date</th><th>Prochaine dose</th><th>Statut</th></tr></thead>
              <tbody>
                <tr v-for="vacc in animal.vaccinations" :key="vacc._id">
                  <td>{{ vacc.name || vacc.type }}</td>
                  <td>{{ formatDate(vacc.date) }}</td>
                  <td>{{ vacc.nextDose ? formatDate(vacc.nextDose) : '-' }}</td>
                  <td><span class="badge badge-success">Administré</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="empty-state">
            <svg width="40" height="40" fill="none" stroke="#E8D9C5" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
            <p>Aucun vaccin enregistré</p>
          </div>
        </div>
      </div>

      <!-- Alimentation -->
      <div v-if="activeTab === 'feeding'" class="tab-pane">
        <div class="card">
          <div class="card-title">Régime alimentaire</div>
          <div class="empty-state">
            <svg width="40" height="40" fill="none" stroke="#E8D9C5" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <p>Informations d'alimentation non disponibles</p>
          </div>
        </div>
      </div>

      <!-- Historique -->
      <div v-if="activeTab === 'history'" class="tab-pane">
        <div class="card">
          <div class="card-title">Historique des événements</div>
          <div v-if="events.length > 0" class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Assigné à</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="event in events" :key="event._id">
                  <td class="text-soft text-sm">{{ formatDate(event.date || event.createdAt) }}</td>
                  <td><span class="badge" :class="getEventBadgeClass(event.type)">{{ event.type }}</span></td>
                  <td>{{ event.description }}</td>
                  <td class="text-soft text-sm">{{ event.assignedTo?.name || '-' }}</td>
                  <td><span class="badge" :class="event.status === 'done' ? 'badge-sain' : 'badge-observation'">{{ event.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="empty-state">
            <svg width="40" height="40" fill="none" stroke="#E8D9C5" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <p>Aucun événement enregistré</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal QR Code -->
  <div v-if="showQRModal" class="modal-overlay" @click="showQRModal = false">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3>QR Code - {{ animal?.idNumber }}</h3>
        <button class="modal-close" @click="showQRModal = false">×</button>
      </div>
      <div class="modal-body text-center">
        <div style="background: white; padding: 20px; display: inline-block; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 20px;">
          <img class="qr-code-image" :src="qrCodeDataURL" alt="QR Code" style="max-width: 200px; display: block;">
        </div>
        <p class="text-soft mt-16">Scannez ce QR code standard pour accéder à la fiche de l'animal</p>
        <div class="flex gap-12 justify-center mt-24">
          <button class="btn btn-outline" @click="downloadQR">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Télécharger
          </button>
          <button class="btn btn-primary" @click="printQR">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
            </svg>
            Imprimer
          </button>
        </div>
      </div>
    </div>
  </div>

  <ModalEditAnimal 
    v-if="showEditModal"
    :open="showEditModal"
    :animal="animal"
    @close="showEditModal = false"
    @updated="handleAnimalUpdated"
  />
</div>
</template>



<style scoped>
.animal-fiche {
  max-width: 1200px;
  margin: 0 auto;
}

.fiche-header {
  display: flex;
  gap: 24px;
  align-items: center;
  background: var(--card);
  padding: 24px;
  border-radius: var(--radius);
  margin-bottom: var(--gap);
  border: 1px solid var(--border);
}

.animal-avatar {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.animal-info h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--text);
}

.animal-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.animal-stats {
  display: flex;
  gap: 24px;
}

.stat {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: var(--soft);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
}

.tabs {
  display: flex;
  background: var(--card);
  border-radius: var(--radius);
  padding: 4px;
  margin-bottom: var(--gap);
  border: 1px solid var(--border);
}

.tab {
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: var(--soft);
  font-weight: 500;
  border-radius: calc(var(--radius) - 2px);
  cursor: pointer;
  transition: all 0.15s;
}

.tab.active {
  background: var(--primary);
  color: #fff;
}

.tab-content {
  background: var(--card);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  overflow: hidden;
}

.tab-pane {
  padding: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item label {
  font-size: 12px;
  color: var(--soft);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.info-item span {
  font-size: 16px;
  color: var(--text);
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--soft);
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-btn);
  color: var(--soft);
  transition: all 0.15s;
  margin-right: 12px;
}

.back-btn:hover {
  background: var(--bg);
  color: var(--text);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--bg);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.spinner-sm {
  width: 24px;
  height: 24px;
  border: 3px solid var(--bg);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>