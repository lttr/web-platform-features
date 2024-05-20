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
function getMdnUrl(name: string, bcd: any): string {
  const nestedObject = getValue(name, bcd) as {
    __compat: { mdn_url: string }
  }
  return nestedObject.__compat.mdn_url
}

export default defineEventHandler(async (event) => {
  const [webFeaturesPackage, browserCompatDataPackage] = await Promise.all([
    getWebFeaturesPackageCached(event),
    getBrowserCompatDataCached(event),
  ])

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
