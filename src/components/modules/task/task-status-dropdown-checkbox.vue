<script setup>
import BaseDropdown from 'src/components/base/base-dropdown.vue';
import BaseCheckbox from 'src/components/base/base-checkbox.vue';
import BaseBadge from 'src/components/base/base-badge.vue';
import BaseButton from 'src/components/base/base-button.vue';
import { computed } from 'vue';
import { useString } from 'src/composes/resource.compose';
import {
  getAvaiableStatuses,
  parseStatusName,
} from 'src/helpers/modules/task.helper.js';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['update:modelValue', 'change']);

const { getString } = useString();

const selected = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
const firstSelectedName = computed(() => parseStatusName(selected.value[0]));

function handleChange() {
  emit('change');
}
</script>

<template>
  <base-dropdown custom-width="w-fit" position="right">
    <template #toggle="{ toggle }">
      <base-button :classes="{ base: 'h-full' }" v-on:click="toggle">
        <div class="space-x-2">
          <span>{{ getString('task.filter.status') }}</span>
          <template v-if="selected.length">
            <span>:</span>
            <span>{{ firstSelectedName }}</span>
            <base-badge
              v-if="selected.length > 1"
              :text="`+${selected.length - 1}`"
              size="sm"
              color="white"
            />
          </template>
        </div>
      </base-button>
    </template>

    <template #content="{ classes }">
      <div
        v-for="status in getAvaiableStatuses()"
        :key="status.value"
        :class="classes.item"
      >
        <base-checkbox
          :text="status.name"
          :value="status.value"
          v-model="selected"
          v-on:change="handleChange"
        />
      </div>
    </template>
  </base-dropdown>
</template>
