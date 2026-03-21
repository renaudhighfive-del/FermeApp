<template>
  <div>
    <div class="page-header">
      <div class="page-header-row">
        <div>
          <h1 class="page-title">Utilisateurs</h1>
          <p class="page-subtitle">Gérez les accès à AgroTrack</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" @click="showInviteModal=true">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Inviter un utilisateur
          </button>
        </div>
      </div>
    </div>

    <div class="card mb-gap">
      <div class="flex items-center justify-between mb-16">
        <div class="search-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input class="search-input" type="text" placeholder="Rechercher un utilisateur..." v-model="search"/>
        </div>
        <div class="filters-bar" style="margin-bottom:0">
          <div class="filter-group">
            <button class="filter-btn" :class="{active:roleFilter==='tous'}" @click="roleFilter='tous'">Tous</button>
            <button class="filter-btn" :class="{active:roleFilter==='admin'}" @click="roleFilter='admin'">Admin</button>
            <button class="filter-btn" :class="{active:roleFilter==='gerant'}" @click="roleFilter='gerant'">Gérant</button>
            <button class="filter-btn" :class="{active:roleFilter==='agent'}" @click="roleFilter='agent'">Agent</button>
          </div>
        </div>
      </div>

      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Utilisateur</th><th>Email</th><th>Rôle</th>
              <th>Statut</th><th>Dernière connexion</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in filteredUsers" :key="u.id">
              <td>
                <div class="user-cell">
                  <div class="avatar" :class="u.avClass">{{ u.initials }}</div>
                  <div>
                    <div class="user-cell-name">{{ u.name }}</div>
                  </div>
                </div>
              </td>
              <td class="text-soft text-sm">{{ u.email }}</td>
              <td><span class="badge" :class="u.roleClass">{{ u.roleLabel }}</span></td>
              <td><span class="badge" :class="u.statusClass">{{ u.status }}</span></td>
              <td class="text-soft text-sm">{{ u.lastLogin }}</td>
              <td>
                <div class="table-actions">
                  <button class="btn btn-outline btn-sm" @click="editUser(u)">Modifier</button>
                  <button class="btn btn-sm" style="color:var(--soft);background:transparent;border:1px solid var(--border)">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <button class="page-btn active">1</button>
        <button class="page-btn">2</button>
        <button class="page-btn">›</button>
      </div>
    </div>

    <!-- Modal Invitation -->
    <div class="modal-overlay" :class="{open:showInviteModal}" @click.self="showInviteModal=false">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">
            <svg width="20" height="20" fill="none" stroke="var(--primary)" stroke-width="1.5" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            Inviter un utilisateur
          </div>
          <button class="modal-close" @click="showInviteModal=false">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="form-group">
          <label class="form-label">Nom complet</label>
          <input class="form-input" type="text" placeholder="Jean Dupont"/>
        </div>
        <div class="form-group">
          <label class="form-label">Adresse email</label>
          <input class="form-input" type="email" placeholder="jean@agrotrack.com"/>
        </div>
        <div class="form-group">
          <label class="form-label">Rôle</label>
          <select class="form-select">
            <option>Admin</option>
            <option>Gérant</option>
            <option selected>Agent</option>
          </select>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showInviteModal=false">Annuler</button>
          <button class="btn btn-primary">Envoyer l'invitation</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const showInviteModal = ref(false)
const search = ref('')
const roleFilter = ref('tous')

const users = [
  { id:1, name:'Jean Dupont',  initials:'JD', email:'jean@agrotrack.com',  roleLabel:'Admin',  roleClass:'badge-admin',  status:'Actif',   statusClass:'badge-actif',   avClass:'av-purple', lastLogin:'Auj. 09:30',    role:'admin'  },
  { id:2, name:'Marie Koné',   initials:'MK', email:'marie@agrotrack.com', roleLabel:'Gérant', roleClass:'badge-gerant', status:'Actif',   statusClass:'badge-actif',   avClass:'av-blue',   lastLogin:'Auj. 08:15',    role:'gerant' },
  { id:3, name:'Paul Ahoua',   initials:'PA', email:'paul@agrotrack.com',  roleLabel:'Agent',  roleClass:'badge-agent',  status:'Actif',   statusClass:'badge-actif',   avClass:'av-green',  lastLogin:'Hier 16:40',    role:'agent'  },
  { id:4, name:'Awa Traoré',   initials:'AT', email:'awa@agrotrack.com',   roleLabel:'Agent',  roleClass:'badge-agent',  status:'Inactif', statusClass:'badge-inactif', avClass:'av-gray',   lastLogin:'Il y a 5 jours',role:'agent'  },
]

const filteredUsers = computed(() => {
  return users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.value.toLowerCase()) || u.email.toLowerCase().includes(search.value.toLowerCase())
    const matchRole   = roleFilter.value === 'tous' || u.role === roleFilter.value
    return matchSearch && matchRole
  })
})

function editUser(u) { console.log('edit', u) }
</script>
