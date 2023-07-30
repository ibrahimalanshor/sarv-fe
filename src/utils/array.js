export function conditionalElement(when, value) {
  return when ? [value] : [];
}
