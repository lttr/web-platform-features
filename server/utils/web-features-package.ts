import type { H3Event } from "h3"
import type { WebFeature } from "~/utils/types"
import { WebFeaturesRecordInputSchema } from "~/utils/web-features-input"
import type {
  OriginalFeatures,
  OriginalGroup,
  OriginalSnapshot,
} from "~/utils/web-features-output"

// Alternatively: data from a CDN
// const webFeaturesUrl = "https://cdn.jsdelivr.net/npm/web-features/index.json"

const latestReleaseUrl =
  "https://api.github.com/repos/web-platform-dx/web-features/releases/latest"

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

    const data = (await $fetch(latestReleaseUrl, {
      headers: { "User-Agent": "web-features" },
    })) as GithubReleaseData

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
      const parsedData = WebFeaturesRecordInputSchema.parse(data.features)
      const list: WebFeature[] = Object.entries(parsedData).map(
        ([key, feature]) => {
          return {
            ...feature,
            id: key,
            compatFeaturesEnhanced: [],
          }
        },
      )

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
