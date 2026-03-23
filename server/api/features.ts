import type { WebFeature } from "~/utils/types"
import type { EnhancedCompatFeature } from "~/utils/web-features-output"
import { getInterop2025FeatureIds } from "../utils/interop-2025-mapping"

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

  const interop2025Ids = getInterop2025FeatureIds()

  for (const feature of webFeaturesPackage.features as WebFeature[]) {
    feature.status.baseline_low_date = sanitizeDate(
      feature.status.baseline_low_date,
    )
    feature.status.baseline_high_date = sanitizeDate(
      feature.status.baseline_high_date,
    )

    // Mark if feature is part of Interop 2025
    feature.isInterop2025 = interop2025Ids.has(feature.id)

    if (feature.compat_features) {
      const enhancedCompatFeatures: EnhancedCompatFeature[] = []
      for (const name of feature.compat_features) {
        const mdnUrl = browserCompatDataPackage.mdnUrls[name]
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
