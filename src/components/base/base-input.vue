<script setup>
import { computed, ref } from 'vue';
import { useString } from 'src/composes/resource.compose';
import createDebounce from '../../utils/debounce';

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
  modelValue: {
    type: String,
    default: null,
  },
  withRightContent: {
    type: Boolean,
    default: false,
  },
  rightContent: {
    type: null,
    default: null,
  },
  debounce: {
    type: Boolean,
    default: false,
  },
  readonly: {
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
});
const emit = defineEmits(['update:modelValue', 'focus', 'input']);

const { getString } = useString();

const element = ref(null);

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
    sm: 'px-2 py-1',
    md: 'px-2.5 py-1.5',
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
const emitDebounceInput = createDebounce(() => emit('input'));

function handleFocus() {
  emit('focus');
}
function handleInput() {
  if (props.debounce) {
    emitDebounceInput();
  } else {
    emit('input');
  }
}

defineExpose({ element });
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
        <input
          ref="element"
          :id="props.id"
          :name="props.id"
          :type="props.type"
          :placeholder="placeholder"
          :readonly="props.readonly"
          class="block rounded-md border-0 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          :class="[style.input.base]"
          v-model="value"
          v-on:focus="handleFocus"
          v-on:input="handleInput"
        />
        <div
          v-if="props.withRightContent"
          class="absolute inset-y-0 right-0 flex items-center h-auto rounded-r-md px-2 focus:outline-none"
        >
          <slot name="right-content">
            <component :is="props.rightContent" />
          </slot>
        </div>
      </slot>
    </div>
    <p v-if="props.message" class="mt-2 text-sm text-red-600">
      {{ props.message }}
    </p>
  </div>
</template>
