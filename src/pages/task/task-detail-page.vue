<script setup>
import BaseHeader from 'src/components/base/base-header.vue';
import BaseContainer from 'src/components/base/base-container.vue';
import BaseButton from 'src/components/base/base-button.vue';
import BaseCard from 'src/components/base/base-card.vue';
import BaseSkeleton from 'src/components/base/base-skeleton.vue';
import BaseTitle from 'src/components/base/base-title.vue';
import TaskDescription from 'src/components/modules/task/task-description.vue';
import TaskDeleteConfirm from 'src/components/modules/task/task-delete-confirm.vue';
import TaskEditModal from 'src/components/modules/task/task-edit-modal.vue';
import { ref } from 'vue';
import { useString } from 'src/composes/resource.compose';
import { useRequest } from 'src/composes/request.compose';
import { useRoute, useRouter } from 'vue-router';
import { useTitle } from 'src/composes/title.compose';

const route = useRoute();
const router = useRouter();
const { setTitle } = useTitle();
const { getString } = useString();
const {
  data: task,
  loading: fetchTaskLoading,
  request: fetchTask,
  url: fetchTaskUrl,
} = useRequest({
  method: 'get',
  url: '/api/tasks',
  initLoading: true,
  initData: {
    meta: {},
  },
});

const editModalVisible = ref(false);
const deleteConfirmVisible = ref(false);

async function loadTask() {
  fetchTaskUrl.value = `/api/tasks/${route.params.id}`;

  const [success] = await fetchTask({
    params: {
      include: ['category', 'children_count', 'children_done_count'],
    },
  });

  if (!success) {
    router.push({ name: '404' });
  }

  setTitle(task.value.name);
}

function handleEdit() {
  editModalVisible.value = true;
}
function handleDelete() {
  deleteConfirmVisible.value = true;
}
function handleUpdated() {
  loadTask();
}
function handleDeleted() {
  router.push({ name: 'task.index' });
}

loadTask();
</script>

<template>
  <div>
    <base-header :title-loading="fetchTaskLoading">
      <template #title>
        <base-skeleton class="w-1/4 !h-10" v-if="fetchTaskLoading" />
        <template v-else>
          <div class="flex items-center gap-x-4">
            <base-title :level="3">{{ task.name }}</base-title>
          </div>
        </template>
      </template>

      <template #action>
        <div class="flex items-center gap-x-2">
          <base-button
            text="actions.edit"
            color="indigo"
            text-from-resource
            v-on:click="handleEdit"
          />
          <base-button
            text="actions.delete"
            color="red"
            text-from-resource
            v-on:click="handleDelete"
          />
        </div>
      </template>
    </base-header>
    <main>
      <base-container>
        <base-card
          with-header
          :title="getString('pages.task.detail')"
          :custom-content="true"
        >
          <template #content>
            <task-description
              inline
              :task="task"
              v-model:status="task.status"
              v-on:updated="handleUpdated"
            />
          </template>
        </base-card>
      </base-container>

      <task-edit-modal
        :task="task"
        v-model="editModalVisible"
        v-on:updated="handleUpdated"
      />
      <task-delete-confirm
        :task="task"
        v-model="deleteConfirmVisible"
        v-on:deleted="handleDeleted"
      />
    </main>
  </div>
</template>
