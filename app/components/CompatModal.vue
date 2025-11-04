<template>
  <UModal v-model:open="open" title="Browser compat data names">
    <template #body>
      <ul class="max-h-96 overflow-y-auto">
        <li
          v-for="compatFeature of compatFeaturesEnhanced"
          :key="compatFeature.name"
          class="list-disc ms-6 mb-2"
        >
          <div class="flex gap-2">
            <span class="truncate">{{ compatFeature.name }}</span>

            <span v-if="compatFeature.mdnUrl" class="min-w-fit">
              <NuxtLink
                class="underline underline-offset-2"
                :to="compatFeature.mdnUrl"
                target="_blank"
              >
                MDN
              </NuxtLink>
            </span>

            <span class="min-w-fit">
              <NuxtLink
                class="underline underline-offset-2"
                :to="`https://caniuse.com/?search=${compatFeature.name}`"
                target="_blank"
              >
                Can I Use
              </NuxtLink>
            </span>
          </div>
        </li>
      </ul>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { EnhancedCompatFeature } from "~/utils/web-features-output"

const { compatFeaturesEnhanced } = defineProps<{
  compatFeaturesEnhanced: EnhancedCompatFeature[]
}>()

const open = defineModel<boolean>()
</script>
