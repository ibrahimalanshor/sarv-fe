<script setup>
import BaseAlert from 'src/components/base/base-alert.vue';
import BaseSpinner from 'src/components/base/base-spinner.vue';
import { useAuthStore } from 'src/store/modules/auth.module';
import { useString } from 'src/composes/resource.compose';
import { useRequest } from 'src/composes/request.compose';
import { useToastStore } from 'src/store/modules/toast.module';

const authStore = useAuthStore();
const { getString } = useString();
const toastStore = useToastStore();
const { loading, request: resendVerificationLink } = useRequest({
  method: 'post',
  url: '/api/email/send',
  notifyOnError: true,
  initLoading: false,
});

async function handleResend() {
  const [success] = await resendVerificationLink();

  if (success) {
    toastStore.createToast({
      title: getString('auth.verification.titles.success-send'),
      type: 'success',
      message: getString('auth.verification.messages.success-send'),
    });
  }
}
</script>

<template>
  <base-alert
    type="warning"
    :dismissable="false"
    :force-visible="!authStore.me.is_verified"
  >
    <template #text="{ classes }">
      <div :class="[classes.text, 'flex space-x-1 items-center']">
        <span>{{ getString('auth.verification.messages.unverified') }}</span>
        <base-spinner v-if="loading" size="xs" color="yellow" class="inline" />
        <a
          v-else
          class="font-semibold underline"
          href="#"
          v-on:click.prevent="handleResend"
          >{{ getString('auth.verification.actions.resend') }}</a
        >
      </div>
    </template>
  </base-alert>
</template>
