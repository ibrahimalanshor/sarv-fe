<script setup>
import { useRequest } from 'src/composes/request.compose';
import { useString } from 'src/composes/resource.compose';
import BaseWidget from 'src/components/base/base-widget.vue';
import BaseSkeleton from 'src/components/base/base-skeleton.vue';

const { getString } = useString();
const { data, loading, request } = useRequest({
  method: 'get',
  url: '/api/overview/task',
  notifyOnError: true,
  initLoading: true,
  initData: {},
});

async function loadOverviewTask() {
  await request();
}

loadOverviewTask();
</script>

<template>
  <div class="space-y-4">
    <base-skeleton v-if="loading" class="!h-32" />
    <template v-else>
      <dl class="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <base-widget
          v-for="[name, value] in Object.entries(data)"
          :key="name"
          :name="getString(`overview.task.name.${name}`)"
          :value="value"
        />
      </dl>
    </template>
  </div>
</template>
