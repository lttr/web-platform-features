<template>
  <div class="flex flex-wrap items-center gap-5 mb-2 md:mb-5">
    <section class="flex items-center gap-3">
      <span class="italic w-16 md:w-auto">Adoption:</span>
      <HRadioGroup v-model="currentView" class="flex flex-wrap gap-4">
        <HRadioGroupOption
          v-for="view of views"
          :key="view"
          v-slot="{ checked }"
          :value="view"
          as="template"
          @click="currentView = view"
        >
          <div
            class="ring-1 ring-orange-300 dark:ring-orange-700 rounded-sm px-2 py-1 flex items-center gap-2 select-none"
            :class="{
              'bg-orange-300 ring-orange-500 dark:bg-orange-800 dark:ring-orange-700':
                checked,
              'cursor-pointer': !checked,
            }"
          >
            <span
              v-if="view === 'limited'"
              class="w-5 h-5 bg-[url(~/assets/baseline/limited.svg)] dark:bg-[url(~/assets/baseline/limited-dark.svg)] bg-no-repeat bg-center"
            ></span>
            <span
              v-if="view === 'low'"
              class="w-5 h-5 bg-[url(~/assets/baseline/low.svg)] dark:bg-[url(~/assets/baseline/low-dark.svg)] bg-no-repeat bg-center"
            ></span>
            <span
              v-if="view === 'high'"
              class="w-5 h-5 bg-[url(~/assets/baseline/high.svg)] dark:bg-[url(~/assets/baseline/high-dark.svg)] bg-no-repeat bg-center"
            ></span>
            <span class="capitalize">{{ view }}</span> ({{ counts[view] }})
          </div>
        </HRadioGroupOption>
      </HRadioGroup>
    </section>

    <section class="flex items-center gap-3">
      <span class="italic w-16 md:w-auto">Sorting:</span>
      <div class="min-w-64">
        <USelectMenu
          v-model="sortBy"
          :options="sortingOptions"
          value-attribute="value"
          option-attribute="label"
        />
      </div>
    </section>

    <section class="flex items-center gap-3">
      <span class="italic w-16 md:w-auto">Search (fuzzy):</span>
      <UInput
        ref="search"
        :value="searchPattern"
        color="primary"
        variant="outline"
        placeholder="Search..."
        @input="onSearchChange"
      />
      <div class="hidden md:flex items-center gap-0.5 text-gray-300">
        <UKbd value="meta" />
        <UKbd>K</UKbd>
      </div>
    </section>

    <section class="ml-auto md:ml-8 flex items-center gap-2">
      <span class="italic w-16 md:w-auto">Group:</span>
      <UInputMenu
        v-model="selectedGroup"
        value-attribute="key"
        option-attribute="name"
        :options="groups"
        placeholder="Select a group"
        by="key"
        :search-attributes="['key', 'name']"
      />
    </section>

    <section class="ml-auto md:ml-8">
      <UButton variant="outline" @click="onResetFilter">Reset filters</UButton>
    </section>
  </div>
</template>

<script lang="ts" setup>
const views = Views

defineProps<{
  counts: {
    [view in View]: number
  }
  groups: Array<{ key: string; name: string }>
  searchPattern: string
}>()

const emit = defineEmits<{
  "update:searchPattern": [text: string]
  resetFilter: []
}>()

function onResetFilter() {
  emit("resetFilter")
}

function searchChange(value: string) {
  emit("update:searchPattern", value)
}
const debouncedSearchChange = useDebounceFn(searchChange, 200)

function onSearchChange(e: Event) {
  debouncedSearchChange((e.target as HTMLInputElement).value)
}

const sortBy = defineModel<SortingFunctionsName>("sortBy", {
  required: true,
})

const currentView = defineModel<View>("currentView", {
  required: true,
})

const selectedGroup = defineModel<string>("selectedGroup", {
  required: true,
})

const sortingOptions = [
  {
    value: "sortByDateDescFutureLast",
    label: "by date (descending, future last)",
  },
  {
    value: "sortByDateDescFutureFirst",
    label: "by date (descending, future first)",
  },
  {
    value: "sortByDateAscFutureLast",
    label: "by date (ascending, future last)",
  },
  {
    value: "sortByDateAscFutureFirst",
    label: "by date (ascending, future first)",
  },
  {
    value: "sortByNameAsc",
    label: "by name (ascending)",
  },
  {
    value: "sortByNameDesc",
    label: "by name (descending)",
  },
  {
    value: "sortBySource",
    label: "source order",
  },
]

const search = ref<{ input: HTMLInputElement } | null>(null)

defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
      search.value?.input.focus()
    },
  },
})
</script>
