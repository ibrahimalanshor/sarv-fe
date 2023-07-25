<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useTitle } from 'src/composes/title.compose';
import { useMe } from 'src/composes/modules/auth/me.compose';
import AppToast from 'src/components/app/app-toast.vue';
import AppProgressBar from 'src/components/app/app-progress-bar.vue';

const route = useRoute();
const router = useRouter();
const { setTitleFromResource } = useTitle();
const { loadMe } = useMe();

router.afterEach(() => {
  setTitleFromResource();
});

loadMe();
</script>

<template>
  <component :is="route.meta.layout">
    <app-progress-bar />
    <app-toast />
    <router-view :key="route.path" />
  </component>
</template>
