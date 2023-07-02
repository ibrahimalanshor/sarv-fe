<script setup>
import { useString } from 'src/composes/resource.compose';
import WithLoader from 'src/components/compose/with-loader.vue';

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const { getString } = useString();
</script>

<template>
  <div class="flow-root">
    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div
          class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg"
        >
          <with-loader :loading="props.loading">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="column in props.columns"
                    :key="column.id"
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 first:pl-4 first:pr-3 first:sm:pl-6"
                    :class="column.headerClass"
                  >
                    {{ column.name }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <template v-if="!props.data.length">
                  <tr>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 first:pl-4 first:pr-3 first:sm:pl-6"
                      :colspan="props.columns.length"
                    >
                      {{ getString('message.empty') }}
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr v-for="item in props.data" :key="item.id">
                    <td
                      v-for="column in props.columns"
                      :key="column.id"
                      class="whitespace-nowrap px-3 py-4 text-sm first:pl-4 first:pr-3 first:sm:pl-6"
                      :class="[
                        column.bold
                          ? 'font-medium text-gray-900'
                          : 'text-gray-500',
                      ]"
                    >
                      <component
                        v-if="column.render"
                        :is="column.render"
                        :item="item"
                      />
                      <p v-else>
                        {{
                          column.value
                            ? typeof column.value === 'function'
                              ? column.value(item)
                              : column.value
                            : item[column.id]
                        }}
                      </p>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </with-loader>
        </div>
      </div>
    </div>
  </div>
</template>
