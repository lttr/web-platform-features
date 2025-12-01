<template>
  <div>
    <div class="mt-2 mb-1 md:mb-4">
      <HeaderDescription :wf="data.wf" :bcd="data.bcd" />
    </div>
    <FeaturesFilter
      v-model:current-view="currentView"
      v-model:sort-by="sortBy"
      v-model:search-pattern="searchPattern"
      v-model:selected-group="selectedGroup"
      :groups
      :counts
      @reset-filter="onResetFilter"
    />
    <div>
      <FeaturesList
        class="feature-list"
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

const DEFAULT_GROUP = ""
const queryGroupPattern = route.query.group as string
const initialGroupPattern: string = queryGroupPattern ?? DEFAULT_SEARCH
const selectedGroup = ref<string>(initialGroupPattern)

const fuseOptions = {
  keys: [
    { name: "name", weight: 5 },
    { name: "description", weight: 1 },
    { name: "compat_features", weight: 1 },
  ],
  includeScore: true,
  useExtendedSearch: true,
  threshold: 0.4,
  verbose: true,
}

function onResetFilter() {
  currentView.value = DEFAULT_VIEW
  sortBy.value = DEFAULT_SORT_BY
  searchPattern.value = DEFAULT_SEARCH
  selectedGroup.value = DEFAULT_GROUP
}

// Data fetching

const { data } = await useFetch("/api/features", {
  deep: false,
  default: () => {
    return {
      features: [] as WebFeature[],
      groups: {} as OriginalGroup,
      snapshots: {} as OriginalSnapshot,
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

const features = computed(() => data.value?.features ?? [])
const groups = computed(() => {
  // Force reactivity by accessing data.value first
  const currentData = data.value
  const groupsData = currentData?.groups
  if (!groupsData) {
    return []
  }

  return Object.entries(groupsData).map(([key, value]) => ({
    value: key,
    label: value.name,
  }))
})
// const snapshots = computed(() => Object.entries(data.value?.snapshots) ?? [])
const currentSortingFunction = computed(() => sortingFunctions[sortBy.value])
const isSortedByDate = computed(() => sortBy.value.includes("Date"))

const filteredFeatures = shallowRef<WebFeature[]>([])

function hasGroup(feature: WebFeature, group: string): boolean {
  if (Array.isArray(feature.group)) {
    return feature.group.includes(group)
  } else if (feature.group) {
    return feature.group === group
  }
  return false
}

// Compute counts separately - only depends on raw features, not filtering/search
const counts = computed(() => {
  let limited = 0
  let low = 0
  let high = 0

  for (const feature of features.value) {
    if (!feature.status.baseline) {
      limited += 1
    }
    if (feature.status.baseline === "low") {
      low += 1
    }
    if (feature.status.baseline === "high") {
      high += 1
    }
  }

  return {
    all: features.value.length,
    limited,
    low,
    high,
  }
})

watch(
  [features, currentSortingFunction, currentView, searchPattern, selectedGroup],
  () => {
    let tempFilteredFeatures: WebFeature[] = []

    for (const feature of features.value) {
      const filterConditions = {
        all: () => true,
        limited: () => !feature.status.baseline,
        low: () => feature.status.baseline === "low",
        high: () => feature.status.baseline === "high",
      }

      if (filterConditions[currentView.value]()) {
        if (selectedGroup.value && !hasGroup(feature, selectedGroup.value)) {
          continue
        }
        tempFilteredFeatures.push(feature)
      }
    }

    if (searchPattern.value !== "") {
      const fuse = new Fuse(tempFilteredFeatures, fuseOptions)
      const results = fuse.search(searchPattern.value)
      tempFilteredFeatures = results.map((x) => x.item)
      filteredFeatures.value = tempFilteredFeatures
    } else {
      filteredFeatures.value = tempFilteredFeatures.toSorted(
        currentSortingFunction.value,
      )
    }
  },
  { immediate: true },
)

// URL synchronization

watch([currentView, searchPattern, sortBy, selectedGroup], () => {
  let search: { search?: string } = {}
  if (searchPattern.value) {
    search = { search: searchPattern.value }
  }
  navigateTo({
    query: {
      ...search,
      view: currentView.value,
      sort: sortBy.value,
      group: selectedGroup.value,
    },
  })
})
</script>

<style scoped>
.feature-list {
  height: max(80dvh, 800px);
}
</style>
