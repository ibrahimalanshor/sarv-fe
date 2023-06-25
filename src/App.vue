<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <component :is="route.meta.layout">
    <router-view></router-view>
  </component>
</template>
