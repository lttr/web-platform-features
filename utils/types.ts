import type { WebFeatureInputWithId } from "./web-features-input"
import type { EnhancedCompatFeature } from "./web-features-output"

export interface WebFeature extends WebFeatureInputWithId {
  compatFeaturesEnhanced: EnhancedCompatFeature[]
}

export const Views = ["all", "limited", "low", "high"] as const
export type View = (typeof Views)[number]
