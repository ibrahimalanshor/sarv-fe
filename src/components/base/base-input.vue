<script setup>
import { computed } from 'vue';
import { useString } from 'src/composes/resource.compose';

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: null,
  },
  placeholder: {
    type: String,
    default: null,
  },
  withLabel: {
    type: Boolean,
    default: true,
  },
  labelFromResource: {
    type: Boolean,
    default: false,
  },
  placeholderFromResource: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'string',
  },
  color: {
    type: String,
    default: 'gray',
  },
  message: {
    type: String,
    default: null,
  },
});

const { getString } = useString();

const label = computed(() => {
  return props.labelFromResource ? getString(props.label) : props.label;
});
const placeholder = computed(() => {
  return props.placeholderFromResource
    ? getString(props.placeholder)
    : props.placeholder;
});
const style = computed(() => {
  const inputColors = {
    gray: 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600',
    red: 'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500',
  };

  return {
    input: {
      color: inputColors[props.color],
    },
  };
});
</script>

<template>
  <div>
    <label
      v-if="props.withLabel"
      :for="props.id"
      class="block text-sm font-medium leading-6 text-gray-900 mb-2"
      >{{ label }}</label
    >
    <div>
      <input
        :id="props.id"
        :name="props.id"
        :type="props.type"
        :placeholder="placeholder"
        class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
        :class="[style.input.color]"
      />
      <p v-if="props.message" class="mt-2 text-sm text-red-600">
        {{ props.message }}
      </p>
    </div>
  </div>
</template>
