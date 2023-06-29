<script setup>
import { useRoute } from 'vue-router';
import AppToast from 'src/components/app/app-toast.vue';
import AppProgressBar from 'src/components/app/app-progress-bar.vue';

const route = useRoute();
</script>

<template>
  <component :is="route.meta.layout">
    <app-progress-bar />
    <app-toast />
    <router-view></router-view>
  </component>
</template>
