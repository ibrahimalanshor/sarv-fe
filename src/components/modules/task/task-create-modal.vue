<script setup>
import { useString } from 'src/composes/resource.compose';
import { useRequest } from 'src/composes/request.compose';
import BaseAlert from 'src/components/base/base-alert.vue';
import BaseModal from 'src/components/base/base-modal.vue';
import BaseInput from 'src/components/base/base-input.vue';
import BaseButton from 'src/components/base/base-button.vue';
import TaskCategorySelectSearch from 'src/components/modules/task-category/task-category-select-search.vue';
import { computed, reactive, ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['update:modelValue', 'created']);

const { getString } = useString();
const {
  request: storeTask,
  loading: storeTaskLoading,
  validation: storeTaskValidation,
  error: storeTaskError,
  resetError: resetStoreTaskError,
  resetValidation: resetStoreTaskValidation,
} = useRequest({
  method: 'post',
  url: '/api/tasks',
});

const form = reactive({
  name: null,
  task_category_id: null,
});
const selectedCategory = ref(null);

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

async function handleSubmit() {
  form.task_category_id = selectedCategory.value?.id ?? null;

  const [success] = await storeTask(form);

  if (success) {
    visible.value = false;

    emit('created');
  }
}
function handleCloseAlert() {
  resetStoreTaskError();
}
function handleResetForm() {
  form.name = null;
  form.task_category_id = null;

  selectedCategory.value = null;

  resetStoreTaskValidation();
  resetStoreTaskError();
}
</script>

<template>
  <form v-on:submit.prevent="handleSubmit">
    <base-modal
      :title="getString('task.actions.create')"
      with-header
      with-footer
      v-model="visible"
      v-on:visible="handleResetForm"
    >
      <div class="space-y-4">
        <base-alert
          :text="storeTaskError"
          type="error"
          :force-visible="!!storeTaskError"
          v-on:close="handleCloseAlert"
        />

        <base-input
          type="text"
          label="task.label.name"
          placeholder="task.placeholder.name"
          :color="storeTaskValidation.name ? 'red' : 'gray'"
          :message="storeTaskValidation.name"
          fullwidth
          with-label
          label-from-resource
          placeholder-from-resource
          v-model="form.name"
        />

        <base-input
          label="task.label.category"
          placeholder="task.placeholder.category"
          :message="storeTaskValidation.task_category_id"
          fullwidth
          with-label
          label-from-resource
          placeholder-from-resource
        >
          <task-category-select-search
            :select-search-props="{
              fullwidth: true,
            }"
            :input-props="{
              withLabel: false,
              label: 'task.label.category',
              labelFromResource: true,
              color: storeTaskValidation.task_category_id ? 'red' : 'gray',
            }"
            v-model="selectedCategory"
          />
        </base-input>
      </div>

      <template #footer="{ close }">
        <div class="flex items-center justify-end gap-x-2">
          <base-button
            type="submit"
            color="indigo"
            text="actions.save"
            :loading="storeTaskLoading"
            text-from-resource
          />
          <base-button
            text="actions.cancel"
            text-from-resource
            v-on:click="close"
          />
        </div>
      </template>
    </base-modal>
  </form>
</template>
