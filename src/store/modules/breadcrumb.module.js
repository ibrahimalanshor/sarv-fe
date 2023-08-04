import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useString } from 'src/composes/resource.compose.js';

export const useBreadcrumb = defineStore('breadcrumb', () => {
  const breadcrumbs = ref([]);

  const route = useRoute();
  const { getString } = useString();

  function setBreadcrumbsFromRouteMeta() {
    breadcrumbs.value = route.matched
      .filter(
        (item, index, array) =>
          array.findIndex((arrayItem) => arrayItem.path === item.path) === index
      )
      .filter((item) => item.meta.breadcrumb ?? true)
      .map((item) => ({
        id: item.name,
        to: item.path,
        name: getString(`pages.${item.meta.title}`),
        paths: route.matched.filter(
          (arrayItem) => arrayItem.path === item.path
        ),
      }));
  }
  function popBreadcrumbs() {
    return breadcrumbs.value.pop();
  }
  function pushBreadcrumbs(data) {
    return breadcrumbs.value.push(data);
  }

  return {
    breadcrumbs,
    popBreadcrumbs,
    pushBreadcrumbs,
    setBreadcrumbsFromRouteMeta,
  };
});
