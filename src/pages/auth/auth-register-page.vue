<script setup>
import BaseTitle from 'src/components/base/base-title.vue';
import BaseInput from 'src/components/base/base-input.vue';
import BaseButton from 'src/components/base/base-button.vue';
import BaseLink from 'src/components/base/base-link.vue';
import { useToastStore } from 'src/store/modules/toast.module';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useRegister } from 'src/composes/modules/auth/register.compose';

const toastStore = useToastStore();
const router = useRouter();
const { register, loading, validation } = useRegister();

const form = reactive({
  name: null,
  email: null,
  password: null,
  password_confirmation: null,
});

async function handleSubmit() {
  const [success, error] = await register(form);

  if (!success) {
    if (error) {
      toastStore.createToast({
        id: 'error-auth',
        title: error,
        message: error,
        type: 'error',
      });
    }
  } else {
    router.push({ name: 'index' });
  }
}
</script>

<template>
  <div class="space-y-10">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <base-title
        :level="2"
        :classes="{ base: 'mt-10 text-center leading-9' }"
        text="auth.register.title"
        text-from-resource
      />
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" v-on:submit.prevent="handleSubmit">
        <base-input
          id="name"
          type="text"
          placeholder="auth.register.form.name"
          label="auth.register.form.name"
          :color="validation.name ? 'red' : 'gray'"
          :message="validation.name"
          with-label
          label-from-resource
          placeholder-from-resource
          v-model="form.name"
        />
        <base-input
          id="email"
          type="email"
          placeholder="auth.register.form.email"
          label="auth.register.form.email"
          :color="validation.email ? 'red' : 'gray'"
          :message="validation.email"
          with-label
          label-from-resource
          placeholder-from-resource
          v-model="form.email"
        />
        <base-input
          id="password"
          type="password"
          placeholder="auth.register.form.password"
          label="auth.register.form.password"
          :color="validation.password ? 'red' : 'gray'"
          :message="validation.password"
          with-label
          label-from-resource
          placeholder-from-resource
          v-model="form.password"
        />
        <base-input
          id="password_confirmation"
          type="password"
          placeholder="auth.register.form.password_confirmation"
          label="auth.register.form.password_confirmation"
          :color="validation.password_confirmation ? 'red' : 'gray'"
          :message="validation.password_confirmation"
          with-label
          label-from-resource
          placeholder-from-resource
          v-model="form.password_confirmation"
        />
        <base-button
          type="submit"
          text="auth.register.form.submit"
          text-from-resource
          fullwidth
          :loading="loading"
        />
      </form>
    </div>

    <p class="text-center text-sm">
      <base-link
        :to="{ name: 'login' }"
        text="auth.register.link.login"
        text-from-resource
      />
    </p>
  </div>
</template>
