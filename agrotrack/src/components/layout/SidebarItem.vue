<template>
  <RouterLink :to="to" custom v-slot="{ isActive, navigate }">
    <div 
      class="sidebar-item" 
      :class="{ 'active': isActive }" 
      @click="navigate"
    >
      <div class="item-icon-wrapper">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" v-html="icons[icon] || icons['grid']"></svg>
      </div>
      <span class="item-label">{{ label }}</span>
      <div class="active-indicator"></div>
    </div>
  </RouterLink>
</template>

<script setup>
defineProps({ icon: String, label: String, to: String })

const icons = {
  dashboard: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  grid:     '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  campaigns: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
  flag:     '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
  animal:   '<circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/><path d="M4 16c0-1.1.9-2 2-2h.5M20 16c0-1.1-.9-2-2-2h-.5"/>',
  animals:  '<circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/><path d="M4 16c0-1.1.9-2 2-2h.5M20 16c0-1.1-.9-2-2-2h-.5"/>',
  health:   '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  food:     '<path d="M3 11l19-9-9 19-2-8-8-2z"/>',
  chart:    '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  finance:  '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  sales:    '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
  box:      '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  stock:    '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  users:    '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  reports:  '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  tasks:    '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  saisie:   '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  alert:    '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  farms:    '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
}
</script>

<style scoped>
/* Sidebar Item - Digital Twin Style */
.sidebar-item {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--gap-sm) var(--gap-md);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition-base);
    position: relative;
    overflow: hidden;
    color: var(--text-secondary);
    background: transparent;
    border: var(--border-thin) solid transparent;
}

.sidebar-item:hover {
    background: var(--glass-bg);
    border-color: var(--glass-border);
    color: var(--text-primary);
    transform: translateX(4px);
}

.sidebar-item.active {
    background: var(--primary-light);
    color: var(--primary);
    border-color: var(--primary);
    box-shadow: var(--glow-primary);
}

/* Icon Wrapper */
.item-icon-wrapper {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    flex-shrink: 0;
    transition: var(--transition-base);
}

.sidebar-item:hover .item-icon-wrapper {
    background: rgba(var(--primary-rgb, 10, 77, 60), 0.1);
}

.sidebar-item.active .item-icon-wrapper {
    background: var(--primary);
    color: var(--text-inverse);
}

/* Item Label */
.item-label {
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
}

.sidebar-item.active .item-label {
    font-weight: 600;
}

/* Active Indicator */
.active-indicator {
    width: 4px;
    height: 20px;
    background: var(--accent);
    border-radius: var(--radius-full);
    opacity: 0;
    transform: scaleY(0);
    transition: var(--transition-base);
}

.sidebar-item.active .active-indicator {
    opacity: 1;
    transform: scaleY(1);
    box-shadow: 0 0 10px var(--accent);
}
</style>