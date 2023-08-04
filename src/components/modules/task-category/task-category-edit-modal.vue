<script setup>
import { useString } from 'src/composes/resource.compose';
import { useRequest } from 'src/composes/request.compose';
import BaseAlert from 'src/components/base/base-alert.vue';
import BaseModal from 'src/components/base/base-modal.vue';
import BaseInput from 'src/components/base/base-input.vue';
import BaseButton from 'src/components/base/base-button.vue';
import { computed, reactive, ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  taskCategory: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue', 'updated']);

const { getString } = useString();
const {
  request: updateTaskCategory,
  loading: updateTaskCategoryLoading,
  validation: updateTaskCategoryValidation,
  error: updateTaskCategoryError,
  resetError: resetUpdateTaskCategoryError,
  resetValidation: resetUpdateTaskCategoryValidation,
  url: updateTaskCategoryUrl,
} = useRequest({
  method: 'patch',
  url: '/api/task-categories/:id',
});

const form = reactive({
  name: props.taskCategory.name,
  task_category_id: props.taskCategory.task_category_id,
});

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

async function handleSubmit() {
  updateTaskCategoryUrl.value = `/api/task-categories/${props.taskCategory.id}`;

  const [success] = await updateTaskCategory(form);

  if (success) {
    visible.value = false;

    emit('updated');
  }
}
function handleCloseAlert() {
  resetUpdateTaskCategoryError();
}
function handleVisible() {
  form.name = props.taskCategory.name;
  form.task_category_id = props.taskCategory.task_category_id;

  resetUpdateTaskCategoryValidation();
  resetUpdateTaskCategoryError();
}
</script>

<template>
  <form v-on:submit.prevent="handleSubmit">
    <base-modal
      :title="getString('task-category.actions.edit')"
      with-header
      with-footer
      v-model="visible"
      v-on:visible="handleVisible"
    >
      <div class="space-y-4">
        <base-alert
          :text="updateTaskCategoryError"
          type="error"
          :force-visible="!!updateTaskCategoryError"
          v-on:close="handleCloseAlert"
        />

        <base-input
          type="text"
          label="task-category.label.name"
          placeholder="task-category.placeholder.name"
          :color="updateTaskCategoryValidation.name ? 'red' : 'gray'"
          :message="updateTaskCategoryValidation.name"
          fullwidth
          with-label
          label-from-resource
          placeholder-from-resource
          v-model="form.name"
        />
      </div>

      <template #footer="{ close }">
        <div class="flex items-center justify-end gap-x-2">
          <base-button
            type="submit"
            color="indigo"
            text="actions.save"
            :loading="updateTaskCategoryLoading"
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
