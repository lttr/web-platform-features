<template>
  <div v-bind="containerProps">
    <div v-bind="wrapperProps">
      <ul v-auto-animate class="flex flex-col gap-2">
        <li
          v-for="{ data: feature } of list"
          :key="feature.id"
          class="max-w-[86ch]"
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
import { vAutoAnimate } from "@formkit/auto-animate"

const props = defineProps<{
  features: WebFeature[]
  displayYears: boolean
}>()

const inputList = computed(() => props.features)

const { list, containerProps, wrapperProps } = useVirtualList(inputList, {
  itemHeight: 65,
  overscan: 20,
})

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
