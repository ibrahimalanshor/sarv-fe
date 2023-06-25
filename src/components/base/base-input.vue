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
        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
    </div>
  </div>
</template>
