<script>
export default {
  name: 'LayoutState',
};
</script>

<template>
  <main class="flex h-screen items-center justify-center bg-white px-6 lg:px-8">
    <div class="text-center">
      <slot />
    </div>
  </main>
</template>
