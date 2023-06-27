<script setup>
import { useRoute } from 'vue-router';
import AppToast from 'src/components/app/app-toast.vue';

const route = useRoute();
</script>

<template>
  <component :is="route.meta.layout">
    <app-toast />
    <router-view></router-view>
  </component>
</template>
