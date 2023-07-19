<script setup>
import { useString } from 'src/composes/resource.compose';
import { useRequest } from 'src/composes/request.compose';
import BaseAlert from 'src/components/base/base-alert.vue';
import BaseModal from 'src/components/base/base-modal.vue';
import BaseInput from 'src/components/base/base-input.vue';
import BaseButton from 'src/components/base/base-button.vue';
import { computed, reactive, ref } from 'vue';
import { useAuthStore } from 'src/store/modules/auth.module';
import { useError } from 'src/composes/error.compose';
import { useMe } from 'src/composes/modules/auth/me.compose';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['update:modelValue']);

const authStore = useAuthStore();
const { getString } = useString();
const {
  request: updateMe,
  validation: updateMeValidation,
  loading: loadingUpdateMe,
  error: errorUpdateMe,
  resetValidation: resetUpdateMeValidation,
  resetError: resetUpdateMeError,
} = useRequest({
  method: 'patch',
  url: '/api/me',
});

const form = reactive({
  name: authStore.me.name,
});

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

function setForm() {
  form.name = authStore.me.name;
}
async function submitUpdateMe() {
  const [success] = await updateMe(form);

  if (success) {
    authStore.setMe(success);

    visible.value = false;
  }
}

async function handleSubmit() {
  await submitUpdateMe();
}
function handleCloseAlert() {
  resetUpdateMeError();
}
function handleVisible() {
  setForm();

  resetUpdateMeValidation();
  resetUpdateMeError();
}
</script>

<template>
  <form v-on:submit.prevent="handleSubmit">
    <base-modal
      :title="getString('profile.title.edit-profile')"
      with-header
      with-footer
      v-model="visible"
      v-on:visible="handleVisible"
    >
      <div class="space-y-4">
        <base-alert
          :text="errorUpdateMe"
          type="error"
          :force-visible="!!errorUpdateMe"
          v-on:close="handleCloseAlert"
        />

        <base-input
          type="text"
          label="profile.label.name"
          placeholder="profile.placeholder.name"
          :color="updateMeValidation.name ? 'red' : 'gray'"
          :message="updateMeValidation.name"
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
            :loading="loadingUpdateMe"
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
