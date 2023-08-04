<script setup>
import BaseTitle from 'src/components/base/base-title.vue';
import BaseInput from 'src/components/base/base-input.vue';
import BaseButton from 'src/components/base/base-button.vue';
import BaseAlert from 'src/components/base/base-alert.vue';
import { reactive, ref } from 'vue';
import { useRequest } from 'src/composes/request.compose';
import { getString } from 'src/utils/resource';

const {
  loading,
  error,
  validation,
  resetError,
  request: resetPassword,
} = useRequest({
  method: 'post',
  url: '/api/password/forgot',
});

const successAlert = ref(false);
const form = reactive({
  email: null,
});

async function handleSubmit() {
  successAlert.value = false;

  const [success] = await resetPassword(form);

  if (success) {
    successAlert.value = true;
  }
}
function handleCloseAlert() {
  resetError();
}
function handleCloseSuccessAlert() {
  successAlert.value = false;
}
</script>

<template>
  <div class="space-y-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <base-title
      :level="2"
      :classes="{ base: 'text-center leading-9' }"
      text="auth.forgot-password.title"
      text-from-resource
    />

    <form class="space-y-6" v-on:submit.prevent="handleSubmit">
      <base-alert
        :text="error"
        type="error"
        :force-visible="!!error"
        v-on:close="handleCloseAlert"
      />
      <base-alert
        :text="getString('auth.forgot-password.messages.success-send')"
        type="success"
        :force-visible="successAlert"
        v-on:close="handleCloseSuccessAlert"
      />
      <base-input
        id="email"
        type="email"
        placeholder="auth.forgot-password.form.email"
        label="auth.forgot-password.form.email"
        :color="validation.email ? 'red' : 'gray'"
        :message="validation.email"
        with-label
        fullwidth
        label-from-resource
        placeholder-from-resource
        v-model="form.email"
      />
      <base-button
        type="submit"
        color="indigo"
        text="auth.forgot-password.actions.submit"
        text-from-resource
        fullwidth
        :loading="loading"
      />
    </form>
  </div>
</template>
