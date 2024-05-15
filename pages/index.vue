<template>
  <div>
    <div class="flex gap-3">
      <UButton variant="outline" color="violet" @click="view = 'all'"
        >All</UButton
      >
      <UButton variant="outline" color="orange" @click="view = 'limited'">
        Limited availability
        <template #trailing>
          <span
            class="w-5 h-5 bg-[url(~/assets/baseline/limited.svg)] dark:bg-[url(~/assets/baseline/limited-dark.svg)] bg-no-repeat bg-center"
          ></span>
        </template>
      </UButton>
      <UButton variant="outline" color="sky" @click="view = 'newly'">
        Newly available
        <template #trailing>
          <span
            class="w-5 h-5 bg-[url(~/assets/baseline/low.svg)] dark:bg-[url(~/assets/baseline/low-dark.svg)] bg-no-repeat bg-center"
          ></span>
        </template>
      </UButton>
      <UButton variant="outline" color="green" @click="view = 'widely'">
        Widely available
        <template #trailing>
          <span
            class="w-5 h-5 bg-[url(~/assets/baseline/high.svg)] dark:bg-[url(~/assets/baseline/high-dark.svg)] bg-no-repeat bg-center"
          ></span>
        </template>
      </UButton>
    </div>
    <FeaturesList :features />
  </div>
</template>

<script lang="ts" setup>
type View = "all" | "limited" | "newly" | "widely"
const view = ref<View>("all")

const { data } = await useFetch<Features>("/api/features", {
  default: () => [],
})

const all = () => data.value
const limited = () => data.value.filter((f) => !f.status.baseline)
const newly = () => data.value.filter((f) => f.status.baseline === "low")
const widely = () => data.value.filter((f) => f.status.baseline === "high")

const features = computed(() => {
  switch (view.value) {
    case "all":
      return all()
    case "limited":
      return limited()
    case "newly":
      return newly()
    case "widely":
      return widely()
    default:
      view.value satisfies never
      return undefined
  }
})
</script>

<style scoped></style>
