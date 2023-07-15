<script setup>
import { computed } from 'vue';
import { useString } from 'src/composes/resource.compose';
import BaseSpinner from './base-spinner.vue';

const props = defineProps({
  text: {
    type: String,
    default: null,
  },
  textFromResource: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'button',
  },
  fullwidth: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'md',
  },
  color: {
    type: String,
    default: 'white',
  },
  classes: {
    type: Object,
    default: () => ({
      base: '',
    }),
  },
});

const { getString } = useString();

const text = computed(() => {
  return props.textFromResource ? getString(props.text) : props.text;
});
const isDisabled = computed(() => props.loading);
const style = computed(() => {
  const sizes = {
    xs: 'px-2 py-1 text-xs rounded',
    sm: 'px-2 py-1 text-sm rounded',
    md: 'px-2.5 py-1.5 text-sm rounded-md',
    lg: 'px-3 py-2 text-sm rounded-md',
    xl: 'px-3.5 py-2.5 text-sm rounded-md',
  };
  const colors = {
    white:
      'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
    indigo:
      'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
    red: 'bg-red-600 text-white hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600',
    green:
      'bg-green-600 text-white hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600',
  };

  return {
    base: [
      props.fullwidth ? ' w-full' : '',
      isDisabled.value ? 'opacity-75' : '',
      sizes[props.size],
      colors[props.color],
      'flex justify-center items-center space-x-2 font-semibold shadow-sm',
      props.classes.base,
    ],
  };
});
</script>

<template>
  <button :type="props.type" :class="[style.base]" :disabled="isDisabled">
    <base-spinner v-if="props.loading" size="sm" :color="props.color" />
    <slot>
      <span>{{ text }}</span>
    </slot>
    <slot name="right" />
  </button>
</template>
