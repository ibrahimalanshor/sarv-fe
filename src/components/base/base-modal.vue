<script setup>
import { computed, watch } from 'vue';
import BaseCard from './base-card.vue';
import BaseClose from './base-close.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: null,
  },
  withHeader: {
    type: Boolean,
    default: false,
  },
  withFooter: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['update:modelValue', 'visible']);

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

function handleClose() {
  visible.value = false;
}

watch(visible, (value) => {
  if (value) {
    emit('visible');
  }
});
</script>

<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
  >
    <div class="max-w-sm w-full">
      <base-card
        :title="props.title"
        :with-header="props.withHeader"
        :with-footer="props.withFooter"
        :classes="{
          base: 'shadow-xl',
        }"
        v-click-outside="handleClose"
      >
        <slot />
        <template #header-actions>
          <slot name="header-actions">
            <base-close v-on:click="handleClose" />
          </slot>
        </template>
        <template #footer>
          <slot v-if="props.withFooter" name="footer" :close="handleClose" />
        </template>
      </base-card>
    </div>
  </div>
</template>
