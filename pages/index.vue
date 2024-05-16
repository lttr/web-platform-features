<template>
  <div>
    <div class="flex flex-wrap items-center gap-5 mb-5">
      <div class="flex items-center gap-3">
        <span class="italic">Adoption:</span>
        <HRadioGroup v-model="currentView" class="flex gap-4">
          <HRadioGroupOption
            v-for="view of views"
            :key="view"
            v-slot="{ checked }"
            :value="view"
            as="template"
            @click="currentView = view"
          >
            <div
              class="ring-2 ring-slate-200 dark:ring-slate-600 rounded-sm px-2 py-1 flex items-center gap-2 select-none"
              :class="{
                'bg-slate-300 ring-slate-400 dark:bg-slate-700 dark:ring-slate-500':
                  checked,
                'cursor-pointer': !checked,
              }"
            >
              <span
                v-if="view !== 'all'"
                :class="`w-5 h-5 bg-[url(~/assets/baseline/${view}.svg)]
              dark:bg-[url(~/assets/baseline/${view}-dark.svg)] bg-no-repeat
              bg-center`"
              ></span>
              <span class="capitalize">{{ view }}</span> ({{ count[view] }})
            </div>
          </HRadioGroupOption>
        </HRadioGroup>
      </div>
      <div class="flex items-center gap-3">
        <span class="italic">Sorting:</span>
        <USelectMenu
          v-model="sortBy"
          :options="sortingOptions"
          color="slate"
          value-attribute="value"
          option-attribute="label"
        />
      </div>
    </div>
    <FeaturesList :features />
  </div>
</template>

<script lang="ts" setup>
const views = ["all", "limited", "low", "high"] as const
type View = (typeof views)[number]
const currentView = ref<View>("all")

const { data } = await useFetch<Features>("/api/features", {
  default: () => [],
})

const sortByDateDescFutureLast = (a: Feature, b: Feature): number => {
  const aDate = a.status.baseline_low_date
  const bDate = b.status.baseline_low_date
  if (aDate && bDate) {
    return new Date(bDate).getTime() - new Date(aDate).getTime()
  } else if (!aDate && bDate) {
    return 1
  } else if (aDate && !bDate) {
    return -1
  } else {
    return 0
  }
}

const sortByDateAscFutureFirst = (a: Feature, b: Feature): number => {
  const aDate = a.status.baseline_low_date
  const bDate = b.status.baseline_low_date
  if (aDate && bDate) {
    return new Date(aDate).getTime() - new Date(bDate).getTime()
  } else if (!aDate && bDate) {
    return -1
  } else if (aDate && !bDate) {
    return 1
  } else {
    return 0
  }
}

const sortByDateDescFutureFirst = (a: Feature, b: Feature): number => {
  const aDate = a.status.baseline_low_date
  const bDate = b.status.baseline_low_date
  if (aDate && bDate) {
    return new Date(bDate).getTime() - new Date(aDate).getTime()
  } else if (!aDate && bDate) {
    return -1
  } else if (aDate && !bDate) {
    return 1
  } else {
    return 0
  }
}

const sortByDateAscFutureLast = (a: Feature, b: Feature): number => {
  const aDate = a.status.baseline_low_date
  const bDate = b.status.baseline_low_date
  if (aDate && bDate) {
    return new Date(aDate).getTime() - new Date(bDate).getTime()
  } else if (!aDate && bDate) {
    return 1
  } else if (aDate && !bDate) {
    return -1
  } else {
    return 0
  }
}

const sortByNameAsc = (a: Feature, b: Feature): number => {
  return a.name.localeCompare(b.name)
}

const sortByNameDesc = (a: Feature, b: Feature): number => {
  return b.name.localeCompare(a.name)
}

const sortBySource = (): number => 0

const sortingFunctions = {
  sortByDateAscFutureFirst: sortByDateAscFutureFirst,
  sortByDateAscFutureLast: sortByDateAscFutureLast,
  sortByDateDescFutureFirst: sortByDateDescFutureFirst,
  sortByDateDescFutureLast: sortByDateDescFutureLast,
  sortByNameAsc: sortByNameAsc,
  sortByNameDesc: sortByNameDesc,
  sortBySource: sortBySource,
} as const

const currentSortingFunction = computed(() => sortingFunctions[sortBy.value])
const sortBy = ref<keyof typeof sortingFunctions>("sortByDateDescFutureFirst")
const sortingOptions = [
  {
    value: "sortByDateAscFutureFirst",
    label: "by date (ascending, future first)",
  },
  {
    value: "sortByDateAscFutureLast",
    label: "by date (ascending, future last)",
  },
  {
    value: "sortByDateDescFutureFirst",
    label: "by date (descending, future first)",
  },
  {
    value: "sortByDateDescFutureLast",
    label: "by date (descending, future last)",
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

const all = computed(() => data.value.toSorted(currentSortingFunction.value))
const limited = computed(() =>
  data.value
    .filter((f) => !f.status.baseline)
    .toSorted(currentSortingFunction.value),
)
const low = computed(() =>
  data.value
    .filter((f) => f.status.baseline === "low")
    .toSorted(currentSortingFunction.value),
)
const high = computed(() =>
  data.value
    .filter((f) => f.status.baseline === "high")
    .toSorted(currentSortingFunction.value),
)

const count = {
  all: computed(() => all.value.length),
  limited: computed(() => limited.value.length),
  low: computed(() => low.value.length),
  high: computed(() => high.value.length),
}

const features = computed(() => {
  switch (currentView.value) {
    case "all":
      return all.value
    case "limited":
      return limited.value
    case "low":
      return low.value
    case "high":
      return high.value
    default:
      currentView.value satisfies never
      return []
  }
})
</script>

<style scoped></style>
