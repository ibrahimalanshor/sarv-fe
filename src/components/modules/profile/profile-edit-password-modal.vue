<script setup>
import { useString } from 'src/composes/resource.compose';
import { useRequest } from 'src/composes/request.compose';
import BaseAlert from 'src/components/base/base-alert.vue';
import BaseModal from 'src/components/base/base-modal.vue';
import BaseInput from 'src/components/base/base-input.vue';
import BaseButton from 'src/components/base/base-button.vue';
import { computed, reactive, ref } from 'vue';
import { useAuthStore } from 'src/store/modules/auth.module';

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
  request: updatePassword,
  validation: updatePasswordValidation,
  loading: loadingUpdatePassword,
  error: errorUpdatePassword,
  resetValidation: resetUpdatePasswordValidation,
  resetError: resetUpdatePasswordError,
} = useRequest({
  method: 'patch',
  url: '/api/me/password',
});

const form = reactive({
  password: null,
  password_confirmation: null,
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
  form.password = null;
  form.password_confirmation = null;
}
async function submitUpdatePassword() {
  const [success] = await updatePassword(form);

  if (success) {
    authStore.setMe(success);

    visible.value = false;
  }
}

async function handleSubmit() {
  await submitUpdatePassword();
}
function handleCloseAlert() {
  resetUpdatePasswordError();
}
function handleVisible() {
  setForm();

  resetUpdatePasswordValidation();
  resetUpdatePasswordError();
}
</script>

<template>
  <form v-on:submit.prevent="handleSubmit">
    <base-modal
      :title="getString('profile.title.edit-password')"
      with-header
      with-footer
      v-model="visible"
      v-on:visible="handleVisible"
    >
      <div class="space-y-4">
        <base-alert
          :text="errorUpdatePassword"
          type="error"
          :force-visible="!!errorUpdatePassword"
          v-on:close="handleCloseAlert"
        />

        <base-input
          type="password"
          label="profile.label.password"
          placeholder="profile.placeholder.password"
          :color="updatePasswordValidation.password ? 'red' : 'gray'"
          :message="updatePasswordValidation.password"
          fullwidth
          with-label
          label-from-resource
          placeholder-from-resource
          v-model="form.password"
        />

        <base-input
          type="password"
          label="profile.label.password_confirmation"
          placeholder="profile.placeholder.password_confirmation"
          :color="
            updatePasswordValidation.password_confirmation ? 'red' : 'gray'
          "
          :message="updatePasswordValidation.password_confirmation"
          fullwidth
          with-label
          label-from-resource
          placeholder-from-resource
          v-model="form.password_confirmation"
        />
      </div>

      <template #footer="{ close }">
        <div class="flex items-center justify-end gap-x-2">
          <base-button
            type="submit"
            color="indigo"
            text="actions.save"
            :loading="loadingUpdatePassword"
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
