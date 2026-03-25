export function formatCurrency(value) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0 FCFA';
  }
  // Utilise l'API Intl pour un formatage précis et localisé sans arrondir
  return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
}

export function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function extractDay(date) {
  if (!date) return '-';
  return new Date(date).getDate().toString();
}

export function extractMonth(date) {
  if (!date) return '-';
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  return months[new Date(date).getMonth()];
}

export function getDaysRemaining(startDate) {
  if (!startDate) return 0;
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getAnimalPercentage(campaign) {
  if (!campaign || !campaign.initialAnimalCount) return 0;
  return Math.round((campaign.currentAnimalCount / campaign.initialAnimalCount) * 100);
}

export function getBudgetPercentage(campaign) {
  if (!campaign || !campaign.budget) return 0;
  return Math.round((campaign.spent / campaign.budget) * 100);
}

export function formatEventDate(date) {
  if (!date) return '-';
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function getHealthClass(status) {
  const classes = {
    'Sain': 'badge-sain',
    'Malade': 'badge-anomalie',
    'Suspect': 'badge-observation',
    'Décédé': 'badge-urgent'
  };
  return classes[status] || 'badge-inactif';
}

export function getEventBadgeClass(type) {
  const classes = {
    'vaccination': 'badge-encours',
    'treatment': 'badge-pis',
    'mortality': 'badge-anomalie',
    'feeding': 'badge-vol',
    'weight': 'badge-prep',
    'other': 'badge-inactif',
    // Fallback for UI display names
    'Vaccination': 'badge-encours',
    'Traitement': 'badge-pis',
    'Mortalité': 'badge-anomalie',
    'Alimentation': 'badge-vol',
    'Pesée': 'badge-prep',
    'Observation': 'badge-observation'
  };
  return classes[type] || 'badge-inactif';
}

export function getAnimalTypeClass(animalType) {
  const classes = {
    'Volaille': 'badge-vol',
    'Bétail': 'badge-bet',
    'Pisciculture': 'badge-pis'
  };
  return classes[animalType] || '';
}

export function getStatusClass(status) {
  const classes = {
    'En cours': 'badge-encours',
    'Terminée': 'badge-terminee',
    'Préparation': 'badge-prep',
    // G5_Health versions
    'Suivi': 'badge-urgent',
    'Terminé': 'badge-termine',
    'Clôturé': 'badge-terminee'
  };
  return classes[status] || 'badge-inactif';
}

export function getEventTypeClass(type) {
  const classes = {
    'Anomalie': 'badge-anomalie',
    'Vaccination': 'badge-encours',
    'Mortalité': 'badge-danger',
    'Observation': 'badge-observation'
  };
  return classes[type] || 'badge-inactif';
}
