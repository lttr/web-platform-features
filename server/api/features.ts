import type {
  EnhancedCompatFeature,
  WebFeature,
} from "~/utils/web-features-output"
import { getBrowserCompatDataCached } from "../utils/browser-compat-data"

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

  const webFeaturesEnhanced = webFeaturesPackage.features as WebFeature[]

  for (const feature of webFeaturesEnhanced) {
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
    features: webFeaturesEnhanced,
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
