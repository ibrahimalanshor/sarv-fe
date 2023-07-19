<script setup>
import BaseTitle from 'src/components/base/base-title.vue';
import BaseInput from 'src/components/base/base-input.vue';
import BaseButton from 'src/components/base/base-button.vue';
import BaseLink from 'src/components/base/base-link.vue';
import BaseAlert from 'src/components/base/base-alert.vue';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useLogin } from 'src/composes/modules/auth/login.compose';

const router = useRouter();
const { login, loading, validation, error, resetError } = useLogin();

const form = reactive({
  email: null,
  password: null,
});

async function handleSubmit() {
  const [success] = await login(form);

  if (success) {
    router.push({ name: 'index' });
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
        text="auth.login.title"
        text-from-resource
      />
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" v-on:submit.prevent="handleSubmit">
        <base-alert
          :text="error"
          type="error"
          :force-visible="error"
          v-on:close="handleCloseAlert"
        />
        <base-input
          id="email"
          type="email"
          placeholder="auth.login.form.email"
          label="auth.login.form.email"
          :color="validation.email ? 'red' : 'gray'"
          :message="validation.email"
          with-label
          fullwidth
          label-from-resource
          placeholder-from-resource
          v-model="form.email"
        />
        <base-input
          id="password"
          type="password"
          placeholder="auth.login.form.password"
          label="auth.login.form.password"
          :color="validation.password ? 'red' : 'gray'"
          :message="validation.password"
          with-label
          fullwidth
          label-from-resource
          placeholder-from-resource
          v-model="form.password"
        />
        <base-button
          type="submit"
          color="indigo"
          text="auth.login.form.submit"
          text-from-resource
          fullwidth
          :loading="loading"
        />
      </form>
    </div>

    <p class="text-center text-sm">
      <base-link
        :to="{ name: 'register' }"
        text="auth.login.link.register"
        text-from-resource
      />
    </p>
  </div>
</template>
