<template>
  <details
    class="baseline-indicator px-3 py-2 rounded bg-blue-50 dark:bg-slate-800"
    :class="{
      low: feature.status.baseline === 'low',
      high: feature.status.baseline === 'high',
    }"
  >
    <summary class="flex justify-between flex-wrap items-center cursor-pointer">
      <div class="flex gap-3 items-center">
        <h2 class="font-semibold max-w-[25ch]">{{ feature.name }}</h2>
      </div>

      <div class="flex flex-wrap gap-2 items-center">
        <div>
          <span v-if="!feature.status.baseline" class="flex items-center gap-2">
            <span
              class="w-5 h-5 bg-[url(~/assets/baseline/limited.svg)] dark:bg-[url(~/assets/baseline/limited-dark.svg)] bg-no-repeat bg-center"
            ></span>
            <span class="italic text-sm">Limited</span>
          </span>

          <span
            v-if="feature.status.baseline === 'low'"
            class="flex items-center gap-2"
          >
            <span
              class="w-5 h-5 bg-[url(~/assets/baseline/low.svg)] dark:bg-[url(~/assets/baseline/low-dark.svg)] bg-no-repeat bg-center"
            ></span>
            <span class="italic text-sm">Newly available</span>
          </span>

          <span
            v-if="feature.status.baseline === 'high'"
            class="flex items-center gap-2"
          >
            <span
              class="w-5 h-5 bg-[url(~/assets/baseline/high.svg)] dark:bg-[url(~/assets/baseline/high-dark.svg)] bg-no-repeat bg-center"
            ></span>
            <span class="italic text-sm">Widely available</span>
          </span>
        </div>
        <span
          v-for="{ name, browsers } of ENGINES"
          :key="name"
          class="engine"
          :title="engineTitle(browsers)"
        >
          <span
            v-for="browser of browsers"
            :key="browser.ids[0]"
            class="browser"
            :class="`${browser.ids[0]} ${supported(browser) ? 'supported' : ''}`"
            role="img"
            :aria-label="`${browser.name} ${supported(browser) ? 'check' : 'cross'}`"
          ></span>
        </span>

        <span :title="`Supported since ${lowDateFull}`" class="min-w-[7ch]">
          {{ lowDateShort }}
        </span>

        <UIcon class="chevron" name="i-heroicons-chevron-down" />
      </div>
    </summary>

    <div class="py-4 flex flex-col gap-4">
      <div>
        <h3 class="text-sm font-semibold mb-1">Description</h3>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-html="feature.description_html"></p>
      </div>

      <div>
        <h3 class="text-sm font-semibold mb-1">Support</h3>
        <ul>
          <li
            v-for="browser of objectKeys(feature.status.support)"
            :key="browser"
            class="list-disc ms-6"
          >
            {{ browser }} {{ feature.status.support[browser] }}
          </li>
        </ul>
      </div>

      <div>
        <h3 class="text-sm font-semibold mb-1">Links</h3>
        <NuxtLink
          class="underline underline-offset-2"
          :to="`https://webstatus.dev/features/${feature.id}`"
        >
          Web platform tests status at webstatus.dev
        </NuxtLink>
      </div>

      <div>
        <h3 class="text-sm font-semibold mb-1">Specifications</h3>
        <ul>
          <li v-for="spec of specs" :key="spec" class="list-disc ms-6">
            <NuxtLink class="underline underline-offset-2" :to="spec">{{
              feature.spec
            }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="text-sm font-semibold mb-1">Browser compat data names</h3>
        <ul>
          <li
            v-for="compatFeature of feature.compatFeaturesEnhanced"
            :key="compatFeature.name"
            class="list-disc ms-6"
          >
            <div class="flex gap-2">
              <span>{{ compatFeature.name }}</span>

              <span v-if="compatFeature.mdnUrl">
                <NuxtLink
                  class="underline underline-offset-2"
                  :to="compatFeature.mdnUrl"
                >
                  MDN
                </NuxtLink>
              </span>

              <span>
                <NuxtLink
                  class="underline underline-offset-2"
                  :to="`https://caniuse.com/?search=${compatFeature.name}`"
                >
                  Can I Use
                </NuxtLink>
              </span>
            </div>
          </li>
        </ul>
      </div>

      <details class="flex gap-2 border-slate-500 border-t pt-3">
        <summary class="w-100 cursor-pointer">
          <h3 class="inline text-sm font-semibold mb-1">Original data</h3>
        </summary>
        <div>
          <pre class="whitespace-pre-wrap">{{
            JSON.stringify(feature, null, 2)
          }}</pre>
        </div>
      </details>
    </div>
  </details>
</template>

<script lang="ts" setup>
import { objectKeys, ENGINES } from "#imports"

const { feature } = defineProps<{
  feature: WebFeature
}>()

const specs = computed(() =>
  Array.isArray(feature.spec) ? feature.spec : [feature.spec],
)

const lowDateShort = computed(() => {
  if (feature.status.baseline_low_date) {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "2-digit",
    }).format(new Date(feature.status.baseline_low_date))
  }
  return null
})

const lowDateFull = computed(() => {
  if (feature.status.baseline_low_date) {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "short",
    }).format(new Date(feature.status.baseline_low_date))
  }
  return null
})

const supported = (browser: BrowserGroup) => {
  return browser.ids
    .map((id) => feature.status.support?.[id])
    .every((version) => Boolean(version))
}

const engineTitle = (browsers: BrowserGroup[]) =>
  browsers
    .map((browser, index, array) => {
      const previous = index > 0 ? supported(array[index - 1]) : undefined
      const current = supported(browser)
      const name = browser.name
      return typeof previous === "undefined"
        ? current
          ? `Supported in ${name}`
          : `Not widely supported in ${name}`
        : current === previous
          ? ` and ${name}`
          : current
            ? `, and supported in ${name}`
            : `, and not widely supported in ${name}`
    })
    .join("")
</script>

<style scoped>
.baseline-indicator {
  --baseline-high-bg: #e6f4ea;
  --baseline-high-engine-bg: #ceead6;
  --baseline-high-img: url("~/assets/baseline/high.svg");
  --baseline-high-check: #099949;
  --baseline-low-bg: #e8f0fe;
  --baseline-low-engine-bg: #d2e3fc;
  --baseline-low-check: #1a73e8;
  --baseline-low-img: url("~/assets/baseline/low.svg");
  --baseline-low-pill-bg: #3367d6;
  --baseline-low-pill-color: #f1f3f4;
  --baseline-limited-bg: #f1f3f4;
  --baseline-limited-engine-bg: #e3e6e8;
  --baseline-limited-img: url("~/assets/baseline/limited.svg");
  --baseline-limited-check: #1e8e3e;
  --baseline-limited-cross: #ea8600;

  --baseline-bg: var(--baseline-limited-bg);
  --baseline-engine-bg: var(--baseline-limited-engine-bg);
  --baseline-img: var(--baseline-limited-img);
  --baseline-check: var(--baseline-limited-check);
  --baseline-cross: var(--baseline-limited-cross);
  --feedback-link-icon: var(--icon-primary);

  &.high {
    --baseline-bg: var(--baseline-high-bg);
    --baseline-engine-bg: var(--baseline-high-engine-bg);
    --baseline-img: var(--baseline-high-img);
    --baseline-check: var(--baseline-high-check);
  }

  &.low {
    --baseline-bg: var(--baseline-low-bg);
    --baseline-engine-bg: var(--baseline-low-engine-bg);
    --baseline-img: var(--baseline-low-img);
    --baseline-check: var(--baseline-low-check);
    --baseline-pill-bg: var(--baseline-low-pill-bg);
    --baseline-pill-color: var(--baseline-low-pill-color);
  }
}

@media (prefers-color-scheme: dark) {
  .baseline-indicator {
    --baseline-high-bg: #0e2a10;
    --baseline-high-engine-bg: #031b05;
    --baseline-high-img: url("~/assets/baseline/high-dark.svg");
    --baseline-high-check: #099949;
    --baseline-low-bg: #041e49;
    --baseline-low-engine-bg: #020d20;
    --baseline-low-check: #1a73e8;
    --baseline-low-img: url("~/assets/baseline/low-dark.svg");
    --baseline-low-pill-bg: #3367d6;
    --baseline-low-pill-color: #f1f3f4;
    --baseline-limited-bg: #282a2c;
    --baseline-limited-engine-bg: #1d1e1f;
    --baseline-limited-img: url("~/assets/baseline/limited-dark.svg");
  }
}

.engine {
  background: var(--baseline-engine-bg);
  border-radius: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem 0.625rem;

  .browser {
    display: flex;

    &::before {
      background-repeat: no-repeat;
      background-size: contain;
      content: "";
      display: block;
      height: 1.25rem;
      width: 1.25rem;
    }

    &.chrome::before {
      background-image: url("~/assets/baseline/chrome.svg");
    }
    &.edge::before {
      background-image: url("~/assets/baseline/edge.svg");
    }
    &.firefox::before {
      background-image: url("~/assets/baseline/firefox.svg");
    }
    &.safari::before {
      background-image: url("~/assets/baseline/safari.svg");
    }

    &::after {
      background-color: var(--baseline-cross);
      content: "";
      display: block;
      height: 1.25rem;
      mask-image: url("~/assets/baseline/browser-cross.svg");
      mask-repeat: no-repeat;
      mask-size: contain;
      width: 1rem;
    }

    &.supported::after {
      background-color: var(--baseline-check);
      mask-image: url("~/assets/baseline/browser-check.svg");
    }
  }
}

details[open] .chevron {
  rotate: 180deg;
  transition: rotate 140ms ease-out;
}
</style>
