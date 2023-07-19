<script setup>
import { useAuthStore } from 'src/store/modules/auth.module';
import { useString } from 'src/composes/resource.compose';
import { computed, reactive, ref } from 'vue';
import BaseDropdown from 'src/components/base/base-dropdown.vue';
import AuthLogoutConfirm from 'src/components/modules/auth/auth-logout-confirm.vue';

const props = defineProps({
  mobile: {
    type: Boolean,
    default: false,
  },
});

const authStore = useAuthStore();
const { getString } = useString();

const me = computed(() => authStore.me);

const visibleLogoutConfirm = ref(false);
const profileDropdown = reactive({
  visible: false,
});

const profileDropdownItems = [
  {
    id: 'profile',
    name: getString('menus.profile'),
  },
  {
    id: 'logout',
    name: getString('menus.logout'),
  },
];

function handleClickItem(item) {
  if (item.id === 'logout') {
    visibleLogoutConfirm.value = true;
  }
}
</script>

<template>
  <div
    :class="[
      props.mobile
        ? 'border-t border-gray-700 pb-3 pt-4'
        : 'ml-4 flex items-center md:ml-6',
    ]"
  >
    <template v-if="props.mobile">
      <div class="flex items-center px-5">
        <div class="flex-shrink-0">
          <img
            class="h-10 w-10 rounded-full"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
        </div>
        <div class="ml-3">
          <div class="text-base font-medium leading-none text-white">
            {{ me.name }}
          </div>
          <div class="text-sm font-medium leading-none text-gray-400">
            {{ me.email }}
          </div>
        </div>
      </div>
      <div class="mt-3 space-y-1 px-2">
        <a
          v-for="item in profileDropdownItems"
          :key="item.id"
          href="#"
          class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
          >{{ item.name }}</a
        >
      </div>
    </template>
    <template v-else>
      <base-dropdown
        custom-width="w-32"
        position="right"
        :items="profileDropdownItems"
        v-model="profileDropdown.visible"
        v-on:click-item="handleClickItem"
      >
        <template #toggle="{ toggle }">
          <button
            type="button"
            class="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            id="user-menu-button"
            aria-expanded="false"
            aria-haspopup="true"
            v-on:click="toggle"
          >
            <span class="sr-only">Open user menu</span>
            <img
              class="h-8 w-8 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </button>
        </template>
      </base-dropdown>
    </template>

    <auth-logout-confirm v-model="visibleLogoutConfirm" />
  </div>
</template>
