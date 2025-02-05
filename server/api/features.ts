import type { WebFeature } from "~/utils/types"
import type { EnhancedCompatFeature } from "~/utils/web-features-output"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getValue(path: string, obj: any): unknown {
  let result = obj
  for (const property of path.split(".")) {
    result = result && result[property]
  }
  return result
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getMdnUrl(name: string, bcd: any): string | undefined {
  const nestedObject = getValue(name, bcd) as {
    __compat: { mdn_url: string }
  }
  return nestedObject?.__compat?.mdn_url
}

// Sanitize date because of
// https://github.com/web-platform-dx/web-features/pull/1398
function sanitizeDate(date: string | undefined): string | undefined {
  return date?.replace("≤", "")
}

export default defineEventHandler(async (event) => {
  const startTimeData = performance.now()

  const [webFeaturesPackage, browserCompatDataPackage] = await Promise.all([
    getWebFeaturesPackageCached(event),
    getBrowserCompatDataCached(event),
  ])

  const endTimeData = performance.now()
  console.log(
    "Retrieving data for features took ",
    Math.floor(endTimeData - startTimeData),
    "ms",
  )

  const startTimeTransform = performance.now()

  for (const feature of webFeaturesPackage.features as WebFeature[]) {
    feature.status.baseline_low_date = sanitizeDate(
      feature.status.baseline_low_date,
    )
    feature.status.baseline_high_date = sanitizeDate(
      feature.status.baseline_high_date,
    )

    if (feature.compat_features) {
      const enhancedCompatFeatures: EnhancedCompatFeature[] = []
      for (const name of feature.compat_features) {
        const mdnUrl = getMdnUrl(name, browserCompatDataPackage.bcd)
        enhancedCompatFeatures.push({ name, mdnUrl })
      }
      feature.compatFeaturesEnhanced = enhancedCompatFeatures
    }
  }

  const endTimeTransform = performance.now()
  console.log(
    "Processing features data took ",
    Math.floor(endTimeTransform - startTimeTransform),
    "ms",
  )

  return {
    features: webFeaturesPackage.features,
    groups: webFeaturesPackage.groups,
    snapshots: webFeaturesPackage.snapshots,
    bcd: {
      htmlUrl: browserCompatDataPackage.htmlUrl,
      publishedAt: browserCompatDataPackage.publishedAt,
      version: browserCompatDataPackage.version,
    },
    wf: {
      htmlUrl: webFeaturesPackage.htmlUrl,
      publishedAt: webFeaturesPackage.publishedAt,
      version: webFeaturesPackage.version,
    },
  }
})
