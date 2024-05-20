import type webFeatures from "web-features"

export type OriginalFeatures = typeof webFeatures
export type OriginalFeature = OriginalFeatures[string]

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
