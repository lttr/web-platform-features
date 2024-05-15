<template>
  <details class="">
    <summary>
      <div class="flex gap-3 items-center">
        <h2 class="font-semibold">{{ feature.name }}</h2>
        <span
          v-if="!feature.status.baseline"
          class="w-5 h-5 bg-[url(~/assets/baseline/limited.svg)] dark:bg-[url(~/assets/baseline/limited-dark.svg)] bg-no-repeat bg-center"
        ></span>

        <span
          v-if="feature.status.baseline === 'low'"
          class="w-5 h-5 bg-[url(~/assets/baseline/low.svg)] dark:bg-[url(~/assets/baseline/low-dark.svg)] bg-no-repeat bg-center"
        ></span>

        <span
          v-if="feature.status.baseline === 'high'"
          class="w-5 h-5 bg-[url(~/assets/baseline/high.svg)] dark:bg-[url(~/assets/baseline/high-dark.svg)] bg-no-repeat bg-center"
        ></span>
      </div>
      <span
        class="indicator"
        role="img"
        :aria-label="level !== 'not' ? 'Baseline Check' : 'Baseline Cross'"
      ></span>
      <h2>
        <template v-if="level !== 'not'">
          Baseline
          <span class="not-bold">
            {{
              level === "high" ? "Widely available" : low_date?.getFullYear()
            }}
          </span>
        </template>
        <template v-else>
          <span class="not-bold">Limited availability</span>
        </template>
      </h2>
      <div v-if="level === 'low'" class="pill">Newly available</div>

      <div class="browsers">
        <span
          v-for="{ name, browsers } of ENGINES"
          :key="name"
          class="engine"
          :title="engineTitle(browsers)"
        >
          <span
            v-for="browser of browsers"
            :key="browser.ids[0]"
            :class="`browser ${browser.ids[0]} ${supported(browser) ? 'supported' : ''}`"
            role="img"
            :aria-label="`${browser.name} ${supported(browser) ? 'check' : 'cross'}`"
          ></span>
        </span>
      </div>

      <Icon name="chevron" />
    </summary>
  </details>
</template>

<script lang="ts" setup>
const { feature } = defineProps<{
  feature: Feature
}>()

const low_date = computed(() =>
  feature.status.baseline_low_date
    ? new Date(feature.status.baseline_low_date)
    : undefined,
)

const level = computed(() =>
  feature.status.baseline
    ? feature.status.baseline
    : feature.status.baseline === false
      ? "not"
      : undefined,
)

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
:root {
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
}

/* $browsers: "chrome", "edge", "firefox", "safari"; */

.baseline-indicator {
  --baseline-bg: var(--baseline-limited-bg);
  --baseline-engine-bg: var(--baseline-limited-engine-bg);
  --baseline-img: var(--baseline-limited-img);
  --baseline-check: var(--baseline-limited-check);
  --baseline-cross: var(--baseline-limited-cross);
  --feedback-link-icon: var(--icon-primary);

  background: var(--baseline-bg);
  border-radius: 0.25rem;
  margin: 1rem 0;
  padding-left: 3.8125rem;
  border: 1px solid var(--baseline-bg);

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

  &[open] {
    summary .icon-chevron {
      transform: rotate(180deg);
    }
  }

  summary {
    --chevron-size: 0.6875rem;
    --chevron-padding-left: 0.75rem;
    --chevron-padding-right: 1.25rem;

    align-items: center;
    cursor: pointer;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: space-between;
    padding: 1rem 0;
    padding-right: calc(
      var(--chevron-padding-left) + var(--chevron-size) +
        var(--chevron-padding-right)
    );
    position: relative;

    &::-webkit-details-marker {
      /* // Remove arrow from older versions of Safari. */
      display: none;
    }

    .indicator {
      --width: 2.3125rem;

      background-image: var(--baseline-img);
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      display: block;
      height: 2.25rem;
      left: calc(-0.5rem - var(--width));
      position: absolute;
      top: 1rem;
      width: var(--width);
    }

    h2 {
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 0;
      line-height: 1.5;
      margin: 0;
      padding: 0.375rem 0;

      .not-bold {
        font-weight: normal;
      }
    }

    .pill {
      --baseline-pill-bg: var(--baseline-low-pill-bg);
      background: var(--baseline-pill-bg);
      border-radius: 0.125rem;
      --baseline-pill-color: var(--baseline-low-pill-color);
      color: var(--baseline-pill-color);
      font-size: 0.75rem;
      font-weight: 600;
      margin-right: auto;
      padding: 0 0.25rem;
      text-transform: uppercase;
    }

    .browsers {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;

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

          /* @each $name in $browsers { */
          /*   &.#{$name}::before { */
          /*     background-image: url("~/assets/baseline/" + $name + ".svg"); */
          /*   } */
          /* } */

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
    }

    .icon-chevron {
      --icon-size: var(--chevron-size);
      --icon-primary: var(--text-primary);
      position: absolute;
      right: var(--chevron-padding-right);
    }
  }

  .extra {
    padding-bottom: 1.5rem;
    padding-right: 1rem;

    p {
      margin-bottom: 1rem;
      margin-top: 0;
    }

    ul {
      column-gap: 1.5rem;
      display: flex;
      flex-wrap: wrap;
      margin: 0;
      padding: 0;
      row-gap: 1rem;

      li {
        font-weight: 500;
        list-style: none;
        margin: 0;

        a.learn-more {
          &,
          &:active,
          &:visited {
            background: none;
            color: var(--text-link);
          }
        }

        a:not(.learn-more) {
          &,
          &:active,
          &:visited {
            background: none;
            color: var(--text-primary);
          }
        }
      }
    }
  }
}
</style>
