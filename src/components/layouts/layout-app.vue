<script>
import { ref } from 'vue';
import PartialNavbar from './partials/layout-app/partial-navbar.vue';
import PartialOption from './partials/layout-app/partial-option.vue';
import PartialBreadcrumb from './partials/layout-app/partial-breadcrumb.vue';
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';

export default {
  name: 'LayoutApp',
  components: {
    PartialBreadcrumb,
    PartialNavbar,
    PartialOption,
    Bars3Icon,
    XMarkIcon,
  },
  setup() {
    const visibleMobileMenu = ref(false);

    function handleToggleMobileMenu() {
      visibleMobileMenu.value = !visibleMobileMenu.value;
    }

    return { visibleMobileMenu, handleToggleMobileMenu };
  },
};
</script>

<template>
  <!--
  This example requires updating your template:

  ```
  <html class="h-full bg-gray-100">
  <body class="h-full">
  ```
-->
  <div class="min-h-full">
    <nav class="bg-gray-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <div class="hidden md:block">
              <partial-navbar class="flex items-baseline space-x-4" />
            </div>
          </div>
          <div class="hidden md:block">
            <partial-option />
          </div>
          <div class="-mr-2 flex md:hidden">
            <!-- Mobile menu button -->
            <button
              v-on:click="handleToggleMobileMenu"
              type="button"
              class="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span class="sr-only">Open main menu</span>
              <Bars3Icon
                v-if="!visibleMobileMenu"
                class="block h-6 w-6"
                aria-hidden="true"
              />
              <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu, show/hide based on menu state. -->
      <div v-if="visibleMobileMenu" class="md:hidden" id="mobile-menu">
        <partial-navbar class="space-y-1 px-2 pb-3 pt-2 sm:px-3" />
        <partial-option mobile />
      </div>
    </nav>

    <partial-breadcrumb />

    <slot />
  </div>
</template>
