<template>
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg)">
    <div style="text-align:center;max-width:400px">
      <div style="width:80px;height:80px;background:#FDECEA;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 24px">
        <svg width="36" height="36" fill="none" stroke="var(--danger)" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      </div>
      <h1 style="font-family:var(--font-display);font-size:28px;margin-bottom:8px">Accès refusé</h1>
      <p style="color:var(--soft);font-size:14px;margin-bottom:24px">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      <button class="btn btn-primary" @click="router.back()">← Retour</button>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
