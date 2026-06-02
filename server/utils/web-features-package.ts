import type { H3Event } from "h3"
import type { WebFeature } from "~/utils/types"
import {
  WebFeatureInputSchema,
  type WebFeatureInput,
} from "~/utils/web-features-input"
import type {
  OriginalFeatures,
  OriginalGroup,
  OriginalSnapshot,
} from "~/utils/web-features-output"

// Alternatively: data from a CDN
// const webFeaturesUrl = "https://cdn.jsdelivr.net/npm/web-features/index.json"

// The repo is a monorepo: `releases/latest` may point to a non-data
// release (e.g. `compute-baseline/v0.5.0`) which has no `data.json`.
// Fetch the release list and pick the newest stable `web-features`
// data release (tag `vX.Y.Z`), skipping `next` and other packages.
const releasesUrl =
  "https://api.github.com/repos/web-platform-dx/web-features/releases?per_page=30"

const webFeaturesTagPattern = /^v\d+\.\d+\.\d+$/

interface GithubReleaseData {
  assets: Array<{ name: string; browser_download_url: string }>
  html_url: string
  published_at: string
  tag_name: string
}

interface WebFeaturesData {
  features: OriginalFeatures
  snapshots: OriginalSnapshot
  groups: OriginalGroup
}

export const getWebFeaturesPackageCached = defineCachedFunction(
  async (_event: H3Event) => {
    const startTime = performance.now()

    const releases = (await $fetch(releasesUrl, {
      headers: { "User-Agent": "web-features" },
    })) as GithubReleaseData[]

    // Releases are returned newest-first; take the first stable
    // web-features data release that ships a `data.json`.
    const data = releases.find(
      (release) =>
        webFeaturesTagPattern.test(release.tag_name) &&
        release.assets.some((asset) => asset.name === "data.json"),
    )

    if (!data) {
      throw new Error("No web-features data release found on GitHub!")
    }

    const htmlUrl = data.html_url
    const tagName = data.tag_name
    const publishedAt = data.published_at
    const featuresDataUrl = data.assets.find(
      (asset: { name: string }) => asset.name === "data.json",
    )?.browser_download_url

    if (featuresDataUrl) {
      // The URL is ment to be used for data downloading inside browser
      // and ofetch does not handle it at I need
      const response = await fetch(featuresDataUrl)
      const data = (await response.json()) as WebFeaturesData

      // Filter out invalid features individually
      const validFeatures: Record<string, WebFeatureInput> = {}
      const invalidFeatures: string[] = []

      for (const [key, feature] of Object.entries(data.features)) {
        // Skip tombstone entries for moved/split features.
        // Since web-features v3.29.0 every entry carries a `kind`
        // ("feature" | "moved" | "split"), so only skip non-feature kinds.
        if (
          feature &&
          typeof feature === "object" &&
          "kind" in feature &&
          feature.kind !== "feature"
        ) {
          continue
        }
        const validation = WebFeatureInputSchema.safeParse(feature)
        if (validation.success) {
          validFeatures[key] = validation.data
        } else {
          invalidFeatures.push(key)
        }
      }

      if (invalidFeatures.length > 0) {
        console.error("Invalid features found:", invalidFeatures)
      }

      const list: WebFeature[] = Object.entries(validFeatures).map(
        ([key, feature]) => {
          return {
            ...feature,
            id: key,
            compatFeaturesEnhanced: [],
          }
        },
      )

      // Fail loudly instead of silently serving an empty dataset, which
      // would otherwise render as "0 features" with a healthy HTTP 200.
      // Usually means upstream schema drift broke validation/filtering.
      if (list.length === 0) {
        throw new Error(
          `web-features ${tagName}: 0 valid features (upstream schema drift?)`,
        )
      }

      const endTime = performance.now()
      console.log(
        "Fetching web features took ",
        Math.floor(endTime - startTime),
        "ms",
      )

      return {
        features: list,
        groups: data.groups,
        snapshots: data.snapshots,
        htmlUrl,
        publishedAt,
        version: tagName,
      }
    }

    throw new Error("No data downloaded from Github!")
  },
  {
    maxAge: 60 * 60 * 24, // 24 hours
    staleMaxAge: 60 * 60, // 1 hour
    name: "web-features-package",
  },
)
