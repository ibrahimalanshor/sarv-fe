<script setup>
import BaseHeader from 'src/components/base/base-header.vue';
import BaseContainer from 'src/components/base/base-container.vue';
import BaseCard from 'src/components/base/base-card.vue';
import BaseDescription from 'src/components/base/base-description.vue';
import BaseAvatar from 'src/components/base/base-avatar.vue';
import BaseButton from 'src/components/base/base-button.vue';
import { useAuthStore } from 'src/store/modules/auth.module';
import { h } from 'vue';
import { formatDate } from 'src/utils/date';
import { useString } from 'src/composes/resource.compose';

const authStore = useAuthStore();
const { getString } = useString();

const attributes = [
  {
    id: 'name',
    name: getString('profile.label.name'),
  },
  {
    id: 'email',
    name: getString('profile.label.email'),
  },
  {
    id: 'photo_src',
    name: getString('profile.label.photo'),
    wrapperClass: 'items-center',
    render: () =>
      h(
        'div',
        { class: 'flex items-center gap-x-3' },
        {
          default: () => [
            h(BaseAvatar, { src: authStore.me.photo_src }),
            h(BaseButton, { text: 'Change', size: 'sm' }),
          ],
        }
      ),
  },
  {
    id: 'created_at',
    name: getString('profile.label.joined_at'),
    value: formatDate(authStore.me.created_at),
  },
];
</script>

<template>
  <div>
    <base-header title="pages.profile" title-from-resource></base-header>
    <main>
      <base-container>
        <base-card
          with-header
          :title="getString('profile.title.my-profile')"
          :custom-content="true"
        >
          <base-description
            inline
            :attributes="attributes"
            :data="authStore.me"
          />
        </base-card>
      </base-container>
    </main>
  </div>
</template>
