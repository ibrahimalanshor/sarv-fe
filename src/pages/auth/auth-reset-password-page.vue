<script setup>
import BaseTitle from 'src/components/base/base-title.vue';
import BaseInput from 'src/components/base/base-input.vue';
import BaseButton from 'src/components/base/base-button.vue';
import BaseAlert from 'src/components/base/base-alert.vue';
import { reactive } from 'vue';
import { useRequest } from 'src/composes/request.compose';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const {
  loading,
  error,
  validation,
  resetError,
  request: resetPassword,
} = useRequest({
  method: 'post',
  url: '/api/password/reset',
});

const form = reactive({
  token: route.query.token,
  password: null,
  password_confirmation: null,
});

async function handleSubmit() {
  const [success] = await resetPassword(form);

  if (success) {
    router.push({ name: 'login' });
  }
}
function handleCloseAlert() {
  resetError();
}
</script>

<template>
  <div class="space-y-10">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <base-title
        :level="2"
        :classes="{ base: 'mt-10 text-center leading-9' }"
        text="auth.reset-password.title"
        text-from-resource
      />
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" v-on:submit.prevent="handleSubmit">
        <base-alert
          :text="error"
          type="error"
          :force-visible="!!error"
          v-on:close="handleCloseAlert"
        />
        <base-input
          id="password"
          type="password"
          placeholder="auth.reset-password.form.password"
          label="auth.reset-password.form.password"
          :color="validation.password ? 'red' : 'gray'"
          :message="validation.password"
          with-label
          fullwidth
          label-from-resource
          placeholder-from-resource
          v-model="form.password"
        />
        <base-input
          id="password_confirmation"
          type="password"
          placeholder="auth.reset-password.form.password_confirmation"
          label="auth.reset-password.form.password_confirmation"
          :color="validation.password_confirmation ? 'red' : 'gray'"
          :message="validation.password_confirmation"
          with-label
          fullwidth
          label-from-resource
          placeholder-from-resource
          v-model="form.password_confirmation"
        />
        <base-button
          type="submit"
          color="indigo"
          text="auth.reset-password.actions.submit"
          text-from-resource
          fullwidth
          :loading="loading"
        />
      </form>
    </div>
  </div>
</template>
