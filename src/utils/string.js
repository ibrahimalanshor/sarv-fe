export function capitalize(str) {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

export function isValidUrl(str) {
  return str.startsWith('https://');
}
