export function dateToLabel(value: string): string {
  if (!value) return '';
  const [y, m, d] = value.split('-');
  const year = Number(y);
  const monthIndex = Number(m) - 1;
  const day = Number(d);

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(monthIndex) ||
    !Number.isFinite(day) ||
    monthIndex < 0 ||
    monthIndex > 11 ||
    day < 1 ||
    day > 31
  ) {
    return '';
  }

  return new Date(year, monthIndex, day).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateRange(start: string, end: string): string {
  const startLabel = dateToLabel(start);
  if (!startLabel) return '';

  if (!end) {
    return `${startLabel} – Present`;
  }

  const endLabel = dateToLabel(end);
  if (!endLabel) return `${startLabel} – ${end}`;
  return `${startLabel} – ${endLabel}`;
}

