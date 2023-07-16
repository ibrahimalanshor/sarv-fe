export function getAvaiablePriorities() {
  return [
    {
      value: 1,
      name: 'low',
    },
    {
      value: 2,
      name: 'medium',
    },
    {
      value: 3,
      name: 'high',
    },
  ];
}

export function parsePriorityColor(priority) {
  const colors = {
    1: 'green',
    2: 'yellow',
    3: 'red',
  };

  return colors[priority];
}

export function parsePriorityName(priority) {
  const colors = {
    1: 'Low',
    2: 'Medium',
    3: 'High',
  };

  return colors[priority].toLowerCase();
}
