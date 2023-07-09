<script setup>
import { useRequest } from 'src/composes/request.compose';
import { useString } from 'src/composes/resource.compose';
import BaseHeader from 'src/components/base/base-header.vue';
import BaseContainer from 'src/components/base/base-container.vue';
import BaseTable from 'src/components/base/base-table.vue';
import BaseInput from 'src/components/base/base-input.vue';
import BaseButton from 'src/components/base/base-button.vue';
import TaskCategoryCreateModal from 'src/components/modules/task-category/task-category-create-modal.vue';
import TaskCategoryDetailModal from 'src/components/modules/task-category/task-category-detail-modal.vue';
import { h, reactive, ref } from 'vue';

const { getString } = useString();
const { data, loading, request } = useRequest({
  method: 'get',
  url: '/api/task-categories',
  notifyOnError: true,
  initLoading: true,
  initData: { data: [], meta: {} },
});

const fetchTasksCategoryParams = reactive({
  sort: '-id',
  page: {
    number: 1,
    size: 5,
  },
  filter: {
    name: null,
  },
});
const visibleCreateModal = ref(false);
const detailModal = reactive({
  visible: false,
  taskCategoryId: null,
});

const tableColumns = [
  {
    id: 'name',
    name: getString('task-category.attributes.name'),
    bold: true,
    render: ({ item }) =>
      h(
        'a',
        {
          href: '#',
          class: 'hover:underline',
          onClick: () => handleDetail(item),
        },
        item.name
      ),
  },
];

async function loadTaskCategories() {
  await request({
    params: fetchTasksCategoryParams,
  });
}
function resetPage() {
  fetchTasksCategoryParams.page.number = 1;
  fetchTasksCategoryParams.page.size = 5;
}
function resetFilter() {
  fetchTasksCategoryParams.filter.name = null;
}
function refresh() {
  resetPage();
  resetFilter();
  loadTaskCategories();
}
function reload() {
  resetPage();
  loadTaskCategories();
}

function handleFilter() {
  reload();
}
function handleChangeSort() {
  reload();
}
function handleChangePage() {
  loadTaskCategories();
}
function handleCreate() {
  visibleCreateModal.value = true;
}
function handleRefresh() {
  refresh();
}
function handleDetail(item) {
  detailModal.taskCategoryId = item.id;
  detailModal.visible = true;
}

loadTaskCategories();
</script>

<template>
  <div>
    <base-header title="pages.task-category.index" title-from-resource>
      <template #action>
        <base-button
          text="task-category.actions.create"
          color="indigo"
          text-from-resource
          v-on:click="handleCreate"
        />
      </template>
    </base-header>
    <main>
      <base-container>
        <div class="space-y-4">
          <div class="flex gap-x-2 justify-end">
            <base-input
              type="text"
              placeholder="actions.search"
              placeholder-from-resource
              debounce
              :with-label="false"
              v-model="fetchTasksCategoryParams.filter.name"
              v-on:input="handleFilter"
            />
          </div>
          <base-table
            :columns="tableColumns"
            :data="data.data"
            :loading="loading"
            :meta="data.meta"
            with-pagination
            with-footer
            v-model:sort="fetchTasksCategoryParams.sort"
            v-model:page="fetchTasksCategoryParams.page.number"
            v-on:change-sort="handleChangeSort"
            v-on:change-page="handleChangePage"
          />
        </div>
      </base-container>
    </main>
    <task-category-create-modal
      v-model="visibleCreateModal"
      v-on:created="handleRefresh"
    />
    <task-category-detail-modal
      :task-category-id="detailModal.taskCategoryId"
      v-model="detailModal.visible"
      v-on:updated="handleRefresh"
      v-on:deleted="handleRefresh"
    />
  </div>
</template>
