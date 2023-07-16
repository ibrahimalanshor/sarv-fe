<script setup>
import { computed } from 'vue';
import { useString } from 'src/composes/resource.compose';
import BaseTitle from './base-title.vue';
import BaseSkeleton from './base-skeleton.vue';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  titleFromResource: {
    type: Boolean,
    default: false,
  },
  titleLoading: {
    type: Boolean,
    default: false,
  },
});

const { getString } = useString();

const title = computed(() => {
  return props.titleFromResource ? getString(props.title) : props.title;
});
</script>

<template>
  <header class="bg-white shadow">
    <div
      class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between"
    >
      <base-skeleton class="w-1/4 !h-10" v-if="props.titleLoading" />
      <base-title v-else :level="3">{{ title }}</base-title>
      <slot name="action" />
    </div>
  </header>
</template>
