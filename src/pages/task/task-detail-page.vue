<script setup>
import BaseHeader from 'src/components/base/base-header.vue';
import BaseContainer from 'src/components/base/base-container.vue';
import BaseButton from 'src/components/base/base-button.vue';
import BaseCard from 'src/components/base/base-card.vue';
import BaseInput from 'src/components/base/base-input.vue';
import BaseSkeleton from 'src/components/base/base-skeleton.vue';
import BaseTitle from 'src/components/base/base-title.vue';
import TaskDescription from 'src/components/modules/task/task-description.vue';
import TaskDeleteConfirm from 'src/components/modules/task/task-delete-confirm.vue';
import TaskEditModal from 'src/components/modules/task/task-edit-modal.vue';
import TaskList from 'src/components/modules/task/task-list.vue';
import TaskChildrenStatus from 'src/components/modules/task/task-children-status.vue';
import { reactive, ref } from 'vue';
import { useString } from 'src/composes/resource.compose';
import { useRequest } from 'src/composes/request.compose';
import { useRoute, useRouter } from 'vue-router';
import { useTitle } from 'src/composes/title.compose';
import { useBreadcrumb } from 'src/store/modules/breadcrumb.module';

const route = useRoute();
const router = useRouter();
const { setTitle } = useTitle();
const { getString } = useString();
const breadcrumbStore = useBreadcrumb();
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
const {
  data: taskChildren,
  loading: loadingTaskChildren,
  request: fetchTaskChildren,
} = useRequest({
  method: 'get',
  url: '/api/tasks',
  notifyOnError: true,
  initLoading: true,
  initData: { data: [] },
});

const editModalVisible = ref(false);
const deleteConfirmVisible = ref(false);
const fetchTaskChildrenParams = reactive({
  filter: {
    name: null,
    is_parent: false,
    parent_id: task.value.id,
  },
  page: {
    number: 1,
    size: 10,
  },
});

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

  fetchTaskChildrenParams.filter.parent_id = task.value.id;
  breadcrumbStore.pushBreadcrumbs({
    id: task.value.name,
    name: task.value.name,
    paths: [],
  });

  loadTaskChildren();
  setTitle(task.value.name);
}
async function loadTaskChildren() {
  await fetchTaskChildren({
    params: fetchTaskChildrenParams,
  });
}

function reload() {
  breadcrumbStore.popBreadcrumbs();

  loadTask();
}

function handleEdit() {
  editModalVisible.value = true;
}
function handleDelete() {
  deleteConfirmVisible.value = true;
}
function handleUpdated() {
  reload();
}
function handleDeleted() {
  router.push({ name: 'task.index' });
}
function handleFilterTaskChildren() {
  fetchTaskChildrenParams.page.size = 10;

  loadTaskChildren();
}
function handleReloadTaskChildren() {
  fetchTaskChildrenParams.page.size = 10;

  loadTaskChildren();
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
        <div
          :class="[
            'grid items-start gap-x-4',
            task.is_parent ? 'grid-cols-2' : '',
          ]"
        >
          <base-card
            with-header
            :title="getString('pages.task.detail')"
            :custom-content="true"
          >
            <template #content>
              <task-description
                inline
                :task="task"
                :attributes="
                  task.is_parent
                    ? {
                        children_count: false,
                      }
                    : {
                        category: false,
                        due_date: false,
                        priority: false,
                        description: false,
                      }
                "
                v-model:status="task.status"
                v-on:updated="handleUpdated"
              />
            </template>
          </base-card>

          <base-card
            v-if="task.is_parent"
            with-header
            :classes="{ header: '!py-4' }"
          >
            <template #title>
              <div class="flex items-center gap-x-2">
                <base-title :level="6" semibold>SubTask</base-title>
                <task-children-status :meta="task.meta" />
              </div>
            </template>

            <template #header-actions>
              <base-input
                size="sm"
                type="text"
                placeholder="actions.search"
                placeholder-from-resource
                debounce
                :with-label="false"
                v-model="fetchTaskChildrenParams.filter.name"
                v-on:input="handleFilterTaskChildren"
              />
            </template>

            <task-list
              :data="taskChildren.data"
              :meta="taskChildren.meta"
              :loading="loadingTaskChildren"
              :create-values="{
                parent_id: task.id,
              }"
              :with-filter="false"
              :attributes="{
                category: false,
                meta: false,
              }"
              :detail-attributes="{
                category: false,
                due_date: false,
                priority: false,
                description: false,
              }"
              :filter-justify-end="false"
              :form-inputs="{
                category: false,
                priority: false,
                due_date: false,
                description: false,
              }"
              v-on:reload="handleReloadTaskChildren"
            />
          </base-card>
        </div>
      </base-container>

      <task-edit-modal
        :task="task"
        :inputs="
          !task.is_parent
            ? {
                category: false,
                priority: false,
                due_date: false,
                description: false,
              }
            : {}
        "
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
