<script setup>
import BaseBreadcrumb from 'src/components/base/base-breadcrumb.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useString } from 'src/composes/resource.compose.js';

const route = useRoute();
const { getString } = useString();

const items = computed(() =>
  route.matched
    .filter(
      (item, index, array) =>
        array.findIndex((arrayItem) => arrayItem.path === item.path) === index
    )
    .map((item) => ({
      id: item.name,
      to: item.path,
      name: getString(`pages.${item.meta.title}`),
      paths: route.matched.filter((arrayItem) => arrayItem.path === item.path),
    }))
);
</script>

<template>
  <base-breadcrumb :home-path="{ name: 'index' }" :items="items" />
</template>
