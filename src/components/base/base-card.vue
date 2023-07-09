<script setup>
import BaseTitle from './base-title.vue';
const props = defineProps({
  withHeader: {
    type: Boolean,
    default: false,
  },
  withFooter: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: null,
  },
  classes: {
    type: Object,
    default: () => ({
      base: '',
    }),
  },
});
</script>

<template>
  <div :class="['bg-white rounded-lg shadow', props.classes.base]">
    <div
      v-if="props.withHeader"
      class="border-b rounded-t-lg border-gray-200 bg-white px-4 py-5 sm:px-6 flex items-center justify-between"
    >
      <base-title :level="6" semibold>{{ title }}</base-title>
      <slot name="header-actions" />
    </div>
    <div class="px-4 py-4 sm:px-6">
      <slot />
    </div>
    <div
      v-if="props.withFooter"
      class="border-t rounded-b-lg border-gray-200 bg-white px-4 py-5 sm:px-6"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
