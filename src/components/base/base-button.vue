<script setup>
import { computed } from 'vue';
import { useString } from 'src/composes/resource.compose';

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
});

const { getString } = useString();

const text = computed(() => {
  return props.textFromResource ? getString(props.text) : props.text;
});
const style = computed(() => {
  return {
    base: [
      props.fullwidth ? ' w-full' : '',
      'flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
    ],
  };
});
</script>

<template>
  <button :type="props.type" :class="[style.base]">
    {{ text }}
  </button>
</template>
