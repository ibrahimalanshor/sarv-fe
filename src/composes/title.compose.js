import { useRoute } from 'vue-router';
import { useString } from './resource.compose';

export function useTitle() {
  const route = useRoute();
  const { getString } = useString();

  function setTitleFromResource() {
    document.title = getString(`pages.${route.meta.title}`);
  }

  function setTitle(title) {
    document.title = title;
  }

  return { setTitleFromResource, setTitle };
}
