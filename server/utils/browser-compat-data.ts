import type { H3Event } from "h3"

const latestReleaseUrl =
  "https://api.github.com/repos/mdn/browser-compat-data/releases/latest"

interface GithubReleaseData {
  assets: Array<{ name: string; browser_download_url: string }>
  html_url: string
  published_at: string
  tag_name: string
}

/**
 * Walk the BCD tree and extract a flat map of dot-path -> mdn_url.
 * This avoids caching the entire ~80MB+ BCD object in memory.
 */
function extractMdnUrls(
  obj: Record<string, unknown>,
  prefix = "",
  result: Record<string, string> = {},
): Record<string, string> {
  for (const [key, value] of Object.entries(obj)) {
    if (key === "__compat" || !value || typeof value !== "object") {
      continue
    }

    const path = prefix ? `${prefix}.${key}` : key
    const node = value as Record<string, unknown>
    const compat = node.__compat as { mdn_url?: string } | undefined

    if (compat?.mdn_url) {
      result[path] = compat.mdn_url
    }

    extractMdnUrls(node, path, result)
  }

  return result
}

export const getBrowserCompatDataCached = defineCachedFunction(
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
      const response = await fetch(featuresDataUrl)
      const fullBcd = await response.json()

      // Extract only MDN URLs (small map) from the massive BCD object,
      // then let the full object be garbage collected
      const mdnUrls = extractMdnUrls(fullBcd as Record<string, unknown>)

      const endTime = performance.now()
      console.log(
        "Fetching browser-compat-data took ",
        Math.floor(endTime - startTime),
        "ms",
      )

      return {
        mdnUrls,
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
    name: "browser-compat-data",
  },
)
