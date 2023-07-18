<script setup>
import { computed, ref } from 'vue';
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
  color: {
    type: String,
    default: 'gray',
  },
  message: {
    type: String,
    default: null,
  },
  modelValue: {
    type: String,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  classes: {
    type: Object,
    default: () => ({
      input: '',
    }),
  },
  size: {
    type: String,
    default: 'md',
  },
  fullwidth: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue', 'change']);

const { getString } = useString();

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
const label = computed(() => {
  return props.labelFromResource ? getString(props.label) : props.label;
});
const placeholder = computed(() => {
  return props.placeholderFromResource
    ? getString(props.placeholder)
    : props.placeholder;
});
const style = computed(() => {
  const inputSizes = {
    sm: 'pl-2.5 pr-10 py-1',
    md: 'pl-3 pr-10 py-1.5',
  };
  const inputColors = {
    gray: 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600',
    red: 'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500',
  };

  return {
    input: {
      base: [
        props.fullwidth ? 'w-full' : '',
        props.classes.input,
        inputColors[props.color],
        inputSizes[props.size],
      ],
    },
  };
});
const attributes = computed(() => ({
  id: props.id,
  name: props.id,
  type: props.type,
  placeholder: placeholder.value,
  readonly: props.readonly,
  disabled: props.disabled,
  class: [
    'block rounded-md border-0 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 disabled:bg-gray-50',
    style.value.input.base,
  ],
}));

function handleChange() {
  emit('change');
}
</script>

<template>
  <div :class="[props.fullwidth ? 'w-full' : '']">
    <label
      v-if="props.withLabel"
      :for="props.id"
      class="block text-sm font-medium leading-6 text-gray-900 mb-2"
      >{{ label }}</label
    >
    <div :class="['relative', props.fullwidth ? 'w-full' : '']">
      <slot>
        <select v-bind="attributes" v-model="value" v-on:change="handleChange">
          <option :value="null">{{ placeholder }}</option>
          <option
            v-for="option in props.options"
            :key="option.id"
            :value="option.id"
          >
            {{ option.name }}
          </option>
        </select>
      </slot>
    </div>
    <p v-if="props.message" class="mt-2 text-sm text-red-600">
      {{ props.message }}
    </p>
  </div>
</template>
