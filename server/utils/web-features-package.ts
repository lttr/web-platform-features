import type { H3Event } from "h3"
import {
  type WebFeatureWithId,
  WebFeaturesRecordSchema,
} from "~/utils/web-features-schema"

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

export const getWebFeaturesPackageCached = defineCachedFunction(
  async (_event: H3Event) => {
    const data = (await $fetch(latestReleaseUrl)) as GithubReleaseData
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
      const data = await response.json()
      const parsedData = WebFeaturesRecordSchema.parse(data)
      const list: WebFeatureWithId[] = Object.entries(parsedData).map(
        ([key, value]) => ({
          id: key,
          ...value,
        }),
      )
      return {
        features: list,
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
