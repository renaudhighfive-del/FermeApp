<template>
<div>
  <div class="page-header">
    <h1 class="page-title">Mes tâches</h1>
    <p class="page-subtitle">
      {{ today }}
      <template v-if="activeCampaigns.length > 0">
        · {{ activeCampaigns.length }} {{ activeCampaigns.length > 1 ? 'campagnes' : 'campagne' }} en cours
      </template>
    </p>
  </div>

  <!-- Progression globale -->
  <div class="card mb-gap">
    <div class="flex items-center justify-between mb-12">
      <div class="card-title" style="margin-bottom:0">Progression du jour</div>
      <span style="font-size:13px;font-weight:700;color:var(--primary)">{{ completedCount }} / {{ tasks.length }} tâches</span>
    </div>
    <div class="progress-wrap">
      <div class="progress-track" style="height:12px">
        <div class="progress-fill fill-green" :style="{width: progressPercent + '%'}"></div>
      </div>
    </div>
    <p class="text-soft text-sm" style="margin-top:8px">
      {{ tasks.length - completedCount }} tâches restantes
      <span v-if="nextTask"> · Prochaine : {{ nextTask.name }}</span>
    </p>
  </div>

  <!-- Liste tâches -->
  <div v-if="loading" class="text-center py-20">Chargement...</div>
  <div v-else class="task-list-item" v-for="t in tasks" :key="t.id">
    <div class="task-time">{{ t.time }}</div>
    <div class="task-type-icon" :style="{background:t.iconBg}">
      <svg width="18" height="18" fill="none" :stroke="t.iconColor" stroke-width="1.5" viewBox="0 0 24 24" v-html="t.icon"/>
    </div>
    <div class="task-info">
      <div class="task-name">{{ t.name }}</div>
      <div class="task-meta">{{ t.lot }} · {{ t.desc }}</div>
    </div>
    <span class="badge" :class="t.statusClass">{{ t.status }}</span>
    <button v-if="t.status !== 'Terminé'" class="btn btn-primary btn-sm" @click="markDone(t)" :disabled="t.updating">
      {{ t.updating ? 'Chargement...' : 'Marquer terminé' }}
    </button>
    <button v-else class="btn btn-outline btn-sm" disabled style="opacity:0.5">
      <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      Terminé
    </button>
  </div>
  
  <div v-if="!loading && tasks.length === 0" class="text-soft text-center py-20">
    Aucune tâche assignée pour le moment.
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useNotificationStore } from '../../stores/notification'
import { campaignService, eventService } from '../../services/api'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const activeCampaigns = ref([])
const tasks = ref([])
const loading = ref(true)

const today = computed(() => {
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())
})

const completedCount = computed(() => tasks.value.filter(t => t.status === 'Terminé').length)
const progressPercent = computed(() => tasks.value.length > 0 ? (completedCount.value / tasks.value.length) * 100 : 0)
const nextTask = computed(() => tasks.value.find(t => t.status !== 'Terminé'))

const getTaskIcon = (type) => {
  switch(type) {
    case 'feeding': return { icon: '<path d="M3 11l19-9-9 19-2-8-8-2z"/>', bg: '#FFF7ED', color: '#E07B39' }
    case 'vaccination': return { icon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>', bg: '#FDECEA', color: '#D62828' }
    case 'weight': return { icon: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 6v6h4"/>', bg: '#D4EDDA', color: '#2D6A4F' }
    default: return { icon: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>', bg: '#E2E8F0', color: '#64748B' }
  }
}

const fetchTasks = async () => {
  if (!authStore.user?._id) {
    setTimeout(fetchTasks, 500)
    return
  }

  loading.value = true
  try {
    const campaignsRes = await campaignService.getAll({ status: 'En cours' })
    activeCampaigns.value = campaignsRes.data?.campaigns || []

    const eventRes = await eventService.getAll({ 
      assignedTo: authStore.user?._id,
      // On peut filtrer par date ici si besoin
    })
    
    const events = eventRes.data.events || []

    tasks.value = events.map(e => {
      const iconInfo = getTaskIcon(e.type)
      return {
        id: e._id,
        time: e.dueDate ? new Date(e.dueDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '---',
        name: e.description || e.type,
        lot: e.lot || (e.campaign?.name || '---'),
        desc: e.type.charAt(0).toUpperCase() + e.type.slice(1),
        status: e.status === 'done' ? 'Terminé' : (e.priority === 'urgent' ? 'Urgent' : 'À faire'),
        statusClass: e.status === 'done' ? 'badge-termine' : (e.priority === 'urgent' ? 'badge-urgent' : 'badge-afaire'),
        icon: iconInfo.icon,
        iconBg: iconInfo.bg,
        iconColor: iconInfo.color,
        updating: false
      }
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
  } finally {
    loading.value = false
  }
}

async function markDone(t) { 
  t.updating = true
  try {
    await eventService.update(t.id, { status: 'done' })
    t.status = 'Terminé'
    t.statusClass = 'badge-termine' 
    notificationStore.add('Tâche marquée comme terminée', 'success')
  } catch (error) {
    console.error('Error updating task:', error)
    notificationStore.add('Erreur lors de la mise à jour de la tâche', 'danger')
  } finally {
    t.updating = false
  }
}

onMounted(() => {
  fetchTasks()
})
</script>


