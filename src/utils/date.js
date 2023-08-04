import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

export function fromDate(date = null) {
  return dayjs().from(date);
}

export function toDate(date = null) {
  return dayjs().to(date);
}

export function formatDate(date, format = 'LLL') {
  return dayjs(date).format(format);
}

export function startOf(date = null, unit = 'd') {
  return dayjs(date).startOf(unit).format();
}

export function endOf(date = null, unit = 'd') {
  return dayjs(date).endOf(unit).format();
}

export function addDay(date = null, value) {
  return dayjs(date).add(value, 'day');
}
