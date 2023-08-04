<script setup>
import BaseBreadcrumb from 'src/components/base/base-breadcrumb.vue';
import { useBreadcrumb } from 'src/store/modules/breadcrumb.module';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const breadcrumbStore = useBreadcrumb();

router.afterEach(() => breadcrumbStore.setBreadcrumbsFromRouteMeta());

onMounted(() => breadcrumbStore.setBreadcrumbsFromRouteMeta());
</script>

<template>
  <base-breadcrumb
    :home-path="{ name: 'index' }"
    :items="breadcrumbStore.breadcrumbs"
  />
</template>
