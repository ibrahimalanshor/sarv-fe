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
});
const emit = defineEmits(['update:modelValue', 'created']);

const { getString } = useString();
const {
  request: storeTaskStatus,
  loading: storeTaskStatusLoading,
  validation: storeTaskStatusValidation,
  error: storeTaskStatusError,
  resetError: resetStoreTaskStatusError,
  resetValidation: resetStoreTaskStatusValidation,
} = useRequest({
  method: 'post',
  url: '/api/task-statuses',
});

const form = reactive({
  name: null,
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
  const [success] = await storeTaskStatus(form);

  if (success) {
    visible.value = false;

    emit('created');
  }
}
function handleCloseAlert() {
  resetStoreTaskStatusError();
}
function handleResetForm() {
  form.name = null;

  resetStoreTaskStatusValidation();
  resetStoreTaskStatusError();
}
</script>

<template>
  <form v-on:submit.prevent="handleSubmit">
    <base-modal
      :title="getString('task-status.actions.create')"
      with-header
      with-footer
      v-model="visible"
      v-on:visible="handleResetForm"
    >
      <div class="space-y-4">
        <base-alert
          :text="storeTaskStatusError"
          type="error"
          :force-visible="!!storeTaskStatusError"
          v-on:close="handleCloseAlert"
        />

        <base-input
          type="text"
          label="task-status.label.name"
          placeholder="task-status.placeholder.name"
          :color="storeTaskStatusValidation.name ? 'red' : 'gray'"
          :message="storeTaskStatusValidation.name"
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
            :loading="storeTaskStatusLoading"
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
