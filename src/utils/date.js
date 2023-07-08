import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

export function from(date = null) {
  return dayjs().from(date);
}

export function formatDate(date, format = 'LLL') {
  return dayjs(date).format(format);
}
