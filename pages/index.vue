<template>
  <div>
    <div class="flex flex-wrap items-center gap-5 mb-5">
      <section class="flex items-center gap-3">
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
              <span class="capitalize">{{ view }}</span> ({{ count[view] }})
            </div>
          </HRadioGroupOption>
        </HRadioGroup>
      </section>

      <section class="flex items-center gap-3">
        <span class="italic">Sorting:</span>
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
        <span class="italic">Search:</span>
        <UInput
          v-model="searchPattern"
          color="primary"
          variant="outline"
          placeholder="Search..."
        />
      </section>
    </div>
    <FeaturesList :features />
  </div>
</template>

<script lang="ts" setup>
import Fuse from "fuse.js"

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
  sortByDateDescFutureLast: sortByDateDescFutureLast,
  sortByDateDescFutureFirst: sortByDateDescFutureFirst,
  sortByDateAscFutureLast: sortByDateAscFutureLast,
  sortByDateAscFutureFirst: sortByDateAscFutureFirst,
  sortByNameAsc: sortByNameAsc,
  sortByNameDesc: sortByNameDesc,
  sortBySource: sortBySource,
} as const

const currentSortingFunction = computed(() => sortingFunctions[sortBy.value])
const sortBy = ref<keyof typeof sortingFunctions>("sortByDateDescFutureLast")
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
  if (filtered.value.length) {
    return filtered.value
  }
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

const fuseOptions = {
  keys: [{ name: "name", weight: 5 }, "description", "compat_features"],
  includeScore: true,
  threshold: 0.4,
}
const searchPattern = ref<string>("")
const filtered = ref<Feature[]>([])

let fuse: Fuse<Feature> | null = null

onMounted(() => {
  fuse = new Fuse(all.value, fuseOptions)
})

watch(searchPattern, () => {
  if (searchPattern.value === "") {
    filtered.value = []
  } else {
    if (fuse) {
      currentView.value = "all"
      const results = fuse.search(searchPattern.value)
      filtered.value = results.map((x) => x.item).toSorted()
    }
  }
})
</script>

<style scoped></style>
