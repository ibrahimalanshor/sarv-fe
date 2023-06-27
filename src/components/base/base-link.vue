<script setup>
import { computed } from 'vue';
import { useString } from 'src/composes/resource.compose';

const props = defineProps({
  to: {
    type: [String, Object],
    required: true,
  },
  native: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: null,
  },
  textFromResource: {
    type: Boolean,
    default: false,
  },
});

const { getString } = useString();

const text = computed(() => {
  return props.textFromResource ? getString(props.text) : props.text;
});
</script>

<template>
  <p>
    <a
      v-if="props.native"
      :href="props.to"
      class="font-semibold leading-6 text-sm text-indigo-600 hover:text-indigo-500"
    >
      {{ text }}
    </a>
  </p>
</template>
