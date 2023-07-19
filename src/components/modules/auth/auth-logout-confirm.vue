<script setup>
import BaseConfirm from 'src/components/base/base-confirm.vue';
import { computed } from 'vue';
import { useString } from 'src/composes/resource.compose';
import { useLogout } from 'src/composes/modules/auth/logout.compose';
import { useRouter } from 'vue-router';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['update:modelValue']);

const { loading, error, logout, resetError } = useLogout();
const { getString } = useString();
const router = useRouter();

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

async function handleConfirm() {
  const [success] = await logout();

  if (success) {
    visible.value = false;

    router.push({ name: 'login' });
  }
}
</script>

<template>
  <base-confirm
    :title="getString('auth.logout.title')"
    :message="getString('auth.logout.message')"
    :action="getString('auth.logout.actions.logout')"
    type="danger"
    :loading="loading"
    v-model="visible"
    v-on:confirm="handleConfirm"
  />
</template>
