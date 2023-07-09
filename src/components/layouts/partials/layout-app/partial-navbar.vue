<script setup>
import { useString } from 'src/composes/resource.compose';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const { getString } = useString();
const route = useRoute();

const menus = [
  {
    id: 'index',
    to: { name: 'index' },
    name: 'menus.index',
  },
  {
    id: 'task.index',
    to: { name: 'task.index' },
    name: 'menus.task',
  },
  {
    id: 'task-category.index',
    to: { name: 'task-category.index' },
    name: 'menus.task-category',
  },
];

const active = computed(() => route.name);
</script>

<template>
  <div>
    <router-link
      v-for="menu in menus"
      :key="menu.id"
      :to="menu.to"
      class="rounded-md px-3 py-2 text-base block font-medium md:text-sm md:inline-block"
      :class="[
        active === menu.id
          ? 'bg-gray-900 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
      ]"
    >
      {{ getString(menu.name) }}
    </router-link>
  </div>
</template>
