<script setup>
import GoogleIcon from 'src/assets/social/google.svg';
import BaseButton from 'src/components/base/base-button.vue';
import { useRouter } from 'vue-router';
import { useGoogleLogin } from 'src/composes/modules/auth/google-login.compose';
import { getString } from 'src/utils/resource';

const router = useRouter();
const { loading, googleLogin } = useGoogleLogin();

async function handleGoogleLogin() {
  const [res] = await googleLogin();

  if (res) {
    router.push({ name: 'index' });
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="relative">
      <div class="absolute inset-0 flex items-center" aria-hidden="true">
        <div class="w-full border-t border-gray-200" />
      </div>
      <div class="relative flex justify-center text-sm font-medium leading-6">
        <span class="bg-white px-6 text-gray-900">{{
          getString('auth.login-social.messages.or')
        }}</span>
      </div>
    </div>

    <base-button
      type="submit"
      color="white"
      text="auth.login.form.submit"
      text-from-resource
      fullwidth
      :loading="loading"
      v-on:click="handleGoogleLogin"
    >
      <img :src="GoogleIcon" class="w-6" />
    </base-button>
  </div>
</template>
