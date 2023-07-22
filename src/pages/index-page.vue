<script setup>
import BaseHeader from 'src/components/base/base-header.vue';
import BaseContainer from 'src/components/base/base-container.vue';
import DashboardTaskInProgressList from 'src/components/modules/dashboard/dashboard-task-in-progress-list.vue';
import DashboardTaskDueTodayList from 'src/components/modules/dashboard/dashboard-task-due-today-list.vue';
</script>

<template>
  <div>
    <base-header title="pages.index" title-from-resource></base-header>
    <main>
      <base-container>
        <div class="grid grid-cols-2 gap-4 items-start">
          <dashboard-task-in-progress-list />
          <dashboard-task-due-today-list />
        </div>
      </base-container>
    </main>
  </div>
</template>
