<script setup>
import BaseAlert from 'src/components/base/base-alert.vue';
import BaseButton from 'src/components/base/base-button.vue';
import BaseCard from 'src/components/base/base-card.vue';
import BaseDropdown from 'src/components/base/base-dropdown.vue';
import BaseSkeleton from 'src/components/base/base-skeleton.vue';
import BaseStackedList from 'src/components/base/base-stacked-list.vue';
import TaskStatusBadge from './task-status-badge.vue';
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid';
import { toDate } from 'src/utils/date';
import { useRequest } from 'src/composes/request.compose';
import { useString } from 'src/composes/resource.compose';

const props = defineProps({
  title: {
    type: String,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array,
    required: true,
  },
  emptyText: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['reload']);

const { getString } = useString();
const { url: updateTaskStatusUrl, request: updateTaskStatus } = useRequest({
  method: 'patch',
  url: '/api/tasks',
  notifyOnError: true,
});

const actions = [
  {
    id: 'mark-as-todo',
    name: getString('dashboard.task.actions.mark-as-todo'),
  },
  {
    id: 'mark-as-done',
    name: getString('dashboard.task.actions.mark-as-done'),
  },
];

async function handleClickAction(task, action) {
  updateTaskStatusUrl.value = `/api/tasks/${task.id}/status`;

  const [success] = await updateTaskStatus({
    status: action.id === 'mark-as-todo' ? 'todo' : 'done',
  });

  if (success) {
    emit('reload');
  }
}
</script>

<template>
  <base-card with-header :custom-content="true" :title="props.title">
    <template #header-actions>
      <base-button text="actions.see-more" text-from-resource size="sm" />
    </template>
    <template #content="{ classes }">
      <div v-if="props.loading" :class="classes?.content">
        <base-skeleton />
      </div>
      <template v-else>
        <div v-if="!props.data.length" :class="classes?.content">
          <base-alert
            type="info"
            :text="props.emptyText"
            text-from-resource
            force-visible
            :dismissable="false"
          />
        </div>
        <base-stacked-list v-else :data="props.data">
          <template #name="{ item, classes }">
            <p :class="classes.name">{{ item.name }}</p>
            <task-status-badge :task="item" :badge-props="{ size: 'sm' }" />
          </template>

          <template #description="{ item, classes }">
            <p :class="classes.description">
              <time>{{ item.due_date ? toDate(item.due_date) : '-' }}</time>
            </p>
            <svg viewBox="0 0 2 2" class="h-0.5 w-0.5 fill-current">
              <circle cx="1" cy="1" r="1" />
            </svg>
            <p class="truncate">
              {{ item.category ? item.category.name : '-' }}
            </p>
          </template>

          <template #action="{ item }">
            <base-dropdown
              :items="actions"
              size="sm"
              custom-width="w-32"
              position="right"
              v-on:click-item="(action) => handleClickAction(item, action)"
            >
              <template #toggle="{ toggle }">
                <button v-on:click="toggle">
                  <ellipsis-vertical-icon
                    class="w-5 h-5"
                  ></ellipsis-vertical-icon>
                </button>
              </template>
            </base-dropdown>
          </template>
        </base-stacked-list>
      </template>
    </template>
  </base-card>
</template>
