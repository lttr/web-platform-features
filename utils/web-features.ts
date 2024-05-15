import type webFeatures from "web-features"

export type OriginalFeatures = typeof webFeatures

export type OriginalFeature = OriginalFeatures[number]

export type Feature = OriginalFeature & { id: string }

export type Features = Feature[]

export type browserIdentifier =
  | "chrome"
  | "chrome_android"
  | "edge"
  | "firefox"
  | "firefox_android"
  | "safari"
  | "safari_ios"

export type BaselineHighLow = "high" | "low"

export interface SupportStatus {
  /** Whether the feature is Baseline (low substatus), Baseline (high substatus), or not (false) */
  baseline: BaselineHighLow | false
  /** Date the feature achieved Baseline low status */
  baseline_low_date?: string
  /** Date the feature achieved Baseline high status */
  baseline_high_date?: string
  /** Browser versions that most-recently introduced the feature */
  support: {
    [K in browserIdentifier]?: string
  }
}

export interface BrowserGroup {
  name: string
  ids: browserIdentifier[]
}

export const ENGINES: {
  name: string
  browsers: BrowserGroup[]
}[] = [
  {
    name: "Blink",
    browsers: [
      { name: "Chrome", ids: ["chrome", "chrome_android"] },
      { name: "Edge", ids: ["edge"] },
    ],
  },
  {
    name: "Gecko",
    browsers: [{ name: "Firefox", ids: ["firefox", "firefox_android"] }],
  },
  {
    name: "WebKit",
    browsers: [{ name: "Safari", ids: ["safari", "safari_ios"] }],
  },
]
