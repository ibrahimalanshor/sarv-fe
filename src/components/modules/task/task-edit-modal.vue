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
  task: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue', 'updated']);

const { getString } = useString();
const {
  request: updateTask,
  loading: updateTaskLoading,
  validation: updateTaskValidation,
  error: updateTaskError,
  resetError: resetupdateTaskError,
  resetValidation: resetupdateTaskValidation,
  url: updateTaskUrl,
} = useRequest({
  method: 'patch',
  url: '/api/tasks/:id',
});

const form = reactive({
  name: props.task.name,
  task_category_id: props.task.task_category_id,
});

const selectedCategory = ref(props.task.category);

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

async function handleSubmit() {
  updateTaskUrl.value = `/api/tasks/${props.task.id}`;
  form.task_category_id = selectedCategory.value?.id ?? null;

  const [success] = await updateTask(form);

  if (success) {
    visible.value = false;

    emit('updated');
  }
}
function handleCloseAlert() {
  resetupdateTaskError();
}
function handleVisible() {
  form.name = props.task.name;
  form.task_category_id = props.task.task_category_id;

  selectedCategory.value = props.task.category;

  resetupdateTaskValidation();
  resetupdateTaskError();
}
</script>

<template>
  <form v-on:submit.prevent="handleSubmit">
    <base-modal
      :title="getString('task.actions.edit')"
      with-header
      with-footer
      v-model="visible"
      v-on:visible="handleVisible"
    >
      <div class="space-y-4">
        <base-alert
          :text="updateTaskError"
          type="error"
          :force-visible="!!updateTaskError"
          v-on:close="handleCloseAlert"
        />

        <base-input
          type="text"
          label="task.label.name"
          placeholder="task.placeholder.name"
          :color="updateTaskValidation.name ? 'red' : 'gray'"
          :message="updateTaskValidation.name"
          fullwidth
          with-label
          label-from-resource
          placeholder-from-resource
          v-model="form.name"
        />

        <base-input
          label="task.label.category"
          placeholder="task.placeholder.category"
          :message="updateTaskValidation.task_category_id"
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
              color: updateTaskValidation.task_category_id ? 'red' : 'gray',
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
            :loading="updateTaskLoading"
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
