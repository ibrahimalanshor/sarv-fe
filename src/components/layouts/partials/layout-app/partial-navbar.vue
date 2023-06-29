<script setup>
import { useString } from 'src/composes/resource.compose';
import { ref } from 'vue';

const { getString } = useString();

const menus = [
  {
    id: 'index',
    to: { name: 'index' },
    name: 'menus.index',
  },
  // {
  //     id: 'task',
  //     to: { name: 'index' },
  //     name: 'menus.task'
  // }
];

const active = ref(menus[0]);
</script>

<template>
  <div>
    <router-link
      v-for="menu in menus"
      :key="menu.id"
      :to="menu.to"
      class="rounded-md px-3 py-2 text-base block font-medium md:text-sm md:inline-block"
      :class="[
        active.id === menu.id
          ? 'bg-gray-900 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
      ]"
    >
      {{ getString(menu.name) }}
    </router-link>
  </div>
</template>
