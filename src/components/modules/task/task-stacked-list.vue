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
import { inject } from 'vue';

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
  actions: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['reload']);

const emitter = inject('emitter');
const { getString } = useString();
const { url: updateTaskStatusUrl, request: updateTaskStatus } = useRequest({
  method: 'patch',
  url: '/api/tasks',
  notifyOnError: true,
});

async function handleClickAction(task, action) {
  updateTaskStatusUrl.value = `/api/tasks/${task.id}/status`;

  const [success] = await updateTaskStatus({
    status: action.value,
  });

  if (success) {
    emitter.emit('task-updated');
  }
}
</script>

<template>
  <base-card with-header :custom-content="true" :title="props.title">
    <template #header-actions>
      <slot name="header-actions">
        <router-link :to="{ name: 'task.index' }">
          <base-button text="actions.see-more" text-from-resource size="sm" />
        </router-link>
      </slot>
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
            <router-link
              :to="{ name: 'task.detail', params: { id: item.id } }"
              :class="classes.name"
              >{{ item.name }}</router-link
            >
            <task-status-badge :task="item" :badge-props="{ size: 'sm' }" />
          </template>

          <template #description="{ item, classes }">
            <p :class="classes.description">
              <time>{{ item.due_date ? toDate(item.due_date) : '-' }}</time>
            </p>
            <svg
              v-if="item.due_date && item.meta.children_count !== 0"
              viewBox="0 0 2 2"
              class="h-0.5 w-0.5 fill-current"
            >
              <circle cx="1" cy="1" r="1" />
            </svg>
            <span v-if="item.meta.children_count !== 0">{{
              getString('task.attributes.sub_task_count', {
                count: item.meta.children_count,
                done: item.meta.children_done_count,
              })
            }}</span>
            <svg
              v-if="item.due_date && item.category"
              viewBox="0 0 2 2"
              class="h-0.5 w-0.5 fill-current"
            >
              <circle cx="1" cy="1" r="1" />
            </svg>
            <p v-if="item.category" class="truncate">
              {{ item.category.name }}
            </p>
          </template>

          <template #action="{ item }">
            <base-dropdown
              :items="actions"
              size="sm"
              custom-width="w-fit"
              position="right"
              :text-wrap="false"
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
