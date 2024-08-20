<template>
  <div>
    <div class="mt-2 mb-4">
      <HeaderDescription :wf="data.wf" :bcd="data.bcd" />
    </div>
    <FeaturesFilter
      v-model:current-view="currentView"
      v-model:sort-by="sortBy"
      v-model:search-pattern="searchPattern"
      :counts
      @reset-filter="onResetFilter"
    />
    <div>
      <FeaturesList
        :features="filteredFeatures"
        :display-years="isSortedByDate && !searchPattern"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Fuse from "fuse.js"

// Filtering and sorting state

const route = useRoute()

const DEFAULT_VIEW = "all"
const queryView = route.query.view as View
const initialView: View = Views.includes(queryView) ? queryView : DEFAULT_VIEW
const currentView = ref<View>(initialView)

const DEFAULT_SORT_BY = "sortByDateDescFutureLast"
const querySortBy = route.query.sort as SortingFunctionsName
const initialSortBy: SortingFunctionsName = Object.keys(
  sortingFunctions,
).includes(querySortBy)
  ? querySortBy
  : DEFAULT_SORT_BY
const sortBy = ref<SortingFunctionsName>(initialSortBy)

const DEFAULT_SEARCH = ""
const querySearchPattern = route.query.search as string
const initialSearchPattern: string = querySearchPattern ?? DEFAULT_SEARCH
const searchPattern = ref<string>(initialSearchPattern)

function onResetFilter() {
  currentView.value = DEFAULT_VIEW
  sortBy.value = DEFAULT_SORT_BY
  searchPattern.value = DEFAULT_SEARCH
}

// Data fetching

const { data } = await useFetch<WebFeaturesPackage>("/api/features", {
  deep: false,
  default: () => {
    return {
      features: [] as WebFeature[],
      bcd: {
        htmlUrl: "",
        version: "",
        publishedAt: "",
      },
      wf: {
        htmlUrl: "",
        version: "",
        publishedAt: "",
      },
    }
  },
})

// Computed data

const filtered = shallowRef<WebFeature[]>([])

const features = computed(() => data.value?.features || [])
const currentSortingFunction = computed(() => sortingFunctions[sortBy.value])
const isSortedByDate = computed(() => sortBy.value.includes("Date"))

const all = computed(() =>
  features.value.toSorted(currentSortingFunction.value),
)
const limited = computed(() =>
  features.value
    .filter((f: WebFeature) => !f.status.baseline)
    .toSorted(currentSortingFunction.value),
)
const low = computed(() =>
  features.value
    .filter((f: WebFeature) => f.status.baseline === "low")
    .toSorted(currentSortingFunction.value),
)
const high = computed(() =>
  features.value
    .filter((f: WebFeature) => f.status.baseline === "high")
    .toSorted(currentSortingFunction.value),
)

const counts = {
  all: computed(() => all.value.length),
  limited: computed(() => limited.value.length),
  low: computed(() => low.value.length),
  high: computed(() => high.value.length),
}

const filteredFeatures = computed(() => {
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

// Searching

let fuse: Fuse<WebFeature> | null = null

onMounted(() => {
  const fuseOptions = {
    keys: [{ name: "name", weight: 5 }, "description", "compat_features"],
    includeScore: true,
    threshold: 0.4,
  }
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

// URL synchronization

watch([currentView, searchPattern, sortBy], () => {
  let search: { search?: string } = {}
  if (searchPattern.value) {
    search = { search: searchPattern.value }
  }
  navigateTo({
    query: {
      ...search,
      view: currentView.value,
      sort: sortBy.value,
    },
  })
})
</script>
