<script setup>
import { useAuthStore } from 'src/store/modules/auth.module';
import { useString } from 'src/composes/resource.compose';
import { computed, h, reactive, ref } from 'vue';
import BaseAvatar from 'src/components/base/base-avatar.vue';
import BaseDropdown from 'src/components/base/base-dropdown.vue';
import AuthLogoutConfirm from 'src/components/modules/auth/auth-logout-confirm.vue';
import { isValidUrl } from 'src/utils/string';

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
    id: 'me',
    mobile: false,
    render: (attr) => {
      return h(
        'div',
        {
          class: [attr.classes.item, 'flex flex-col border-b border-gray-200'],
        },
        {
          default: () => [
            h(
              'span',
              { class: 'font-semibold text-gray-900 truncate' },
              me.value.name
            ),
            h(
              'span',
              { class: 'text-xs text-gray-500 truncate' },
              me.value.email
            ),
          ],
        }
      );
    },
  },
  {
    id: 'profile',
    name: getString('menus.profile'),
    to: {
      name: 'profile',
    },
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
          <base-avatar
            :src="
              me.photo_src
                ? isValidUrl(me.photo_src)
                  ? me.photo_src
                  : me.photo_url
                : null
            "
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
          v-for="item in profileDropdownItems.filter(
            (item) => item.mobile ?? true
          )"
          :key="item.id"
          href="#"
          class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
          >{{ item.name }}</a
        >
      </div>
    </template>
    <template v-else>
      <base-dropdown
        custom-width="w-48"
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
            <base-avatar
              :src="
                me.photo_src
                  ? isValidUrl(me.photo_src)
                    ? me.photo_src
                    : me.photo_url
                  : null
              "
            />
          </button>
        </template>
      </base-dropdown>
    </template>

    <auth-logout-confirm v-model="visibleLogoutConfirm" />
  </div>
</template>
