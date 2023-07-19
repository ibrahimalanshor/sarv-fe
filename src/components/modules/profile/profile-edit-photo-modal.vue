<script setup>
import { useString } from 'src/composes/resource.compose';
import { useRequest } from 'src/composes/request.compose';
import BaseAlert from 'src/components/base/base-alert.vue';
import BaseModal from 'src/components/base/base-modal.vue';
import BaseInputFile from 'src/components/base/base-input-file.vue';
import BaseButton from 'src/components/base/base-button.vue';
import { computed, reactive, ref } from 'vue';
import { useAuthStore } from 'src/store/modules/auth.module';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['update:modelValue']);

const authStore = useAuthStore();
const { getString } = useString();
const {
  request: updatePhoto,
  validation: updatePhotoValidation,
  loading: loadingUpdatePhoto,
  error: errorUpdatePhoto,
  resetValidation: resetUpdatePhotoValidation,
  resetError: resetUpdatePhotoError,
} = useRequest({
  method: 'patch',
  url: '/api/me/photo',
  formData: true,
});

const form = reactive({
  photo: null,
});

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

async function submitUpdatePhoto() {
  const [success] = await updatePhoto(form);

  if (success) {
    authStore.setMe(success);

    visible.value = false;
  }
}

async function handleSubmit() {
  await submitUpdatePhoto();
}
function handleCloseAlert() {
  resetUpdatePhotoValidation();
  resetUpdatePhotoError();
}
function handleVisible() {
  form.photo = null;

  resetUpdatePhotoValidation();
  resetUpdatePhotoError();
}
</script>

<template>
  <form v-on:submit.prevent="handleSubmit">
    <base-modal
      :title="getString('profile.title.edit-photo')"
      with-header
      with-footer
      v-model="visible"
      v-on:visible="handleVisible"
    >
      <div class="space-y-4">
        <base-alert
          :text="errorUpdatePhoto || updatePhotoValidation.photo"
          type="error"
          :force-visible="
            !!errorUpdatePhoto || !!Object.keys(updatePhotoValidation).length
          "
          v-on:close="handleCloseAlert"
        />

        <base-input-file v-model="form.photo" />
      </div>

      <template #footer="{ close }">
        <div class="flex items-center justify-end gap-x-2">
          <base-button
            type="submit"
            color="indigo"
            text="actions.save"
            :loading="loadingUpdatePhoto"
            text-from-resource
          />
          <base-button
            text="actions.cancel"
            text-from-resource
            v-on:click="close"
          />
        </div>
      </template>
    </base-modal>
  </form>
</template>
