<script setup>
const props = defineProps({
  attributes: {
    type: Array,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
    <div
      v-for="attribute in props.attributes"
      :key="attribute.id"
      :class="[
        'border-gray-100',
        attribute.fullwidth ? 'col-span-full' : 'sm:col-span-1',
      ]"
    >
      <dt class="text-sm font-medium leading-6 text-gray-900">
        {{ attribute.name }}
      </dt>
      <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
        <slot :name="attribute.id">
          <component v-if="attribute.render" :is="attribute.render" />
          <span v-else>{{
            attribute.value ? attribute.value : props.data[attribute.id]
          }}</span>
        </slot>
      </dd>
    </div>
  </dl>
</template>
