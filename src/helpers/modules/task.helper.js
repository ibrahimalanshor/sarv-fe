export function getAvaiablePriorities() {
  return ['low', 'medium', 'high'];
}

export function parsePriorityColor(priority) {
  const colors = {
    low: 'green',
    medium: 'yellow',
    high: 'red',
  };

  return colors[priority];
}
