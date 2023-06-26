import { useString } from 'src/composes/resource.compose';

export function getErrorMessage(err) {
  const { getString } = useString();

  if (err?.response?.data?.message) {
    return err.response.data.message;
  } else if (err.message) {
    return err.message;
  } else {
    return getString('error.client');
  }
}
