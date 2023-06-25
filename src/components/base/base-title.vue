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
  level: {
    type: Number,
    default: 1,
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
const style = computed(() => {
  const levels = {
    2: 'text-2xl',
  };
  return {
    base: ['font-bold tracking-tight text-gray-900', props.classes.base],
    level: levels[props.level],
  };
});
</script>

<template>
  <component :is="`h${props.level}`" :class="[style.base, style.level]">
    <slot>
      {{ text }}
    </slot>
  </component>
</template>
