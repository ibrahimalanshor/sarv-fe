<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const visible = ref(false);

const style = computed(() => {
  return {
    item: ['block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'],
  };
});

function handleToggle() {
  visible.value = !visible.value;
}
function handleClose() {
  visible.value = false;
}
</script>

<template>
  <div class="relative" v-click-outside="handleClose">
    <div class="h-full">
      <slot name="toggle" :toggle="handleToggle" />
    </div>

    <!--
        Dropdown menu, show/hide based on menu state.

        Entering: "transition ease-out duration-100"
            From: "transform opacity-0 scale-95"
            To: "transform opacity-100 scale-100"
        Leaving: "transition ease-in duration-75"
            From: "transform opacity-100 scale-100"
            To: "transform opacity-0 scale-95"
        -->
    <div
      v-if="visible"
      class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-menu-button"
      tabindex="-1"
    >
      <slot name="content" :classes="style">
        <!-- Active: "bg-gray-100", Not Active: "" -->
        <a
          v-for="item in props.items"
          :key="item.id"
          href="#"
          :class="style.item"
          role="menuitem"
          tabindex="-1"
          id="user-menu-item-0"
        >
          {{ item.name }}
        </a>
      </slot>
    </div>
  </div>
</template>
