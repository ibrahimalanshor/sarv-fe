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

export function getAvaiableStatuses(options = {}) {
  const { isActive } = options;
  const activeOptions = [
    {
      value: 'todo',
      name: 'Todo',
    },
    {
      value: 'in-progress',
      name: 'In Progress',
    },
  ];
  const inactiveOptions = [
    {
      value: 'pending',
      name: 'Pending',
    },
    {
      value: 'done',
      name: 'Done',
    },
  ];

  if (isActive === null || isActive === undefined) {
    return [...activeOptions, ...inactiveOptions];
  }

  return isActive ? activeOptions : inactiveOptions;
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
  const names = {
    1: 'Low',
    2: 'Medium',
    3: 'High',
  };

  return names[priority].toLowerCase();
}

export function parseStatusColor(color) {
  const colors = {
    todo: 'white',
    pending: 'yellow',
    'in-progress': 'indigo',
    done: 'green',
  };

  return colors[color];
}

export function parseStatusName(status) {
  const names = {
    todo: 'Todo',
    pending: 'Pending',
    'in-progress': 'In Progress',
    done: 'Done',
  };

  return names[status];
}
