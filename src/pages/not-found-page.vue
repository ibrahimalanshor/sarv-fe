<script setup>
import { useString } from 'src/composes/resource.compose';
import BaseTitle from 'src/components/base/base-title.vue';
import BaseButton from 'src/components/base/base-button.vue';

const { getString } = useString();
</script>

<template>
  <!--
  This example requires updating your template:

  ```
  <html class="h-full">
  <body class="h-full">
  ```
-->
  <div>
    <p class="text-base font-semibold text-indigo-600">
      {{ getString('404.code') }}
    </p>
    <base-title
      text="404.title"
      text-from-resource
      tight
      :level="1"
      :classes="{ base: 'text-3xl sm:text-5xl mt-4' }"
    />
    <p class="mt-6 text-base leading-7 text-gray-600">
      {{ getString('404.message') }}
    </p>
    <div class="mt-6 flex items-center justify-center gap-x-6">
      <router-link :to="{ name: 'index' }">
        <base-button
          text="404.action"
          color="indigo"
          size="xl"
          text-from-resource
        />
      </router-link>
    </div>
  </div>
</template>
