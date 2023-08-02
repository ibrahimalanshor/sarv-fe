<script setup>
import BaseHeader from 'src/components/base/base-header.vue';
import BaseContainer from 'src/components/base/base-container.vue';
import BaseCard from 'src/components/base/base-card.vue';
import BaseDescription from 'src/components/base/base-description.vue';
import BaseAvatar from 'src/components/base/base-avatar.vue';
import BaseButton from 'src/components/base/base-button.vue';
import BaseLink from 'src/components/base/base-link.vue';
import ProfileEditModal from 'src/components/modules/profile/profile-edit-modal.vue';
import ProfileEditPhotoModal from 'src/components/modules/profile/profile-edit-photo-modal.vue';
import ProfileEditEmailModal from 'src/components/modules/profile/profile-edit-email-modal.vue';
import ProfileEditPasswordModal from 'src/components/modules/profile/profile-edit-password-modal.vue';
import AuthVerificationAlert from 'src/components/modules/auth/auth-verification-alert.vue';
import { useAuthStore } from 'src/store/modules/auth.module';
import { h, ref } from 'vue';
import { formatDate } from 'src/utils/date';
import { useString } from 'src/composes/resource.compose';

const authStore = useAuthStore();
const { getString } = useString();

const visibleEditModal = ref(false);
const visibleEditPhotoModal = ref(false);
const visibleEditEmailModal = ref(false);
const visibleEditPasswordModal = ref(false);

const attributes = [
  {
    id: 'name',
    name: getString('profile.label.name'),
  },
  {
    id: 'email',
    name: getString('profile.label.email'),
    render: () =>
      h('div', { class: 'flex items-center gap-x-4' }, [
        h('span', {}, authStore.me.email),
        h(BaseLink, {
          text: 'actions.edit',
          native: true,
          textFromResource: true,
          to: '#',
          onClick: handleEditEmailProfile,
        }),
      ]),
  },
  {
    id: 'photo_url',
    name: getString('profile.label.photo'),
    wrapperClass: 'items-center',
    render: () =>
      h(
        'div',
        { class: 'flex items-center gap-x-3' },
        {
          default: () => [
            h(BaseAvatar, { src: authStore.me.photo_url }),
            h(BaseButton, {
              text: 'Change',
              size: 'sm',
              onClick: handleEditPhotoProfile,
            }),
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

function handleEditProfile() {
  visibleEditModal.value = true;
}
function handleEditPhotoProfile() {
  visibleEditPhotoModal.value = true;
}
function handleEditEmailProfile() {
  visibleEditEmailModal.value = true;
}
function handleEditPasswordProfile() {
  visibleEditPasswordModal.value = true;
}
</script>

<template>
  <div>
    <base-header title="pages.profile" title-from-resource />
    <main>
      <base-container>
        <div class="space-y-4">
          <auth-verification-alert />
          <base-card
            with-header
            :title="getString('profile.title.my-profile')"
            :custom-content="true"
            :classes="{
              header: '!py-4',
            }"
          >
            <template #header-actions>
              <div class="flex items-center gap-x-2">
                <base-button
                  color="indigo"
                  text="profile.title.edit-profile"
                  text-from-resource
                  v-on:click="handleEditProfile"
                />
                <base-button
                  color="indigo"
                  text="profile.title.edit-password"
                  text-from-resource
                  v-on:click="handleEditPasswordProfile"
                />
              </div>
            </template>
            <template #content>
              <base-description
                inline
                :attributes="attributes"
                :data="authStore.me"
              />
            </template>
          </base-card>

          <profile-edit-modal v-model="visibleEditModal" />
          <profile-edit-photo-modal v-model="visibleEditPhotoModal" />
          <profile-edit-email-modal v-model="visibleEditEmailModal" />
          <profile-edit-password-modal v-model="visibleEditPasswordModal" />
        </div>
      </base-container>
    </main>
  </div>
</template>
