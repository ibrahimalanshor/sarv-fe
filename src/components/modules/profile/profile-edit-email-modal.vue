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
  request: updateEmail,
  validation: updateEmailValidation,
  loading: loadingUpdateEmail,
  error: errorUpdateEmail,
  resetValidation: resetUpdateEmailValidation,
  resetError: resetUpdateEmailError,
} = useRequest({
  method: 'patch',
  url: '/api/me/email',
});

const form = reactive({
  email: authStore.me.email,
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
  form.email = authStore.me.email;
}
async function submitUpdateEmail() {
  const [success] = await updateEmail(form);

  if (success) {
    authStore.setMe(success);

    visible.value = false;
  }
}

async function handleSubmit() {
  await submitUpdateEmail();
}
function handleCloseAlert() {
  resetUpdateEmailError();
}
function handleVisible() {
  setForm();

  resetUpdateEmailValidation();
  resetUpdateEmailError();
}
</script>

<template>
  <form v-on:submit.prevent="handleSubmit">
    <base-modal
      :title="getString('profile.title.edit-email')"
      with-header
      with-footer
      v-model="visible"
      v-on:visible="handleVisible"
    >
      <div class="space-y-4">
        <base-alert
          :text="errorUpdateEmail"
          type="error"
          :force-visible="!!errorUpdateEmail"
          v-on:close="handleCloseAlert"
        />

        <base-input
          type="email"
          label="profile.label.email"
          placeholder="profile.placeholder.email"
          :color="updateEmailValidation.email ? 'red' : 'gray'"
          :message="updateEmailValidation.email"
          fullwidth
          with-label
          label-from-resource
          placeholder-from-resource
          v-model="form.email"
        />
      </div>

      <template #footer="{ close }">
        <div class="flex items-center justify-end gap-x-2">
          <base-button
            type="submit"
            color="indigo"
            text="actions.save"
            :loading="loadingUpdateEmail"
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
