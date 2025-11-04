<template>
  <div>
    <div :style="containerStyle">
      <ul class="flex flex-col gap-2" :style="listStyle">
        <li
          v-for="feature of displayedFeatures"
          :key="feature.id"
          class="max-w-[86ch] [content-visibility:auto] [contain-intrinsic-size:auto_65px]"
        >
          <div
            v-if="displayYears && isDifferentYear(feature)"
            :id="`year-${getYear(feature)}`"
            class="my-3 text-2xl"
          >
            {{ getYear(feature) }}
          </div>
          <BaselineIndicator :feature />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  features: WebFeature[]
  displayYears: boolean
}>()

const ITEM_HEIGHT = 65
const OVERSCAN = 20

const isClient = ref(false)

onMounted(() => {
  isClient.value = true
})

const { y: scrollY } = useWindowScroll()
const { height: windowHeight } = useWindowSize()

const totalHeight = computed(() => props.features.length * ITEM_HEIGHT)

const visibleStartIndex = computed(() => {
  if (!isClient.value) return 0
  return Math.max(0, Math.floor(scrollY.value / ITEM_HEIGHT) - OVERSCAN)
})

const visibleEndIndex = computed(() => {
  if (!isClient.value) return props.features.length - 1
  return Math.min(
    props.features.length - 1,
    Math.floor((scrollY.value + windowHeight.value) / ITEM_HEIGHT) + OVERSCAN,
  )
})

const displayedFeatures = computed(() =>
  props.features.slice(visibleStartIndex.value, visibleEndIndex.value + 1),
)

const visibleStartY = computed(() =>
  isClient.value ? visibleStartIndex.value * ITEM_HEIGHT : 0,
)

const containerStyle = computed(() =>
  isClient.value ? { height: `${totalHeight.value}px` } : {},
)

const listStyle = computed(() =>
  isClient.value ? { transform: `translateY(${visibleStartY.value}px)` } : {},
)

let lastYearSeen = -1

function isDifferentYear(feature: WebFeature): boolean {
  const date = feature.status.baseline_low_date
  if (date) {
    const year = new Date(date).getFullYear()
    if (lastYearSeen !== year) {
      lastYearSeen = year
      return true
    }
  }
  return false
}

function getYear(feature: WebFeature): string {
  const date = feature.status.baseline_low_date
  if (date) {
    return new Date(date).getFullYear().toString()
  }
  return ""
}
</script>
