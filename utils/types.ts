export interface WebFeature extends WebFeatureInputWithId {
  compatFeaturesEnhanced: EnhancedCompatFeature[]
}

export const Views = ["all", "limited", "low", "high"] as const
export type View = (typeof Views)[number]
