<script setup>
import { useRequest } from 'src/composes/request.compose';
import BaseHeader from 'src/components/base/base-header.vue';
import BaseContainer from 'src/components/base/base-container.vue';
import BaseTable from 'src/components/base/base-table.vue';

const { error, loading, request } = useRequest({
  method: 'get',
  url: '/api/tasks',
  notifyOnError: true,
  initLoading: true,
});

const tableColumns = [
  {
    id: 'name',
    name: 'Name',
  },
  {
    id: 'category',
    name: 'Category',
  },
];

async function fetchTasks() {
  await request();
}

fetchTasks();
</script>

<template>
  <div>
    <base-header title="pages.task.index" title-from-resource></base-header>
    <main>
      <base-container>
        <base-table :columns="tableColumns" :data="[]" :loading="loading" />
      </base-container>
    </main>
  </div>
</template>
