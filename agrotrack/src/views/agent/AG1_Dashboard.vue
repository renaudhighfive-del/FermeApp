<template>
<div>
  <div class="banner mb-gap">
    <svg width="28" height="28" fill="none" stroke="#F2B705" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
    <div class="banner-content">
      <h3>Bonjour {{ authStore.user?.name || 'Agent' }} — {{ today }}</h3>
      <p>
        {{ tasks.length }} tâches assignées aujourd'hui
        <template v-if="activeCampaigns.length > 0">
          · {{ activeCampaigns.length }} {{ activeCampaigns.length > 1 ? 'campagnes actives' : 'campagne active' }}
          <span v-if="activeCampaigns.length === 1"> : {{ activeCampaigns[0].name }}</span>
        </template>
      </p>
    </div>
  </div>

  <!-- Scanner QR bouton XL (Simulation avec un animal par défaut si aucun n'est trouvé) -->
  <RouterLink :to="firstAnimalId ? '/agent/animal/' + firstAnimalId : '/agent/dashboard'" style="display:block;text-decoration:none">
    <button class="btn-xl btn-accent" style="border-radius:var(--radius);border:none;cursor:pointer;font-family:var(--font-body);margin-bottom:var(--gap)">
      <svg width="28" height="28" fill="none" stroke="var(--primary)" stroke-width="1.5" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
      Scanner QR Code Animal
      <small>Voir l'historique d'un animal</small>
    </button>
  </RouterLink>

  <!-- Tâches du jour -->
  <div class="card-title" style="margin-bottom:14px">Mes tâches du jour</div>
  <div class="grid-3 mb-gap">
    <div v-for="task in tasks" :key="task.id" class="task-card" :class="'task-card-' + task.color">
      <div class="task-icon" :style="{background: task.bgColor}">
        <svg width="20" height="20" fill="none" :stroke="task.strokeColor" stroke-width="1.5" viewBox="0 0 24 24" v-html="task.icon"></svg>
      </div>
      <div class="task-title">{{ task.title }}</div>
      <div class="task-sub">{{ task.time }} · {{ task.desc }}</div>
      <span class="badge" :class="'badge-' + task.statusClass">{{ task.statusLabel }}</span>
    </div>
    <div v-if="tasks.length === 0" class="text-soft text-center py-20" style="grid-column: 1 / -1">
      Aucune tâche assignée pour aujourd'hui.
    </div>
  </div>

</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useNotificationStore } from '../../stores/notification'
import { campaignService, healthService, eventService, animalService } from '../../services/api'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const activeCampaigns = ref([])
const tasks = ref([])
const firstAnimalId = ref(null)

const today = computed(() => {
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())
})

const fetchDashboardData = async () => {
  if (!authStore.user?._id) {
    // Si l'utilisateur n'est pas encore chargé, on attend un peu ou on réessaie
    setTimeout(fetchDashboardData, 500)
    return
  }

  try {
    // 1. Fetch active campaigns
    const campaignsRes = await campaignService.getAll({ status: 'En cours' })
    activeCampaigns.value = campaignsRes.data?.campaigns || []
    
    if (activeCampaigns.value.length > 0) {
      // Fetch a first animal from the first campaign to simulate QR scanner
      const animalsRes = await animalService.getAll({ campaign: activeCampaigns.value[0]._id, limit: 1 })
      if (animalsRes.data?.animals?.length > 0) {
        firstAnimalId.value = animalsRes.data.animals[0]._id
      }
    }

    // 2. Fetch real tasks from events
    const eventRes = await eventService.getAll({ 
      assignedTo: authStore.user?._id,
      status: 'pending' // Seulement les tâches à faire pour le dashboard
    })
    
    const events = eventRes.data.events || []

    const getTaskIcon = (type) => {
      switch(type) {
        case 'feeding': return { icon: '<path d="M3 11l19-9-9 19-2-8-8-2z"/>', bg: '#FFF7ED', color: '#E07B39', colorName: 'orange' }
        case 'vaccination': return { icon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>', bg: '#FDECEA', color: '#D62828', colorName: 'red' }
        case 'weight': return { icon: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 6v6h4"/>', bg: '#D4EDDA', color: '#2D6A4F', colorName: 'green' }
        default: return { icon: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>', bg: '#E2E8F0', color: '#64748B', colorName: 'gray' }
      }
    }

    tasks.value = events.map(e => {
      const iconInfo = getTaskIcon(e.type)
      return {
        id: e._id,
        title: e.description || e.type,
        time: e.dueDate ? new Date(e.dueDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '---',
        desc: e.lot || (e.campaign?.name || '---'),
        color: iconInfo.colorName,
        bgColor: iconInfo.bg,
        strokeColor: iconInfo.color,
        icon: iconInfo.icon,
        statusClass: e.priority === 'urgent' ? 'urgent' : 'afaire',
        statusLabel: e.priority === 'urgent' ? 'Urgent' : 'À faire'
      }
    })

    // 3. Fetch vaccinations for alerts and show as toasts
    const vaccRes = await healthService.getUpcomingVaccinations()
    const vaccinations = vaccRes.data || []

    // Show toasts for vaccinations
    vaccinations.forEach((v) => {
      notificationStore.add(`Vaccination en retard: ${v.description}`, 'danger')
    })

    // Show toasts for urgent events
    events.filter(e => e.priority === 'urgent').forEach(e => {
      notificationStore.add(`Tâche urgente: ${e.description || e.type}`, 'warning')
    })

    if (vaccinations.length === 0 && events.filter(e => e.priority === 'urgent').length === 0) {
      notificationStore.add('Tout est à jour !', 'success')
    }

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

