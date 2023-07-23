<script setup>
import BaseHeader from 'src/components/base/base-header.vue';
import BaseContainer from 'src/components/base/base-container.vue';
import OverviewTaskWidget from '../components/modules/overview/task/overview-task-widget.vue';
import DashboardTaskInProgressList from 'src/components/modules/dashboard/dashboard-task-in-progress-list.vue';
import DashboardTaskDueTodayList from 'src/components/modules/dashboard/dashboard-task-due-today-list.vue';
</script>

<template>
  <div>
    <base-header title="pages.index" title-from-resource></base-header>
    <main>
      <base-container>
        <div class="space-y-4">
          <overview-task-widget />
          <div class="grid grid-cols-2 gap-4 items-start">
            <dashboard-task-in-progress-list />
            <dashboard-task-due-today-list />
          </div>
        </div>
      </base-container>
    </main>
  </div>
</template>
