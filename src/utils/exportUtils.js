export function exportActivitiesToJSON(activities, filename = 'hobby-explorer-bucketlist.json') {
  const jsonStr = JSON.stringify(activities, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportActivitiesToCSV(activities, filename = 'hobby-explorer-bucketlist.csv') {
  if (!activities || activities.length === 0) return;

  const headers = [
    'ID',
    'Title',
    'Category',
    'Organizer',
    'Location Name',
    'Province',
    'Country',
    'Timeframe',
    'Next Date',
    'Cost',
    'Difficulty',
    'Fitness Level',
    'Rating',
    'Official Link'
  ];

  const rows = activities.map(act => [
    `"${act.id}"`,
    `"${act.title.replace(/"/g, '""')}"`,
    `"${act.categoryLabel.replace(/"/g, '""')}"`,
    `"${act.organizer.replace(/"/g, '""')}"`,
    `"${act.location.name.replace(/"/g, '""')}"`,
    `"${act.location.province}"`,
    `"${act.location.country}"`,
    `"${act.timeframe}"`,
    `"${act.nextDate.replace(/"/g, '""')}"`,
    `"${act.cost.text.replace(/"/g, '""')}"`,
    `"${act.difficulty.replace(/"/g, '""')}"`,
    `"${act.fitnessLevel.replace(/"/g, '""')}"`,
    `"${act.rating}"`,
    `"${act.officialUrl}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
